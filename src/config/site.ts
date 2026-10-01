/**
 * ============================================================================
 *  SITE CONFIG — start here when turning this template into your own project
 * ============================================================================
 *
 * Every piece of branding and wording that is specific to *this* rating
 * platform lives in this one file. Change the values below and the whole app
 * (page titles, navbar, home page, emails, sitemap, SEO tags...) updates.
 *
 * Things that are NOT in this file:
 *   - Secrets and per-environment values (database, API keys, the app URL)
 *     -> `.env` / `.env.local`. See `.env.example` for the full list.
 *   - Colors -> the `:root` palette at the bottom of `app/globals.css`.
 *   - Images -> replace the files in `public/` (keep the same names, or
 *     update the paths in `images` below).
 *
 * This file is imported by both server and browser code, so never put
 * secrets in it. Only `NEXT_PUBLIC_*` env variables are readable here.
 */

/**
 * The public URL of the app, e.g. "https://my-ratings-site.com".
 * Set it with NEXT_PUBLIC_URL in `.env`. It is used for links in emails,
 * the sitemap, robots.txt and social-media preview tags.
 */
const appUrl = (process.env.NEXT_PUBLIC_URL || 'http://localhost:3000')
    .trim()
    .replace(/\/+$/, ''); // remove any trailing "/" so we can safely do `${url}/path`

export const siteConfig = {
    /** Name of your platform. Shown in browser tabs, emails and the home page. */
    name: 'Sisyphus Apply',

    /** Short phrase appended to the name on the home page tab: "Name - Tagline". */
    tagline: 'Job Applications Reviews',

    /** One or two sentences used for search engines and social-media previews. */
    description:
        'Speak up to unjustified rejection emails! Rate and review your job application experience.',

    url: appUrl,

    /**
     * What is being rated on your platform (companies, restaurants, courses...).
     * These words are used in buttons, headings and menus across the app.
     *
     * Note: internally the code, database tables and URLs still use the word
     * "company" (e.g. /companies/[slug]). That is fine — users never see it.
     */
    item: {
        singular: 'Company',
        plural: 'Companies',
    },

    /** Text on the home page, around the search box. */
    home: {
        // Renders as: "<headlinePrefix> <name> <headlineSuffix>"
        headlinePrefix: 'Should',
        headlineSuffix: 'for..',
        searchPlaceholder: "Company you're considering applying for",
    },

    /** Paths of images inside the `public/` folder. */
    images: {
        logo: '/logo.png',        // big logo on the home page
        navLogo: '/og-image.png', // small logo in the navbar
        ogImage: '/og-image.png', // preview image for social media (1200x630)
    },
};

/** Builds a full URL from a path, e.g. absoluteUrl('/admin') -> "https://my-site.com/admin". */
export function absoluteUrl(path: string = '/') {
    return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;
}
