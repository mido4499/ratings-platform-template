'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
type Props = {
    name: string;
    email: string;
    hasPassword: boolean;
}

export default function AccountSettings({name, email, hasPassword}: Props) {
    const [nameValue, setNameValue] = useState(name);
    const [editing, setEditing] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSave(){
        setLoading(true);
        setError('');

        const res = await fetch(
            `/api/user`,
            {
                method: 'PATCH',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    name: nameValue,
                    ...(passwordValue && {password: passwordValue}),
                }),
            }
        );
        const data = await res.json();

        if (!res.ok){
            setError(data.error);
            setLoading(false);
            return;
        }

        setEditing(false);
        setLoading(false);
        router.refresh();
    }

    async function handleCancel(){
        setEditing(false);
        setNameValue(name);
        setPasswordValue('');
        setError('');
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl text-(--slate) font-semibold">Account Settings</h1>
                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="cursor-pointer p-2 rounded-xl bg-(--sand) text-xl"
                    >
                        Edit
                    </button>
                )}
            </div>
            <div className="flex flex-col gap-4 mt-4">
                <div>
                    <p className="text-xl text-(--clay) mb-1">Name</p>
                    {editing?(
                        <input
                            type="text"
                            value={nameValue}
                            onChange={e => setNameValue(e.target.value)}
                            className="border border-(--rock) rounded px-3 py-2 w-full"
                        />
                    ): (
                        <p className="text-lg text-(--slate)">{name}</p>
                    )}
                </div>
                
                <div>
                    <p className="text-xl text-(--clay) mb-1">Email</p>
                    <p className="text-lg text-(--slate)">{email}</p>
                    {editing && <p className="text-(--earth) mt-1">Email cannot be changed.</p>}
                </div>
                
                
                {hasPassword && (
                    <div>
                        <p className="text-xl text-(--clay) mb-1">Password</p>
                        {editing?(
                            <input
                                type="password"
                                value={passwordValue}
                                placeholder="Enter New Password"
                                onChange={e=>setPasswordValue(e.target.value)}
                                className="border border-(--rock) text-(--slate) rounded px-3 py-2 w-full"
                                minLength={8}
                            />
                        ):(
                            <p className="text-lg text-(--slate)">••••••••</p>
                        )}
                    </div>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                {editing && (
                    <div className="flex gap-4 mt-2">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-black text-white rounded px-4 py-2 cursor-poitner"
                        >
                            {loading? 'Saving..' : 'Save'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="border rounded px-4 py-2 cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                )}
                
                
            </div>
        </div>
    )

}