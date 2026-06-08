'use client'
import { useState } from "react"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function SigninPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error){
            setError('Invalid email or password');
            setLoading(false);
            return;
        }

        router.push('/');
        router.refresh();
    }

    return(
        <main className="w-full min-h-screen flex flex-col justify-center" onSubmit={handleSubmit}>
            <div className="flex items-center gap-18 -translate-y-32 justify-center">
                <div className="flex flex-col gap-4">
                    <h1 className="text-6xl text-(--slate)">Sign in</h1>
                    <button
                        type="button"
                        onClick={()=>{signIn('google', { callbackUrl: '/'})}}
                        className="text-(--clay) cursor-pointer underline"
                    >
                        Sign in with Google
                    </button>
                    
                </div>

                <form className="w-1/5 flex flex-col gap-4 items-center">
                    <input
                        className="w-full h-10 p-4 text-(--slate) rounded-2xl border border-(--earth)"
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={e=>setEmail(e.target.value)}
                        required
                    />

                    <div className="relative w-full">
                        <input
                            className="w-full h-10 p-4 text-(--slate) rounded-2xl border border-(--earth)"
                            type={showPassword?"text":"password"}
                            placeholder="password"
                            value={password}
                            onChange={e=>setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={()=>setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--earth) cursor-pointer"
                        >
                            {showPassword? (
                                // OPEN EYE
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                </svg>
                            ): (
                                // CLOSED EYE
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            )}
                        </button>
                    </div>
                    
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-1/3 text-(--earth) border rounded-2xl border-(--earth) cursor-pointer"
                    >
                        {loading? 'signing in..': 'Sign in'}
                    </button>
                    <p className="text-sm text-center text-(--clay)">
                        <Link href={'/forgot-password'}>Forgot your password?</Link>
                    </p>
                    <p className="text-sm text-center text-(--clay)">
                        Don&apos;t have an account?{' '}
                        <Link href="/sign-up" className="underline text-(--earth)">Sign up</Link>
                    </p>
                    
                </form>
            </div>

        </main>
    )
}