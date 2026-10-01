/**
 * Returns true if the given email belongs to the site admin (ADMIN_EMAIL in `.env`).
 * The admin can approve/reject submitted companies at /admin.
 *
 * Server-only: ADMIN_EMAIL is not available in browser code.
 */
export function isAdmin(email?: string | null): boolean {
    const adminEmail = process.env.ADMIN_EMAIL;
    // Both must be set — otherwise "no email" would equal "no admin configured".
    return !!email && !!adminEmail && email === adminEmail;
}
