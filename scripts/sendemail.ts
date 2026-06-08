import { Resend } from "resend";
import dotenv from 'dotenv';
dotenv.config({path: '.env'});


const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
    const result = await resend.emails.send({
        from: 'noreply@sisyphusapply.com',
        to: 'ahmedwael4499@gmail.com',
        subject: `New Company Submission: test company`,
        html: `
            <h2>Test Email</h2>
        `
    })
    console.log(result);
}
main();
