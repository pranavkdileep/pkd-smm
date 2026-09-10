#!/usr/bin/env node
// Interactive TUI to manage admin users in MongoDB (admin_users collection).
// Usage: node scripts/admin-users.mjs   (or: npm run admin)
import {randomBytes, randomUUID, scrypt as scryptCallback} from 'node:crypto';
import {promisify} from 'node:util';
import readline from 'node:readline/promises';
import {MongoClient} from 'mongodb';

try {
  process.loadEnvFile('.env.local');
} catch {
  // no .env.local — rely on real environment variables
}

const scrypt = promisify(scryptCallback);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const key = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${key.toString('hex')}`;
}

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set. Add it to .env.local');
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const admins = client.db(process.env.MONGODB_DB ?? 'pkd-smm').collection('admin_users');

const rl = readline.createInterface({input: process.stdin, output: process.stdout});

async function ask(question) {
  try {
    return (await rl.question(question)).trim();
  } catch {
    return '5'; // stdin closed (EOF / piped input) — quit cleanly
  }
}

async function list() {
  const users = await admins.find({}, {projection: {_id: 0, id: 1, username: 1}}).toArray();
  if (users.length === 0) {
    console.log('\nNo admin users.\n');
    return;
  }
  console.log('\nAdmin users:');
  users.forEach((u, i) => console.log(`  ${i + 1}. ${u.username}  (${u.id})`));
  console.log();
}

async function pickUser(action) {
  const users = await admins.find({}, {projection: {_id: 0, id: 1, username: 1}}).toArray();
  if (users.length === 0) {
    console.log('\nNo admin users.\n');
    return null;
  }
  users.forEach((u, i) => console.log(`  ${i + 1}. ${u.username}`));
  const answer = await ask(`\nSelect user to ${action} (1-${users.length}, empty to cancel): `);
  const index = Number(answer) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= users.length) {
    console.log('Cancelled.\n');
    return null;
  }
  return users[index];
}

async function add() {
  const username = await ask('Username: ');
  if (!username) return console.log('Username required.\n');
  if (await admins.findOne({username})) return console.log('Username already exists.\n');
  const password = await ask('Password: ');
  if (!password) return console.log('Password required.\n');
  await admins.insertOne({id: randomUUID(), username, passwordHash: await hashPassword(password)});
  console.log(`Added admin "${username}".\n`);
}

async function edit() {
  const user = await pickUser('edit');
  if (!user) return;
  const username = await ask(`New username (empty to keep "${user.username}"): `);
  const password = await ask('New password (empty to keep current): ');
  const update = {};
  if (username) {
    const taken = await admins.findOne({username, id: {$ne: user.id}});
    if (taken) return console.log('Username already exists.\n');
    update.username = username;
  }
  if (password) update.passwordHash = await hashPassword(password);
  if (Object.keys(update).length === 0) return console.log('Nothing to change.\n');
  await admins.updateOne({id: user.id}, {$set: update});
  console.log(`Updated admin "${update.username ?? user.username}".\n`);
}

async function remove() {
  const user = await pickUser('remove');
  if (!user) return;
  if ((await admins.countDocuments()) <= 1) {
    return console.log('Refusing to remove the last admin user.\n');
  }
  const confirm = await ask(`Really remove "${user.username}"? (y/N): `);
  if (confirm.toLowerCase() !== 'y') return console.log('Cancelled.\n');
  await admins.deleteOne({id: user.id});
  console.log(`Removed admin "${user.username}".\n`);
}

const actions = {1: list, 2: add, 3: edit, 4: remove};

while (true) {
  console.log('=== Admin Users ===');
  console.log('  1. List\n  2. Add\n  3. Edit\n  4. Remove\n  5. Quit');
  const choice = await ask('Choice: ');
  if (choice === '5' || choice.toLowerCase() === 'q') break;
  const action = actions[choice];
  if (action) await action();
  else console.log('Invalid choice.\n');
}

rl.close();
await client.close();
