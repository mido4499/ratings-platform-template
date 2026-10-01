import { Resend } from "resend";
import { siteConfig, absoluteUrl } from "@/src/config/site";

const resend = new Resend(process.env.RESEND_API_KEY);

// The sender address must belong to a domain you verified in Resend.
// Defaults to noreply@<your app's domain>, e.g. noreply@my-site.com.
export const emailFrom = process.env.EMAIL_FROM || `${siteConfig.name} <noreply@${new URL(siteConfig.url).hostname}>`;

const item = siteConfig.item.singular.toLowerCase();

export async function sendAdminNotification(companyName: string, submittedBy: string) {
    await resend.emails.send({
        from: emailFrom,
        to: process.env.ADMIN_EMAIL!,
        subject: `New ${siteConfig.item.singular} Submission: ${companyName}`,
        html: `
            <h2>New ${siteConfig.item.singular} Submission</h2>
            <p><strong>${siteConfig.item.singular}:</strong> ${companyName}</p>
            <p><strong>Submitted by:</strong> ${submittedBy}</p>
            <p>Visit your <a href="${absoluteUrl('/admin')}">admin panel</a> to accept/reject the submission</p>
        `
    })
}

export async function sendApprovalEmail(userEmail: string, companyName: string, companySlug: string) {
    await resend.emails.send({
        from: emailFrom,
        to: userEmail,
        subject: `Approved ${siteConfig.item.singular} Submission`,
        html: `
            <h2>Good news!</h2>
            <p>Congratulations! Your submission for <strong>${companyName}</strong> was approved.</p>
            <p>You can view it <a href="${absoluteUrl(`/companies/${companySlug}`)}">here</a></p>
        `
    })
}

export async function sendRejectionEmail(userEmail: string, companyName: string) {
    await resend.emails.send({
        from: emailFrom,
        to: userEmail,
        subject: `Your ${item} submission was not approved`,
        html: `
            <h2>Submission update</h2>
            <p>Unfortunately, your submission for the ${item} <strong>${companyName}</strong> was not approved.</p>
        `
    })
}

export async function sendResetPasswordEmail(userEmail: string, token: string) {
    await resend.emails.send({
        from: emailFrom,
        to: userEmail,
        subject: `Reset your ${siteConfig.name} password`,
        html: `
            <h2>Reset Your password here</h2>
            <p>Click the link below to reset your password</p>
            <a href="${absoluteUrl(`/reset-password?token=${token}`)}">Reset Password</a>
            <p>If you did not request this email, please ignore.</p>
        `
    })
}
