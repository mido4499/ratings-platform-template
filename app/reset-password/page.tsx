'use client';
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function PasswordResetForm() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await fetch(
            `/api/auth/reset-password`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({token, password}),
            }
        )

        const data = await res.json();

        if (!res.ok) {
            setError(data.error);
            setLoading(false);
            return;
        }

        setSuccess(true);
        setTimeout(()=>router.push('/sign-in'), 2000);
    }
    if (success) return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-semibold mb-6">Reset your password</h1>
            <p className='text-gray-500'>Redirecting you to sign-in...</p>
        </div>
    )
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-semibold mb-6">Reset your password</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    className="border rounded px-4 py-2"
                    minLength={8}
                    required
                />
                <button className="cursor-pointer" type='submit' disabled={loading}>
                    {loading? 'submitting..':'submit'}
                </button>
            </form>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
        </div>
    )
}

export default function PasswordResetPage() {
    return (
        <Suspense>
            <PasswordResetForm />
        </Suspense>
    )
}