import SignUpForm from "../components/SignUpForm";

export const metadata = {title: 'Sisyphus Apply - Sign up'}

export default function SignupPage(){
    return (
        <main className="w-full min-h-screen flex flex-col justify-center">
            <SignUpForm/>
        </main>
    )
}