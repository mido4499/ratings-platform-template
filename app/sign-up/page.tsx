import SignUpForm from "../components/SignUpForm";
import { siteConfig } from "@/src/config/site";

export const metadata = {
    title: 'Sign up',
    description: `Create a ${siteConfig.name} account to rate and review.`
}

export default function SignupPage(){
    return (
        <main className="w-full min-h-screen flex flex-col justify-center">
            <SignUpForm/>
        </main>
    )
}