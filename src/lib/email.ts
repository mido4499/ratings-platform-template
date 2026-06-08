import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminNotification(companyName: string, submittedBy: string) {
    await resend.emails.send({
        from: 'noreply@sisyphusapply.com',
        to: process.env.ADMIN_EMAIL!,
        subject: `New Company Submission: ${companyName}`,
        html: `
            <h2>New Company Submission</h2>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Submitted by:</strong> ${submittedBy}</p>
            <p>Visit your <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin">admin panel</a> to accept/reject the submission</p>
        `
    })
}

export async function sendApprovalEmail(userEmail: string, companyName: string, companySlug: string) {
    await resend.emails.send({
        from: 'noreply@sisyphusapply.com',
        to: userEmail,
        subject: `Approved Company Submission`,
        html: `
            <h2>Good news!</h2>
            <p>Congratulations! Your submission for <strong>${companyName}</strong> was approved.</p>
            <p>You can view it <a href="${process.env.NEXT_PUBLIC_APP_URL}/companies/${companySlug}>here</a></p>

        `
    })
}

export async function sendRejectionEmail(userEmail: string, companyName: string) {
    await resend.emails.send({
        from: `noreply@sisyphusapply.com`,
        to: userEmail,
        subject: `Your company submission was not approved`,
        html: `
            <h2>Submission update</h2>
            <p>Unfortunately, your submission for the company <strong>${companyName}</strong> was not approved.</p>
        `
    })
}

export async function sendResetPasswordEmail(userEmail: string, token: string) {
    await resend.emails.send({
        from: `noreply@sisyphusapply.com`,
        to: userEmail,
        subject: `Reset your password`,
        html: `
            <h2>Reset Your password here</h2>
            <p>Click the link below to reset your password</p>
            <a href="${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}">Reset Password</a>
            <p>If you did not request this email, please ignore.</p>
        `
    })
}