import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/src/config/site";

// Tells search engines what they may crawl. Served at /robots.txt
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard', '/admin', '/api'],
        },
        sitemap: absoluteUrl('/sitemap.xml'),
    }
}
