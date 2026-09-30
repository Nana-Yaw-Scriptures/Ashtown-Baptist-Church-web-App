# Ashtown Baptist Church — church web app

A full church platform built with **Next.js (App Router)**, **Supabase**
(Postgres, Auth, row-level security), and **Stripe** for giving.

It includes:

- **Online giving** with Stripe Checkout and a webhook that records gifts
- **Sermon library** for video (YouTube) and audio
- **Events** with a month calendar and member RSVP
- **Prayer wall** with an "I prayed" count, public or staff-only posts
- **Member portal** (your events, gifts, and prayer requests)
- **Admin dashboard** to manage sermons, events, giving, prayer, and members

Everything is typed, uses server components, and enforces access with
Postgres row-level security rather than trusting the client.

---

## What you need

- Node.js 18.18 or newer (Node 20 recommended)
- A free [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account (test mode is fine)

---

## 1. Install

Open a terminal in the project folder and run:

```
npm install
```

## 2. Set up the database

1. In your Supabase project, open the **SQL Editor**.
2. Open `supabase/schema.sql` from this project, paste the whole file in, and run it.
   This creates the tables, security policies, and the trigger that donates
   every new user a profile.
3. Optionally run `supabase/seed.sql` the same way to add a few sample
   sermons, events, and giving funds so the site looks alive.

## 3. Add your environment variables

Copy the example file to `.env.local`:

```
copy .env.local.example .env.local
```

(That is the Windows command. On macOS or Linux use `cp` instead of `copy`.)

Then fill in the values:

- **Supabase** — Project Settings → API:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (keep this secret — server only)
- **Stripe** — Developers → API keys:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET` (from step 6 below)
- `NEXT_PUBLIC_SITE_URL` — leave as `http://localhost:3000` for local work.

## 4. Run the app

```
npm run dev
```

Open http://localhost:3000.

## 5. Make yourself an admin

1. Sign up through the app at `/signup`.
2. Back in the Supabase SQL Editor, run this with your email:

```
update public.profiles set role = 'admin' where email = 'you@example.com';
```

3. Refresh the app. You will now see an **Admin** link in the header, and
   `/admin` will open the dashboard.

## 6. Test giving with Stripe

Giving works without a webhook, but gifts are only marked "succeeded" once
Stripe confirms payment. To receive that confirmation locally, use the
Stripe CLI:

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run `stripe login`.
2. Forward events to your local app:

```
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

3. The CLI prints a signing secret that starts with `whsec_`. Put that in
   `.env.local` as `STRIPE_WEBHOOK_SECRET`, then restart `npm run dev`.
4. Donatea test gift using Stripe's test card `4242 4242 4242 4242`, any
   future expiry, and any CVC. It will appear under **Admin → Giving**.

---

## Deploying

The app deploys cleanly to [Vercel](https://vercel.com):

1. Push this project to a Git repository and import it in Vercel.
2. Add the same environment variables in the Vercel project settings, and
   set `NEXT_PUBLIC_SITE_URL` to your real domain.
3. In the Stripe dashboard, add a webhook endpoint pointing to
   `https://your-domain.com/api/stripe/webhook` for the
   `checkout.session.completed` event, and use its signing secret as
   `STRIPE_WEBHOOK_SECRET` in Vercel.
4. In Supabase → Authentication → URL Configuration, add your domain and
   `https://your-domain.com/auth/callback` to the allowed redirect URLs.

---

## Project layout

```
supabase/
  schema.sql            Tables, row-level security, triggers, views
  seed.sql              Sample funds, sermons, events
src/
  app/                  Routes (App Router)
    (public pages)      home, about, sermons, events, donate, prayer
    dashboard/          Member portal
    admin/              Staff dashboard (role-guarded)
    api/stripe/         Checkout + webhook route handlers
    login, signup       Email + password auth
  actions/              Server actions (auth, events, prayer, admin)
  components/           UI, cards, forms, navigation
  lib/                  Supabase clients, Stripe, types, helpers
middleware.ts           Refreshes the session, guards private routes
```

## A few notes

- **Security** is enforced in the database. Every table has row-level
  security, so even if a request reaches Supabase directly, people can only
  read and write what they are allowed to. The service-role key is used only
  in the Stripe routes on the server.
- **Prayer visibility**: a request marked "Staff only" is hidden from the
  public wall by row-level security and shows only to its author and admins.
- **Sermons** accept a YouTube link (it embeds automatically) or a direct
  audio URL (it uses an audio player). For real media hosting, Supabase
  Storage is a natural next step.
- The design avoids stock template styling on purpose. Colors, type, and
  layout live in `tailwind.config.ts` and `src/app/globals.css` if you want
  to make it your own.
