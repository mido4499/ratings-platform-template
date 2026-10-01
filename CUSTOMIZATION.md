# Customization Guide

This guide shows you how to turn this template into **your own rating platform**, step by step.
It is written for beginners: every section says which file to open, what to change, and how to
check that it worked.

> **Tip:** Make one change at a time, save, and look at the result in the browser. If something
> breaks, you'll know exactly which change caused it.

## Contents

1. [Before You Start](#1-before-you-start)
2. [Understanding the Project Structure](#2-understanding-the-project-structure)
3. [Changing the Website Name and Branding](#3-changing-the-website-name-and-branding)
4. [Changing Colors and Styling](#4-changing-colors-and-styling)
5. [Changing What Users Rate](#5-changing-what-users-rate)
6. [Changing Rating Categories](#6-changing-rating-categories)
7. [Modifying Reviews](#7-modifying-reviews)
8. [Modifying the Database](#8-modifying-the-database)
9. [Adding New Pages](#9-adding-new-pages)
10. [Adding New Features](#10-adding-new-features)
11. [Example: Turning This Into a Movie Rating Site](#11-example-turning-this-into-a-movie-rating-site)
12. [Common Problems](#12-common-problems)

---

## 1. Before You Start

### Get the app running first

Follow **[README.md](README.md) → "Run it on your computer"** before you change anything. You
should be able to open <http://localhost:3000>, sign up, and see the home page. If the original app
doesn't run, your changes won't either.

### Tools you'll use

| Tool | What it's for |
| --- | --- |
| A code editor (e.g. [VS Code](https://code.visualstudio.com)) | Editing files |
| A terminal | Running commands such as `npm run dev` |
| Your browser | Seeing your changes. Keep `npm run dev` running; pages reload by themselves when you save |
| Git | Saving checkpoints so you can undo mistakes |

### Use a separate database for experimenting

Several commands in this guide **change the database** (`npm run db:migrate`, `npm run db:seed`).
Never point your local `.env` at a database that real users depend on. Create a second free
database on [Neon](https://neon.tech) for development, and use that `DATABASE_URL` locally.

### Save a checkpoint before each big change

```bash
git add -A
git commit -m "Working version before changing X"
```

If you break something, `git diff` shows what you changed, and `git restore <file>` undoes changes
to a file.

### A few words you'll see

| Word | Meaning |
| --- | --- |
| **Component** | A reusable piece of UI, written as a function that returns HTML-like code (JSX). Lives in `app/components/` |
| **Page** | A file named `page.tsx`. Its folder path becomes the URL |
| **API route** | A file named `route.ts` in `app/api/`. The backend code that pages call to read or save data |
| **Prisma** | The library that talks to the database. The tables are described in `prisma/schema.prisma` |
| **Migration** | A saved change to the database structure, created with `npm run db:migrate` |
| **Slug** | The URL-friendly version of a name: "Acme Corp" → `acme-corp` → `/companies/acme-corp` |
| **Environment variable** | A setting stored in `.env` (URLs, passwords, API keys) instead of in the code |

---

## 2. Understanding the Project Structure

### The most important files

| If you want to change... | Open this file |
| --- | --- |
| Site name, wording, what's being rated, logo paths | `src/config/site.ts` ⭐ |
| The app's URL, database, API keys | `.env` (see `.env.example`) |
| Colors | `app/globals.css` (bottom of the file) |
| Logo and social-media preview image | `public/logo.png`, `public/og-image.png` |
| Database tables | `prisma/schema.prisma` |
| Sample data for the seed scripts | `scripts/data/companies.ts`, `scripts/data/reviews.ts` |
| Review moderation rules | `src/lib/moderation.ts` |
| Email wording | `src/lib/email.ts` |

### How a URL becomes a page

Next.js uses **folders as URLs**. Every `page.tsx` file is a page:

| File | URL |
| --- | --- |
| `app/page.tsx` | `/` (home) |
| `app/companies/page.tsx` | `/companies` |
| `app/companies/[slug]/page.tsx` | `/companies/google`, `/companies/apple`, ... |
| `app/companies/[slug]/add-review/page.tsx` | `/companies/google/add-review` |
| `app/dashboard/reviews/page.tsx` | `/dashboard/reviews` |

A folder name in square brackets, like `[slug]`, is a **dynamic segment**: it matches any value,
and the page receives that value as `params.slug`.

`app/layout.tsx` wraps **every** page. It adds the navbar, the font, and the default page title.

### How data flows

Here's what happens when someone posts a review:

```
ReviewForm.tsx (browser)
   │  fetch('/api/companies/google/reviews', { method: 'POST', body: {score, text} })
   ▼
app/api/companies/[slug]/reviews/route.ts (server)
   │  checks the user is signed in, validates the score, runs moderation
   │  prisma.review.create(...)
   ▼
PostgreSQL database (Review table)
```

There are two kinds of components:

- **Server components** (the default) run on the server. They can read the database directly with
  `prisma`, e.g. `app/companies/page.tsx`.
- **Client components** start with `'use client';` and run in the browser. They're needed for
  anything interactive: buttons, forms, `useState`. Example: `app/components/ReviewForm.tsx`.
  They **cannot** use `prisma` or secrets; they call API routes with `fetch` instead.

### The database tables

Open `prisma/schema.prisma`. There are four tables (Prisma calls them *models*):

| Model | Stores | Key fields |
| --- | --- | --- |
| `User` | Accounts | `email`, `name`, `password` (hashed; empty for Google users) |
| `Company` | The things being rated | `name`, `slug`, `description`, `status` (`pending` / `approved` / `rejected`), `userId` (who added it) |
| `Review` | Ratings and reviews | `score` (1–5), `text`, `userId`, `companyId`. One review per user per company |
| `PasswordResetToken` | Forgot-password links | `token`, `expiresAt` |

---

## 3. Changing the Website Name and Branding

### Step 1: Edit the site config

Open **`src/config/site.ts`** and change the values:

```ts
export const siteConfig = {
    name: 'Bite Rating',                     // shown in tabs, emails, the home page
    tagline: 'Honest Restaurant Reviews',    // home page tab: "Bite Rating - Honest Restaurant Reviews"
    description: 'Find the best places to eat, rated by real diners.',
    // ...
    home: {
        headlinePrefix: 'Where should',      // "Where should Bite Rating eat tonight?"
        headlineSuffix: 'eat tonight?',
        searchPlaceholder: 'Search for a restaurant',
    },
    // ...
};
```

Save the file and refresh the browser. The home page, the tab title and the menus change
right away.

**What uses these values automatically:** every page title (through the title template in
`app/layout.tsx`), social-media previews, the navbar and home page, all emails, the sitemap and
robots.txt.

### Step 2: Set your URL

In **`.env`**:

```bash
NEXT_PUBLIC_URL="https://biterating.com"
```

This is used for links in emails, the sitemap and social-media previews. Don't put a `/` at the
end. Locally you can keep `http://localhost:3000`.

> Changing a `NEXT_PUBLIC_...` variable requires restarting `npm run dev` (and a rebuild +
> redeploy in production).

### Step 3: Replace the images

| File | Where it appears | Recommended size |
| --- | --- | --- |
| `public/logo.png` | Large logo on the home page | Any; it's scaled down |
| `public/og-image.png` | Small logo in the navbar, and the preview image when your link is shared | 1200 × 630 px |
| `app/favicon.ico` | Browser tab icon | 32 × 32 or 48 × 48 |

The easiest way is to **replace the files and keep the same names**. If you want different names
(e.g. `public/my-logo.svg`), update the paths in `images` in `src/config/site.ts`.

### Step 4: Text that is *not* in the config

A few sentences are written directly in components. Search for them with your editor's
"Find in Files" (VS Code: `Cmd/Ctrl + Shift + F`):

| Text | File |
| --- | --- |
| "How was your experience?" and the review box placeholder | `app/components/ReviewInput.tsx` |
| Star labels ("Awful" ... "Amazing") | `app/components/RatingInput.tsx` |
| "Add Your Touch" (menu button when signed out) | `app/components/UserMenu.tsx` |
| Moderation error messages ("Your review contains...") | `app/api/companies/[slug]/reviews/route.ts`, `app/api/reviews/[reviewId]/route.ts` |
| "Dashboard", "Account Settings" | `app/components/DashboardSideBar.tsx`, `app/components/AccountSettings.tsx` |

---

## 4. Changing Colors and Styling

### The color palette

The whole app uses six colors, defined at the bottom of **`app/globals.css`**:

```css
:root {
  --stone:      #F5F0E8;  /* light beige: page background */
  --sand:       #E8D5B7;  /* warm sand: cards, surfaces */
  --clay:       #C4A882;  /* tan: borders, hover backgrounds */
  --earth:      #8B6F47;  /* brown: secondary text, rating bars */
  --rock:       #5C4033;  /* deep brown: main text */
  --slate:      #3D2B1F;  /* almost black: headings, buttons */
}
```

Change the hex values and the whole site re-themes. You can pick colors with a tool like
[coolors.co](https://coolors.co). Keep the same idea: `--stone` is the lightest, `--slate`
the darkest, so text stays readable.

Example: a dark-blue "cinema" theme:

```css
:root {
  --stone:      #F4F6FB;
  --sand:       #DCE3F2;
  --clay:       #A9B6D6;
  --earth:      #4F5F8F;
  --rock:       #2E3A5F;
  --slate:      #141B33;
}
```

> Keep the **names** (`--stone`, `--sand`...) the same. Components refer to them by name, e.g.
> `className="bg-(--sand) text-(--slate)"`. If you rename one, you must rename every use.

### Styling individual elements (Tailwind CSS)

Components are styled with **Tailwind CSS** classes in the `className` attribute. Each class does one
thing:

```tsx
<h1 className="text-3xl md:text-6xl font-semibold text-(--slate)">
```

| Class | Meaning |
| --- | --- |
| `text-3xl` | Font size (`text-sm` small ... `text-7xl` huge) |
| `md:text-6xl` | Font size on screens wider than 768px. The `md:` prefix means "on medium screens and up" |
| `font-semibold` | Bold-ish text |
| `text-(--slate)` / `bg-(--sand)` | Text / background color from the palette |
| `p-6`, `m-4`, `gap-4` | Padding, margin, spacing between items |
| `rounded-2xl` | Rounded corners |
| `flex`, `flex-col` | Lay children out in a row / column |

Look up any class in the [Tailwind docs](https://tailwindcss.com/docs). Because the site is
styled for both phones and desktops, check your changes at both sizes: in your browser, open the
developer tools (`F12`) and toggle the device toolbar.

### Changing the font

The font (Lato) is loaded in `app/layout.tsx`:

```tsx
import { Lato } from "next/font/google";

const lato = Lato({ variable: "--font-lato", subsets: ["latin"], weight: ["400", "700"] });
```

To use a different [Google Font](https://fonts.google.com), e.g. Poppins, replace `Lato` with
`Poppins` in both places. Keep `variable: "--font-lato"` so you don't have to change the CSS,
or rename it everywhere it's used.

### Changing the star icons

The stars are SVG files in `public/icons/` (`filled_star.svg`, `half_filled_star.svg`,
`hollow_star.svg`). Replace them with your own icons (hearts, popcorn...) with the same names.

---

## 5. Changing What Users Rate

The template rates **companies**, but users only ever see the words you put in the config.

### Change the words

In **`src/config/site.ts`**:

```ts
item: {
    singular: 'Restaurant',
    plural: 'Restaurants',
},
```

This updates headings, buttons, menus ("My Restaurants"), the admin page and emails.

### Why the code still says "company"

Inside the code, the database and the URLs, the rated thing is still called **company**:
the `Company` model, `prisma.company...`, `/companies/...` pages and `/api/companies/...` routes.

**We recommend leaving these names alone.** Renaming them touches dozens of files and the database,
and it's easy to break something. Your users will see "Restaurants" in the interface. They will
only see the word "companies" in the address bar.

<details>
<summary><strong>I really want to rename the URLs (advanced)</strong></summary>

If you want `/restaurants/...` instead of `/companies/...` in the address bar:

1. Commit your work first (`git commit`).
2. Rename the folder `app/companies` → `app/restaurants`.
3. Use "Find in Files" to search for `/companies` and replace it with `/restaurants` in every
   `.ts`/`.tsx` file. **Only** replace strings that are URLs, like `'/companies'`, `` `/companies/${slug}` ``.
   Check `proxy.ts` too: it has the regular expressions `/^\/companies\/...` that protect pages.
4. Leave `app/api/companies` as it is (or rename it too and update every `fetch('/api/companies...')`).
5. Run `npm run build`. It will report any broken imports.
6. Click through the app: list page, detail page, add review, edit review, add item, dashboard, admin.

Renaming the `Company` *database model* is a separate, bigger job; see
[section 8](#8-modifying-the-database).

</details>

### Change the sample data

The seed scripts fill the database with example items. Replace the entries in
**`scripts/data/companies.ts`**:

```ts
export const companies = [
  { name: 'Luigi\'s Pizzeria', slug: 'luigis-pizzeria', description: 'Wood-fired pizza since 1985.' },
  { name: 'Sakura Sushi', slug: 'sakura-sushi', description: 'Fresh sushi and ramen downtown.' },
]
```

> Note the `\'` in `Luigi\'s`. Inside a string that starts with `'`, an apostrophe must be written
> as `\'`. Alternatively, wrap the string in double quotes: `"Luigi's Pizzeria"`.

Then update **`scripts/data/reviews.ts`**. It needs **5 reviews per item, in the same order**: the
first 5 belong to the first item, the next 5 to the second, and so on.

Run:

```bash
npm run db:seed           # adds the items (sign up with your ADMIN_EMAIL first)
npm run db:seed-reviews   # adds the reviews
```

To start with an empty site instead, just skip these commands.

---

## 6. Changing Rating Categories

Right now each review has **one overall score** (1–5 stars). Many rating sites rate several
**categories** separately, for example a restaurant's *Food*, *Service* and *Price*. This section shows
two smaller changes first, then how to add categories.

### 6a. Change the star labels

When users hover the stars, a label appears. Change it in **`app/components/RatingInput.tsx`**:

```tsx
const labels = {
    1: "Terrible",
    2: "Meh",
    3: "Decent",
    4: "Great",
    5: "Masterpiece",
};
```

### 6b. Change the scale (e.g. 1–10 instead of 1–5)

This is more work because "5" appears in several places. You'd need to change:

| File | What to change |
| --- | --- |
| `src/lib/ratings.ts` | `MAX_SCORE = 10`. The server uses this to reject invalid scores |
| `app/components/RatingInput.tsx` | `[1,2,3,4,5]` → 10 stars, and add labels 6–10 |
| `app/components/CompanyCard.tsx` | `[1,2,3,4,5]` stars on the list page |
| `app/components/RatingsDistribution.tsx` | `distribution` object and `[5,4,3,2,1]` bars |
| `app/companies/[slug]/page.tsx` | The text `/5.0` |
| `scripts/data/reviews.ts` | Sample scores |

Unless you have a strong reason, **keep 1–5**. It's what users expect.

### 6c. Add rating categories (e.g. Food, Service, Price)

This is a good first "real" feature because it touches every layer of the app. We'll keep the
existing `score` as the **overall** rating and add three optional category scores.

**Step 1: Database.** In `prisma/schema.prisma`, add fields to `Review`:

```prisma
model Review {
  id        String   @id @default(cuid())
  score     Int
  text      String?
  // New category scores (optional: "?" means old reviews without them are still valid)
  foodScore    Int?
  serviceScore Int?
  priceScore   Int?
  createdAt DateTime @default(now())
  // ...rest unchanged
}
```

Then run:

```bash
npm run db:migrate
```

When asked for a name, type something descriptive like `add_review_categories`. See
[section 8](#8-modifying-the-database) for what this does.

**Step 2: The form.** `RatingInput` is reusable, so use it once per category. In
`app/components/ReviewForm.tsx`:

```tsx
const [rating, setRating] = useState(0);
const [foodScore, setFoodScore] = useState(0);
const [serviceScore, setServiceScore] = useState(0);
const [priceScore, setPriceScore] = useState(0);

// In handleSubmit, send them along:
body: JSON.stringify({
    score: rating,
    text: reviewText,
    foodScore,
    serviceScore,
    priceScore,
}),

// In the returned JSX, next to the existing <RatingInput>:
<h2 className="text-2xl">Food</h2>
<RatingInput rating={foodScore} onRatingChange={setFoodScore} />
<h2 className="text-2xl">Service</h2>
<RatingInput rating={serviceScore} onRatingChange={setServiceScore} />
<h2 className="text-2xl">Price</h2>
<RatingInput rating={priceScore} onRatingChange={setPriceScore} />
```

Do the same in `app/components/EditReviewForm.tsx`, starting each `useState` from the existing value,
e.g. `useState(review.foodScore ?? 0)`.

**Step 3: The API.** The server must validate and save the new fields. In
`app/api/companies/[slug]/reviews/route.ts` (POST) **and** `app/api/reviews/[reviewId]/route.ts` (PUT):

```ts
// Next to the existing isValidScore(body.score) check:
for (const field of ['foodScore', 'serviceScore', 'priceScore']) {
    if (!isValidScore(body[field])) {
        return NextResponse.json({error: 'Please rate every category.'}, {status: 400});
    }
}

// In prisma.review.create({ data: {...} }) / prisma.review.update({ data: {...} }):
foodScore: body.foodScore,
serviceScore: body.serviceScore,
priceScore: body.priceScore,
```

> **Always validate on the server**, even if the form already prevents bad input. Anyone can send
> requests to your API directly, without using your form.

**Step 4: Show the results.** On the detail page `app/companies/[slug]/page.tsx`, compute an average
per category with the existing helper. Old reviews have no category scores, so filter them out first:

```tsx
import { averageScore } from "@/src/lib/ratings";

const categoryAverage = (field: 'foodScore' | 'serviceScore' | 'priceScore') =>
    averageScore(
        company.reviews
            .filter((review) => review[field] !== null)
            .map((review) => ({ score: review[field]! }))
    ).toFixed(1);

// In the JSX:
<p>Food: {categoryAverage('foodScore')} · Service: {categoryAverage('serviceScore')} · Price: {categoryAverage('priceScore')}</p>
```

**Step 5: Test.** Post a new review, edit it, and check the detail page. Also check that a page
with old reviews (no category scores) still loads.

> **Want users or the admin to create categories without code changes?** That needs two new
> tables, `Category` and `CategoryScore` (one row per review per category). It's a great next step
> once you're comfortable with the version above.

---

## 7. Modifying Reviews

### Where review code lives

| What | File |
| --- | --- |
| Star picker | `app/components/RatingInput.tsx` |
| Text box (character limit, placeholder) | `app/components/ReviewInput.tsx` |
| "Add review" form | `app/components/ReviewForm.tsx` |
| "Edit review" form | `app/components/EditReviewForm.tsx` |
| Reviews shown on an item's page | `app/components/ReviewsList.tsx` |
| Reviews in the user's dashboard (with Edit/Delete) | `app/components/ReviewsListWithCompany.tsx` |
| Save a new review (server) | `app/api/companies/[slug]/reviews/route.ts` |
| Edit / delete a review (server) | `app/api/reviews/[reviewId]/route.ts` |
| AI moderation | `src/lib/moderation.ts` |

### Change the question and placeholder

In `app/components/ReviewInput.tsx`:

```tsx
<h1 className="text-4xl ">What did you think of the movie?</h1>
...
placeholder="No spoilers please! Tell us what you liked and didn't like.."
```

### Change the length limit

`ReviewInput.tsx` stops typing at **750** characters. Change both `750`s in that file. This limit
only exists in the browser. To enforce it for real, also add a check in both review API routes,
next to the existing empty-text check:

```ts
if (body.text.length > 750) {
    return NextResponse.json({error: 'Reviews can be at most 750 characters.'}, {status: 400});
}
```

### Allow non-Latin alphabets

`ReviewInput.tsx` removes characters outside the Latin alphabet (for example Arabic or Chinese) as the user
types:

```tsx
const latinOnly = value.replace(/[^\u0000-\u007FÀ-ɏ]/g, '')
```

If your audience writes in other alphabets, remove that filter and use `value` directly:

```tsx
onChange={(e) => {
    const value = e.target.value
    if (value.length <= 750) {
        onChangeText(value)
    }
}}
```

### Make the text optional (stars only)

The database already allows empty text (`text String?`). Remove the "Please add a review describing
your experience." checks in both API routes. Moderation should then only run when there is text:

```ts
if (body.text && filter.isProfane(body.text)) { ... }
if (body.text && await isInappropriate(body.text)) { ... }
```

### Show who wrote each review

The item page already loads each review's author (`include: { user: true }`). To display the name,
add this inside the review card in `app/components/ReviewsList.tsx`:

```tsx
<div className="text-(--earth) text-lg">{review.user.name ?? 'Anonymous'}</div>
```

> `ReviewsList` is a **server component** (no `'use client'`), so the full user record never reaches
> the browser; only the name you render does. Never pass whole `user` objects to a client component
> or return them from an API route, because they contain emails and password hashes.

### Change moderation

Reviews pass two checks before being saved:

1. **`bad-words`**: a list of English swear words. Fast and free.
2. **Claude (AI)**, in `src/lib/moderation.ts`: catches insults, hate speech, other languages and
   creative spellings. It requires `ANTHROPIC_API_KEY`.

To change what counts as inappropriate, edit the question in `src/lib/moderation.ts`. Keep the
`Reply with only "yes" or "no"` part, because the code checks for exactly `yes`:

```ts
content: `Does this movie review contain profanity, hate speech, or major plot spoilers? Reply with only "yes" or "no".\n\nReview: ${text}`
```

To turn off AI moderation (e.g. while learning, without an API key), make the function
always answer "no":

```ts
export default async function isInappropriate(text: string): Promise<boolean> {
    return false; // AI moderation disabled
}
```

---

## 8. Modifying the Database

### How it works

1. `prisma/schema.prisma` **describes** the tables.
2. `npm run db:migrate` compares that description with the real database, writes a migration
   file to `prisma/migrations/`, applies it, and regenerates the Prisma client, so TypeScript
   knows about your new fields.
3. Your code uses `prisma.<model>.<action>(...)`, e.g. `prisma.review.create(...)`.

### Adding a field (the safe, common case)

Example: add a website link to each item.

```prisma
model Company {
  id          String  @id @default(cuid())
  name        String
  slug        String  @unique
  description String?
  website     String?          // ← new
  // ...
}
```

```bash
npm run db:migrate
# Prompt: "Enter a name for the new migration:" → add_company_website
```

Now `company.website` exists everywhere in your code. To let users fill it in, update the form
(`AddCompanyForm.tsx`) and the API (`app/api/companies/route.ts`). The
[movie example](#11-example-turning-this-into-a-movie-rating-site) walks through exactly that.

### Rules that save you from trouble

- **Make new fields optional (`?`) or give them a default** (`@default(0)`). The database already
  has rows. A new *required* field without a default has no value for them, and the migration
  will fail or ask you to reset the database.
- **Never edit or delete files in `prisma/migrations/`** once they've been applied (and committed).
  To undo a change, change the schema again and create a new migration.
- **Renaming or deleting a field deletes its data.** Prisma will warn you. Read the warning.
- **Commit the migration files** together with the schema change.
- **In production**, run `npm run db:deploy`, not `db:migrate`. `db:deploy` only applies existing migrations
  and never resets anything.

### Common field types

| Prisma | Example value | Notes |
| --- | --- | --- |
| `String` | `"Inception"` | Text |
| `Int` | `2010` | Whole numbers |
| `Float` | `4.5` | Decimals |
| `Boolean` | `true` | Use with `@default(false)` |
| `DateTime` | a date | `@default(now())` = creation time |
| `String[]` | `["Drama", "Sci-Fi"]` | A list (PostgreSQL only) |

### Looking at your data

```bash
npm run db:studio
```

This opens a spreadsheet-like editor in your browser where you can view, edit and delete rows.
It's handy for approving test items or fixing typos. Be careful: changes are saved immediately.

### Starting over (development only!)

If your development database is in a mess:

```bash
npx prisma migrate reset
```

This **deletes all data** and re-applies every migration. Never run it against a real site's database.

---

## 9. Adding New Pages

### A simple static page: "About"

**Step 1:** Create the file **`app/about/page.tsx`**. The folder name becomes the URL, `/about`:

```tsx
import { siteConfig } from "@/src/config/site";

// The title becomes "About - <your site name>" thanks to the template in app/layout.tsx
export const metadata = {
    title: 'About',
    description: `What ${siteConfig.name} is and who runs it.`,
};

export default function AboutPage() {
    return (
        <main className="w-full min-h-screen flex justify-center">
            <div className="w-full md:w-[65%] max-w-5xl p-8 flex flex-col gap-6 mt-12">
                <h1 className="text-3xl md:text-6xl font-semibold text-(--slate)">
                    About {siteConfig.name}
                </h1>
                <p className="text-xl text-(--rock)">
                    {siteConfig.description}
                </p>
            </div>
        </main>
    );
}
```

**Step 2:** Visit <http://localhost:3000/about>. Done!

**Step 3:** Link to it. Use Next's `Link` (not `<a>`) for pages inside your site. For example,
add it to the menu in `app/components/UserMenu.tsx`, inside `signedOutLinks` and/or `links`:

```tsx
<Link
    href={'/about'}
    onClick={()=>{setOpen(false); close()}}
    className="px-4 py-2 hover:bg-(--clay) text-sm"
>
    About
</Link>
```

**Step 4 (optional):** add it to the sitemap in `app/sitemap.ts`:

```ts
{ url: absoluteUrl('/about'), lastModified: new Date() },
```

### A page that reads from the database: "Top rated"

Pages are server components by default, so they can use `prisma` directly. Create
**`app/top-rated/page.tsx`**:

```tsx
import Link from "next/link";
import { prisma } from "@/src/lib/db";
import { averageScore } from "@/src/lib/ratings";
import { siteConfig } from "@/src/config/site";
import CompanyCard from "../components/CompanyCard";

export const metadata = { title: `Top rated ${siteConfig.item.plural}` };

export default async function TopRatedPage() {
    const companies = await prisma.company.findMany({
        where: { status: 'approved' },   // never show pending or rejected items
        include: { reviews: true },
    });

    const top = companies
        .filter((company) => company.reviews.length > 0)
        .map((company) => ({ ...company, average: averageScore(company.reviews) }))
        .sort((a, b) => b.average - a.average)
        .slice(0, 10);

    return (
        <main className="min-h-screen flex justify-center">
            <div className="w-full md:w-[65%] max-w-5xl p-8 flex flex-col gap-8">
                <h1 className="text-3xl md:text-6xl font-semibold">Top rated</h1>
                {top.map((company) => (
                    <Link key={company.id} href={`/companies/${company.slug}`} className="block">
                        <CompanyCard name={company.name} rating={company.average} />
                    </Link>
                ))}
            </div>
        </main>
    );
}
```

### Pages only signed-in users may see

Pages under `/dashboard` are linked only from the signed-in menu. To **block** signed-out users
from a page, use one of these:

- **In the page itself** (simplest): call `auth()` and redirect:

  ```tsx
  import { auth } from "@/auth";
  import { redirect } from "next/navigation";

  export default async function MyPrivatePage() {
      const session = await auth();
      if (!session) redirect('/sign-in');
      // ...
  }
  ```

- **For many pages at once**: add the path to `protectedRoutes` in `proxy.ts`.

For admin-only pages, copy the check from `app/admin/page.tsx`:
`if (!isAdmin(session?.user?.email)) redirect('/');`

---

## 10. Adding New Features

### The recipe

Almost every feature follows the same four steps, in this order:

1. **Database:** does it need to store something new? → edit `prisma/schema.prisma`,
   run `npm run db:migrate`. ([Section 8](#8-modifying-the-database))
2. **API route:** how is the data saved or changed? → add or edit a `route.ts` in `app/api/`.
   Check the user is signed in, **validate the input**, check the user is *allowed* to do it, then
   call Prisma.
3. **Component:** how does the user interact with it? → a `'use client'` component in
   `app/components/` that calls the API with `fetch`.
4. **Page:** where does it appear? → use the component in a `page.tsx`.

Then **test it**, including the unhappy paths: signed out, empty input, someone else's data.

### Worked example: a "Sort by" option on the list page

A feature that needs no database change. We'll let users sort `/companies` by rating or name using
the URL: `/companies?sort=rating`.

In **`app/companies/page.tsx`**, the page already reads `search` from the URL. Read `sort` too,
and sort the results:

```tsx
export default async function CompaniesPage({
    searchParams,
}: {
    searchParams: Promise<{search?: string; sort?: string}>;
}) {
    const {search, sort} = await searchParams;
    const companies = await getCompanies(search??'');

    if (sort === 'rating') {
        companies.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sort === 'name') {
        companies.sort((a, b) => a.name.localeCompare(b.name));
    }
    // ...the rest stays the same
```

Add links so users can choose (below the `<h1>`):

```tsx
<div className="flex gap-4 text-(--earth) pt-4">
    Sort by:
    <Link href={`/companies?search=${encodeURIComponent(search ?? '')}&sort=rating`}>Rating</Link>
    <Link href={`/companies?search=${encodeURIComponent(search ?? '')}&sort=name`}>Name</Link>
</div>
```

### Security checklist for every feature

The API is public: anyone can call it, not just your forms. In every API route that changes data:

- ✅ **Signed in?** `const session = await auth(); if (!session) return 401`
- ✅ **Allowed?** Is this *their* data? Compare `thing.userId` with `session.user.id`, or use
  `isAdmin(...)`. See `app/api/reviews/[reviewId]/route.ts` for an example.
- ✅ **Valid input?** Check types, lengths and ranges. Never trust `request.json()`.
- ✅ **Safe output?** Never return user records (they contain password hashes). Return only the
  fields the page needs.
- ✅ **No secrets in client components.** Only `NEXT_PUBLIC_...` variables are safe in browser code.

### Ideas to practice with

| Feature | Difficulty | What you'll touch |
| --- | --- | --- |
| Show the reviewer's name on reviews | ⭐ | `ReviewsList.tsx` ([section 7](#show-who-wrote-each-review)) |
| "About" page | ⭐ | New page ([section 9](#9-adding-new-pages)) |
| Sort the list page | ⭐ | `app/companies/page.tsx` (above) |
| Image for each item | ⭐⭐ | Schema (`imageUrl String?`), add form, API, `CompanyCard.tsx` |
| Rating categories | ⭐⭐ | [Section 6c](#6c-add-rating-categories-eg-food-service-price) |
| "Was this review helpful?" votes | ⭐⭐⭐ | New `ReviewVote` model, API route, button component |
| Favorites list in the dashboard | ⭐⭐⭐ | New `Favorite` model, API route, button, dashboard page |

---

## 11. Example: Turning This Into a Movie Rating Site

Let's put everything together and build **"ReelRate"**, a site where people rate movies. We'll
also add a **release year** to each movie.

### Step 1: Branding (`src/config/site.ts`)

```ts
export const siteConfig = {
    name: 'ReelRate',
    tagline: 'Movie Ratings by Real Viewers',
    description: 'Rate the movies you watched and find out what to watch next.',

    url: appUrl,

    item: {
        singular: 'Movie',
        plural: 'Movies',
    },

    home: {
        headlinePrefix: 'What should',     // "What should ReelRate watch tonight?"
        headlineSuffix: 'watch tonight?',
        searchPlaceholder: 'Search for a movie',
    },

    images: {
        logo: '/logo.png',
        navLogo: '/og-image.png',
        ogImage: '/og-image.png',
    },
};
```

Refresh the browser. The home page, menus ("My Movies"), buttons ("Add movie") and page titles
now all say ReelRate and Movie.

### Step 2: Look and feel

- Replace `public/logo.png`, `public/og-image.png` and `app/favicon.ico` with movie-themed images.
- Paste the dark-blue "cinema" palette from [section 4](#the-color-palette) into `app/globals.css`.
- Optional: replace the star icons in `public/icons/` with popcorn icons.

### Step 3: Review wording

In `app/components/ReviewInput.tsx`:

```tsx
<h1 className="text-4xl ">What did you think of the movie?</h1>
...
placeholder="No spoilers please! What did you like or dislike?"
```

In `app/components/RatingInput.tsx`:

```tsx
const labels = {
    1: "Walked out",
    2: "Boring",
    3: "Watchable",
    4: "Loved it",
    5: "Masterpiece",
};
```

In `src/lib/moderation.ts`, also block spoilers:

```ts
content: `Does this movie review contain profanity, hate speech, inappropriate content, or major plot spoilers (such as revealing the ending)? Reply with only "yes" or "no".\n\nReview: ${text}`
```

### Step 4: Add a release year to the database

In `prisma/schema.prisma`, add one optional field to `Company`:

```prisma
model Company {
  id          String  @id @default(cuid())
  name        String
  slug        String  @unique
  description String?
  releaseYear Int?          // ← new
  userId      String
  status      String  @default("pending")
  // ...
}
```

```bash
npm run db:migrate
# name: add_release_year
```

### Step 5: Let users enter the year

In **`app/components/AddCompanyForm.tsx`**, add state for the year next to the others:

```tsx
const [releaseYear, setReleaseYear] = useState("");
```

Send it to the API:

```tsx
body: JSON.stringify({
    name: name,
    description: description,
    releaseYear: releaseYear,
}),
```

And add an input in the JSX, below the name input:

```tsx
<h1 className="text-4xl mt-3">Release year:</h1>
<div className="flex h-15 gap-2 w-1/2">
    <span className="w-2 bg-(--slate)"></span>
    <input
        type="number"
        value={releaseYear}
        onChange={(e) => setReleaseYear(e.target.value)}
        placeholder="e.g. 2010"
        className="border w-1/2 border-(--slate) rounded-xl outline-none text-2xl p-2"
    />
</div>
```

### Step 6: Save it on the server

In **`app/api/companies/route.ts`**, in the `POST` function, validate the year and save it:

```ts
// After the slug check:
const releaseYear = body.releaseYear ? Number(body.releaseYear) : null;
if (releaseYear !== null && (!Number.isInteger(releaseYear) || releaseYear < 1880 || releaseYear > new Date().getFullYear() + 5)) {
    return NextResponse.json({error: 'Please enter a valid release year.'}, {status: 400});
}

// In prisma.company.create({ data: { ... } }), add:
releaseYear,
```

### Step 7: Show it

In **`app/companies/[slug]/page.tsx`**, next to the name:

```tsx
<h1 className="text-6xl ">{company.name}</h1>
{company.releaseYear && (
    <p className="text-(--earth) text-2xl">{company.releaseYear}</p>
)}
```

### Step 8: Sample movies

Replace **`scripts/data/companies.ts`**:

```ts
export const companies = [
  { name: 'Inception', slug: 'inception', description: 'A thief who steals secrets through dreams is given one last job.' },
  { name: 'Spirited Away', slug: 'spirited-away', description: 'A young girl wanders into a world of spirits and must find her way home.' },
  { name: 'The Godfather', slug: 'the-godfather', description: 'The aging head of a crime family hands control to his reluctant son.' },
]
```

Replace **`scripts/data/reviews.ts`** with 5 reviews per movie (15 in total), in the same order:

```ts
export const reviews = [
  // Inception
  { score: 5, text: "Mind-bending and beautifully shot. The soundtrack alone is worth it." },
  { score: 4, text: "Confusing the first time, brilliant the second." },
  // ...3 more for Inception, then 5 for Spirited Away, then 5 for The Godfather
]
```

> To seed release years too, add `releaseYear: 2010` to each entry, and `releaseYear: company.releaseYear`
> to the `create` block in `scripts/seed.ts`.

Then sign up with your `ADMIN_EMAIL` and run:

```bash
npm run db:seed
npm run db:seed-reviews
```

### Step 9: Test everything

- [ ] Home page shows "What should **ReelRate** watch tonight?"
- [ ] Searching "incep" finds Inception
- [ ] Movie page shows the rating, the release year and the reviews
- [ ] Signed in: add a review, edit it, delete it from "My Movies"/"My Reviews"
- [ ] Add a movie with a year → it shows as pending → approve it at `/admin` (signed in as `ADMIN_EMAIL`)
- [ ] Add a movie with year `abc` or `1500` → you get an error
- [ ] `npm run build` finishes without errors

🎬 You've built a movie rating site!

---

## 12. Common Problems

### When something breaks: where to look

1. **The terminal running `npm run dev`.** Server errors (database, API routes) appear here.
2. **The browser console** (`F12` → Console). Errors in client components appear here.
3. **The Network tab** (`F12` → Network). Click a failed request (red) to see what the API answered.
4. **`npm run build`.** It finds TypeScript errors in *all* files, not just the page you're viewing.

### Problems and fixes

| Problem | Likely cause and fix |
| --- | --- |
| `Property 'releaseYear' does not exist on type ...` after editing the schema | The Prisma client wasn't regenerated. Run `npm run db:migrate` (or `npx prisma generate`) and restart `npm run dev`. In VS Code, also run "TypeScript: Restart TS Server" |
| Migration fails: "Added the required column ... without a default value" | You added a required field to a table that already has rows. Make it optional (`Int?`) or add `@default(...)` |
| Changes to `.env` don't apply | Restart `npm run dev`. `NEXT_PUBLIC_...` values also need a rebuild/redeploy in production |
| Links in emails point to the wrong site | Check `NEXT_PUBLIC_URL` in `.env` (and in your hosting provider's settings) |
| Sign-in fails with `UntrustedHost` | Add `AUTH_TRUST_HOST=true` to `.env` (needed outside Vercel, including `npm start` locally) |
| "Sign in with Google" fails with `redirect_uri_mismatch` | In Google Cloud console, add `<your URL>/api/auth/callback/google` as an authorized redirect URI |
| Posting a review always fails | Check `ANTHROPIC_API_KEY`, or temporarily disable AI moderation ([section 7](#change-moderation)). The error is printed in the terminal |
| Emails never arrive | Run `npm run test-email` and read the error. Usually the sender domain isn't verified in Resend |
| `/admin` sends you back to the home page | You must be signed in with exactly the `ADMIN_EMAIL` from `.env` |
| A newly added item doesn't appear in the list | New items are `pending` until the admin approves them at `/admin` |
| "No user found with ADMIN_EMAIL" when seeding | Sign up in the app with your `ADMIN_EMAIL` first |
| Seeded reviews are attached to the wrong items | `reviews.ts` must have exactly 5 reviews per item, in the same order as `companies.ts` |
| `Module not found: Can't resolve '@/...'` | Check the path. `@/` means the project root, so `@/src/lib/db` is `src/lib/db.ts` |
| `You're importing a component that needs useState...` | Add `'use client';` as the first line of that component |
| `PrismaClient is unable to run in this browser environment` | A client component imports `prisma`. Move the database code to a page (server component) or an API route |
| Styles don't apply | Check the class name in the [Tailwind docs](https://tailwindcss.com/docs). Palette colors are written `bg-(--sand)`, with parentheses |
| A page shows "404 This page could not be found" | The file must be named exactly `page.tsx`, inside a folder named like the URL |
| Image doesn't show | It must be in `public/` and referenced from the root: `public/logo.png` → `'/logo.png'` |

### Still stuck?

- Read the exact error message. Search for it, in quotes, on the web.
- Undo to your last working commit with `git stash`, then re-apply your change in smaller steps.
- Documentation: [Next.js](https://nextjs.org/docs) · [Prisma](https://www.prisma.io/docs) ·
  [Tailwind CSS](https://tailwindcss.com/docs) · [Auth.js](https://authjs.dev)
