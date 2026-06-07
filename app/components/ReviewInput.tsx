"use client";

type ReviewInputProps = {
    text: string
    onChangeText: (text: string) => void;
}

export default function ReviewInput({
    text,
    onChangeText,
}: ReviewInputProps){

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-4xl ">How was your experience?</h1>
            <div className="flex flex-col bg-(--sand) gap-5 rounded-3xl">
                <textarea
                    value={text}
                    onChange={(e) =>{
                        const value = e.target.value
                        const latinOnly = value.replace(/[^\u0000-\u007F\u00C0-\u024F]/g, '')
                        if (latinOnly.length <= 750) {
                            onChangeText(latinOnly)
                        }
                    }}
                    
                    className="w-full h-48 p-6 text-2xl rounded-2xl text-(--slate) outline-none"
                    placeholder="Talk about your experience.."
                />
                <p className={`text-sm text-right pr-6 pb-4 ${text.length >= 750 ? 'text-red-500' : 'text-(--earth)'}`}>{text.length}/750</p>
            </div>
        </div>
        
        
    )
}