import {MongoClient, type Db} from 'mongodb';
import type {
  AdminUser,
  Deposit,
  Order,
  Service,
  SupportTicket,
  SupportTicketComment,
  Transaction,
  UpstreamProvider,
  User,
} from './database';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB ?? 'pkd-smm';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set. Add it to .env.local');
}

declare global {
  var _mongoClient: MongoClient | undefined;
}

function createClient(): MongoClient {
  return new MongoClient(MONGODB_URI as string);
}

function getClient(): MongoClient {
  if (process.env.NODE_ENV === 'development') {
    globalThis._mongoClient ??= createClient();
    return globalThis._mongoClient;
  }
  return createClient();
}

export const client = getClient();

export function getDb(): Db {
  return client.db(MONGODB_DB);
}

export async function connectToDb(): Promise<Db> {
  await client.connect();
  return getDb();
}

export const collections = {
  users: getDb().collection<User>('users'),
  adminUsers: getDb().collection<AdminUser>('admin_users'),
  upstreamProviders: getDb().collection<UpstreamProvider>('upstream_providers'),
  services: getDb().collection<Service>('services'),
  orders: getDb().collection<Order>('orders'),
  deposits: getDb().collection<Deposit>('deposits'),
  transactions: getDb().collection<Transaction>('transactions'),
  supportTickets: getDb().collection<SupportTicket>('support_tickets'),
  supportTicketComments: getDb().collection<SupportTicketComment>('support_ticket_comments'),
};
