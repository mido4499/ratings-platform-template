import SignInForm from "../components/SignInForm";

export const metadata = {
    title: 'Sisyphus Apply - Sign in',
    description: 'Sign in to review job application experience.'
}

export default function SigninPage(){
    return(
        <main className="w-full min-h-screen flex flex-col justify-center" >
            <SignInForm/>
        </main>
    )
}