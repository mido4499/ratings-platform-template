import SignInForm from "../components/SignInForm";

export const metadata = {title: 'Sisyphus Apply - Sign in'}

export default function SigninPage(){
    return(
        <main className="w-full min-h-screen flex flex-col justify-center" >
            <SignInForm/>
        </main>
    )
}