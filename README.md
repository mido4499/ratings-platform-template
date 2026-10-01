# Rating Platform Template

A complete, working web app where people can **rate and review things**. Out of the box it is
*Sisyphus Apply*, a site for reviewing companies' job application processes. It is built so you can
copy it and turn it into your own rating platform (restaurants, courses, landlords, apps...) mostly
by editing **one config file**.

**Features**

- Browse and search items, each with an average star rating and a rating breakdown
- Sign up / sign in with email + password or with Google
- Write, edit and delete your own reviews (1–5 stars + text), one review per item
- Automatic review moderation: a bad-words filter plus an AI check with Claude
- Users can suggest new items; the admin approves or rejects them at `/admin` (with email notifications)
- Forgot-password emails, a personal dashboard, account settings
- SEO-ready: page titles, social-media previews, `sitemap.xml` and `robots.txt`

**Tech stack:** [Next.js 16](https://nextjs.org/docs) (App Router) · React 19 · TypeScript ·
Tailwind CSS 4 · [Prisma](https://www.prisma.io/docs) + PostgreSQL ·
[Auth.js / NextAuth](https://authjs.dev) · [Resend](https://resend.com) (emails) ·
[Anthropic Claude](https://docs.anthropic.com) (moderation)

---

## 1. Run it on your computer

You need [Node.js 20+](https://nodejs.org) and a PostgreSQL database. The easiest option is a free
database from [Neon](https://neon.tech): create a project and copy its connection string.

```bash
# 1. Install the dependencies (this also generates the Prisma database client)
npm install

# 2. Create your environment file, then open .env and fill in the values
cp .env.example .env

# 3. Create the database tables
npm run db:migrate

# 4. Start the app
npm run dev
```

Open <http://localhost:3000>. 🎉

To fill the site with sample data:

1. Sign up in the app using the email you set as `ADMIN_EMAIL` (sample items are owned by the admin).
2. Run `npm run db:seed` to add the sample items, then `npm run db:seed-reviews` to add sample reviews.

### Environment variables

All of them are explained in [.env.example](.env.example). In short:

| Variable | What it's for | Required? |
| --- | --- | --- |
| `NEXT_PUBLIC_URL` | The app's public URL, e.g. `https://my-site.com`. Used in email links, sitemap, SEO tags | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `ADMIN_EMAIL` | The account that can open `/admin` and receives submission emails | Yes |
| `AUTH_SECRET` | Signs login sessions. Generate with `npx auth secret` | Yes |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | "Sign in with Google" | For Google sign-in |
| `RESEND_API_KEY` | Sending emails | For emails |
| `EMAIL_FROM` | Sender address (default: `noreply@<your domain>`) | No |
| `ANTHROPIC_API_KEY` | AI moderation of reviews | For posting reviews |
| `AUTH_TRUST_HOST` | Set to `true` when hosting anywhere except Vercel | Sometimes |

> 🔒 Never commit `.env` — it contains secrets. `.env.example` is the safe, shareable version.
> If you also create a `.env.local`, its values override `.env` (handy for local-only settings
> such as `NEXT_PUBLIC_URL="http://localhost:3000"`).

---

## 2. Make it your own

> 📘 For a detailed, step-by-step guide (rating categories, database changes, new pages and
> features, and a full movie-site example), see **[CUSTOMIZATION.md](CUSTOMIZATION.md)**.

Work through this checklist to turn the template into a new platform:

1. **Name, wording and URL:** edit [src/config/site.ts](src/config/site.ts). It holds the site
   name, description, what is being rated (`item.singular` / `item.plural`, e.g. `"Restaurant"` /
   `"Restaurants"`), the home page text and image paths. Set your URL in `.env` (`NEXT_PUBLIC_URL`).
2. **Colors:** change the six color variables at the bottom of [app/globals.css](app/globals.css)
   (`--stone`, `--sand`, `--clay`, `--earth`, `--rock`, `--slate`).
3. **Images:** replace `public/logo.png` (home page logo) and `public/og-image.png` (navbar logo
   and social-media preview, 1200×630) with your own.
4. **Sample data:** replace the entries in [scripts/data/companies.ts](scripts/data/companies.ts)
   and [scripts/data/reviews.ts](scripts/data/reviews.ts) (5 reviews per item, in the same order).
5. **Moderation rules (optional):** the question asked to Claude about each review is in
   [src/lib/moderation.ts](src/lib/moderation.ts).
6. **Emails (optional):** email wording is in [src/lib/email.ts](src/lib/email.ts).

> 💡 Inside the code, the database and the URLs, the rated thing is always called a **company**
> (`Company` model, `/companies/...` pages). Users never see that word if you change
> `item` in the config, so you don't need to rename it. If you do want to, rename the `Company`
> model in `prisma/schema.prisma`, run `npm run db:migrate`, and follow the TypeScript errors.

---

## 3. How the project is organized

```
├── app/                      Pages and API routes (Next.js App Router: folder = URL)
│   ├── page.tsx              Home page (/)
│   ├── layout.tsx            Wraps every page: navbar, fonts, default SEO tags
│   ├── companies/            /companies list, /companies/[slug] detail, add item, add review
│   ├── reviews/              /reviews/[id]/edit
│   ├── dashboard/            The signed-in user's reviews, items and account settings
│   ├── admin/                Approve / reject submitted items (ADMIN_EMAIL only)
│   ├── sign-in, sign-up, forgot-password, reset-password/
│   ├── api/                  Backend endpoints called by the pages (see below)
│   ├── components/           Reusable UI pieces (forms, cards, navbar...)
│   ├── sitemap.ts, robots.ts SEO files, served as /sitemap.xml and /robots.txt
│   └── globals.css           Global styles and the color palette
├── src/
│   ├── config/site.ts        ⭐ Branding and wording — start here
│   └── lib/                  Shared helpers: database client, emails, moderation, ratings, admin check
├── prisma/
│   ├── schema.prisma         Database tables: User, Company, Review, PasswordResetToken
│   └── migrations/           History of database changes (created by `npm run db:migrate`)
├── scripts/                  One-off command-line scripts (seeding, testing email...)
│   └── data/                 Sample items and reviews used by the seed scripts
├── public/                   Images and icons, served from the site root (/logo.png)
├── auth.ts                   Sign-in setup (Google + email/password)
└── proxy.ts                  Runs before each request: redirects signed-out users from protected pages
```

### API routes

| Route | Methods | What it does |
| --- | --- | --- |
| `/api/companies` | GET, POST | Search approved items / submit a new item (signed in) |
| `/api/companies/[slug]` | GET, PUT, DELETE | One item / edit or delete it (its creator or the admin) |
| `/api/companies/[slug]/reviews` | GET, POST | An item's reviews / post a review (signed in) |
| `/api/reviews/[reviewId]` | GET, PUT, DELETE | One review / edit or delete it (its author; admin can delete) |
| `/api/admin/companies/[companyid]` | PATCH | Approve or reject an item (admin only) |
| `/api/user` | PATCH | Change your name or password |
| `/api/auth/...` | | Sign in/out (Auth.js), sign up, forgot/reset password |

### Life of an item

1. A signed-in user submits an item → it is saved with status `pending`, and the admin gets an email.
2. Only its creator (and the admin) can see a pending item.
3. The admin approves or rejects it at `/admin` → the creator gets an email.
4. Approved items appear in search, the list page and the sitemap. Rejected items are hidden.

---

## 4. Useful commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the app in development mode at http://localhost:3000 |
| `npm run build` / `npm start` | Build and run the production version |
| `npm run lint` | Check the code for common mistakes |
| `npm run db:migrate` | After editing `prisma/schema.prisma`: create a migration and update the database |
| `npm run db:deploy` | Apply existing migrations to a database (e.g. production) |
| `npm run db:studio` | Open Prisma Studio, a visual editor for your database |
| `npm run db:seed` | Add the sample items from `scripts/data/companies.ts` |
| `npm run db:seed-reviews` | Add the sample reviews from `scripts/data/reviews.ts` |
| `npm run test-email` | Send a test email to `ADMIN_EMAIL` to check Resend works |
| `npm run hash-password -- "secret"` | Print the bcrypt hash of a password |

---

## 5. Deploy

The simplest option is [Vercel](https://vercel.com/new):

1. Push the project to GitHub and import it in Vercel.
2. In **Settings → Environment Variables**, add every variable from your `.env`, with
   `NEXT_PUBLIC_URL` set to your real domain (e.g. `https://my-site.com`).
3. Apply the database migrations once: `npm run db:deploy` (with `DATABASE_URL` pointing to the
   production database).
4. In the Google Cloud console, add `https://my-site.com/api/auth/callback/google` as an
   authorized redirect URI. In Resend, verify your domain so emails can be sent from it.

> `NEXT_PUBLIC_*` variables are baked into the app when it is **built**, so redeploy after changing
> `NEXT_PUBLIC_URL`.

## Troubleshooting

- **Sign-in fails with `UntrustedHost`:** add `AUTH_TRUST_HOST=true` to `.env` (needed outside Vercel, including `npm start` locally).
- **Links in emails point to the wrong site:** check `NEXT_PUBLIC_URL` and rebuild.
- **Emails aren't arriving:** run `npm run test-email` and read the error. Usually the sender domain isn't verified in Resend.
- **"No user found with ADMIN_EMAIL" when seeding:** sign up in the app with your `ADMIN_EMAIL` first.
- **Prisma errors after changing the schema:** run `npm run db:migrate` (this also regenerates the client).
