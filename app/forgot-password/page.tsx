'use client';
import { useState } from "react";


export default function ForgotPasswordPage(){
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        await fetch(
            `/api/auth/forgot-password`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email}),
            }
        )

        setSubmitted(true);
        setLoading(false)
    }

    if (submitted) return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-semibold mb-6">Forgot your password</h1>
            <p>If an account for this email exists, a reset link has been sent.</p>
        </div>
    )

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-semibold mb-6">Forgot your password</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    className="border rounded px-4 py-2"
                    required
                />
                <button className="cursor-pointer" type='submit' disabled={loading}>
                    {loading? 'submitting..':'submit'}
                </button>
            </form>
        </div>
    )
}