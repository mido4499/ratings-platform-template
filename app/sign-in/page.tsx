import SignInForm from "../components/SignInForm";
import { siteConfig } from "@/src/config/site";

export const metadata = {
    title: 'Sign in',
    description: `Sign in to ${siteConfig.name} to rate and review.`
}

export default function SigninPage(){
    return(
        <main className="w-full min-h-screen flex flex-col justify-center" >
            <SignInForm/>
        </main>
    )
}