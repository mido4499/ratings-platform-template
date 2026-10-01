// Sends a test email to ADMIN_EMAIL to check that Resend is set up correctly.
// Run with: npm run test-email
import "./env";
import { Resend } from "resend";
import { siteConfig } from "@/src/config/site";
import { emailFrom } from "@/src/lib/email";

const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
    const result = await resend.emails.send({
        from: emailFrom,
        to: process.env.ADMIN_EMAIL!,
        subject: `${siteConfig.name} test email`,
        html: `
            <h2>Test Email</h2>
            <p>If you can read this, emails from ${siteConfig.url} are working.</p>
        `
    })
    console.log(result);
}
main();
