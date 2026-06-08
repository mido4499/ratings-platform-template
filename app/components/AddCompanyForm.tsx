"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCompanyForm(){
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(){
        setError("");

        const res = await fetch(
            `/api/companies`,
            {
                method: "POST",

                headers: {
                    "content-type": "application/json",
                },

                body: JSON.stringify({
                    name: name,
                    description: description,
                }),
            }
        );
        const company = await res.json();

        if (!res.ok) {
            setError(company.error);
            return;
        }
        

        router.push(`/companies/${company.slug}`);
    }

    return(
        <div className="flex flex-col gap-8 w-4/5">
            <h1 className="text-4xl">Name of the company:</h1>
            <div className="flex h-15 gap-2 w-1/2">
                <span className="w-2 bg-(--slate)"></span>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                    className="border w-1/2 border-(--slate) rounded-xl outline-none text-2xl p-2"
                >
                </input>
            </div>
            
            <h1 className="text-4xl mt-3">Describe the company:</h1>
            <div className="flex w-full gap-2 pt-2 pb-2 pl-2 pr-2">
                <span className="w-2 bg-(--slate)"></span>
                <textarea
                    onChange={(e) =>{
                        setDescription(e.target.value)
                    }}
                    value={description}

                    className="w-full h-48 p-6 text-xl rounded-xl text-(--slate) border border-(--slate) outline-none"
                    placeholder=""
                />
            </div>

            <button
                onClick={handleSubmit}
                className="bg-(--slate) text-(--stone) text-2xl rounded-2xl w-fit h-20 p-6 ml-auto cursor-pointer"
            >
                Add company
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
        </div>
    )
} 