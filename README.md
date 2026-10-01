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

📘 **Want to build your own rating site from this template?** Read the step-by-step
**[Customization Guide](CUSTOMIZATION.md)**. It covers branding, colors, rating categories, the
database, new pages and features, and a full example of turning this into a movie rating site.

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
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
