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

🤖**But what if I just use AI?**
Great Idea! That's exactly what I had in mind while building the application. That's why AGENTS.md and CLAUDE.md files are there: to help you work with AI on the project.
However, if you want to work on your coding skills as a beginner before working with AI, the project is all yours!

---

## 1. Run it on your computer

You need [Node.js 20+](https://nodejs.org) and a PostgreSQL database. The easiest option is a free
database from [Neon](https://neon.tech): create a project and copy its connection string.

## 2. Deploy it

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mido4499/ratings-platform-template)

Click the button, connect a free Neon database, and fill in the
environment variables from `.env.example`. Your site will be live
in a few minutes.

## 3. Make it your own

Edit `[your config file]` to change the site name, colors, and
what people are rating. See the [Customization Guide](CUSTOMIZATION.md)
for a full walkthrough, including turning this into a movie rating site.

## Ideas for what to build

Restaurant reviews · Landlord ratings · Course reviews ·
Bootcamp reviews · App reviews · Local service providers

## Contributing

Issues and pull requests are welcome!

## License

MIT
