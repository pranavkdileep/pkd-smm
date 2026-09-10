# ⚡ PKD-SMM

> A modern SMM panel — social media services storefront with user dashboards, admin back-office, payments, and background order sync.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Astryx](https://img.shields.io/badge/Astryx_UI-0.4.5-8A2BE2)

---

## ✨ Features

**👤 User side**
- 🔐 Email/password auth with email verification (Resend) & JWT sessions
- 🛒 Service catalog (Instagram, Telegram, YouTube, TikTok, Facebook, X) with ordering
- 💳 Balance deposits via [Dodo Payments](https://dodopayments.com) (test & live modes)
- 📦 Order tracking with automatic status sync from upstream providers
- 🎫 Support ticket system with comments
- 🧾 Full transaction ledger

**🛠️ Admin side**
- 📊 Dashboard stats at a glance
- 👥 User management
- 🧰 Service & upstream provider management
- 💰 Deposit approval & transaction oversight
- 🎟️ Support ticket replies
- 🖥️ Terminal TUI for managing admin accounts (`npm run admin`)

**⚙️ Platform**
- 🔄 Background workflows (signup, upstream ordering, order-status sync) via Workflow DevKit
- 🎨 UI built on [Astryx](https://www.npmjs.com/package/@astryxdesign/core) design system + Tailwind CSS 4

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A MongoDB instance
- (Optional) Resend + Dodo Payments accounts

### 1. Install
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```
Fill in the values — see [Environment Variables](#-environment-variables).

### 3. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Create your first admin
```bash
npm run admin
```
An interactive terminal UI to **add / edit / remove / list** admin users. Passwords are hashed with scrypt (same format as the app), and it refuses to delete the last admin. Then log in at `/login`.

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB` | Database name (default: `pkd-smm`) |
| `JWT_SECRET` | Secret for signing session tokens |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `EMAIL_FROM` | Sender identity, e.g. `PKD-SMM Panel <noreply@example.com>` |
| `DODO_PAYMENTS_ENVIRONMENT` | `test_mode` or `live_mode` |
| `DODO_PAYMENTS_TEST_API_KEY` / `DODO_PAYMENTS_TEST_PRODUCT_ID` | Used in test mode |
| `DODO_PAYMENTS_LIVE_API_KEY` / `DODO_PAYMENTS_PRODUCT_ID` | Used in live mode |

See [.env.example](.env.example) for a ready-to-copy template.

---

## 📜 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run admin` | 🖥️ TUI to manage admin users |

---

## 🗂️ Project Structure

```
├── actions/          # Server actions (auth, admin ops, deposits, orders, support, users)
├── app/
│   ├── admin/        # Admin back-office (users, services, orders, deposits, upstreams, support)
│   ├── user/         # User dashboard (services, orders, add-funds, support, settings)
│   ├── api/          # Payment webhooks & email verification endpoints
│   └── login/ signup/# Auth pages
├── lib/              # DB client, models, payments, email helpers
├── scripts/          # admin-users.mjs — admin account TUI
└── workflows/        # Background jobs (signup, upstream order, status sync)
```

---

## 💳 Payments

Deposits run through Dodo Payments. Set `DODO_PAYMENTS_ENVIRONMENT=test_mode` while developing and flip to `live_mode` (with the live credentials) when shipping. Webhook/callback endpoints live under `app/api/payments/`.

---

## 📦 Deployment

Any Node.js host that supports Next.js 16 works. The easiest path is [Vercel](https://vercel.com/new) — just add the environment variables from `.env.example` in the project settings.

---

<div align="center">
  Built with ❤️ by <b>pranavkd</b>
</div>
