import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
})

export default async function isInappropriate(text: string): Promise<boolean> {
    const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 10,
        messages: [{
            role:'user', 
            content: `Does this review contain profanity, hate speech, or inappropriate content in any language, including slang, transliterated words (such as Arabic, French, or other languages written using Latin letters), or creative misspellings intended to bypass filters? Reply with only "yes" or "no".\n\nReview: ${text}`
        }]
    })

    const result = response.content[0].type==='text'
        ? response.content[0].text.trim().toLowerCase()
        : 'no'
    
    return result === 'yes'
}

