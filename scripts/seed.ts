import { prisma } from "@/src/lib/db";

const companies = [
    { name: 'Google', slug: 'google', description: 'A global technology leader known for its search engine, cloud computing, and software products. Popular among new grads for its strong engineering culture and competitive compensation.' },
  { name: 'Microsoft', slug: 'microsoft', description: 'One of the world\'s largest software companies, offering products like Windows, Azure, and Office. Known for its inclusive culture and strong graduate programs.' },
  { name: 'Apple', slug: 'apple', description: 'A consumer electronics and software giant behind the iPhone, Mac, and iOS. Highly sought after for its design-driven culture and innovative products.' },
  { name: 'Meta', slug: 'meta', description: 'The parent company of Facebook, Instagram, and WhatsApp. Known for its fast-paced engineering culture and high compensation packages for new graduates.' },
  { name: 'Amazon', slug: 'amazon', description: 'A global e-commerce and cloud computing giant. AWS is the world\'s leading cloud platform, making Amazon a top destination for engineers and business graduates.' },
  { name: 'Netflix', slug: 'netflix', description: 'A leading streaming entertainment service known for its freedom and responsibility culture. Offers some of the highest salaries in the industry.' },
  { name: 'Salesforce', slug: 'salesforce', description: 'The world\'s leading CRM platform. Known for its strong company culture, Ohana values, and robust graduate hiring programs.' },
  { name: 'Adobe', slug: 'adobe', description: 'Creator of industry-standard creative software like Photoshop and Premiere Pro. Popular among design and engineering graduates for its creative culture.' },
  { name: 'Nvidia', slug: 'nvidia', description: 'A semiconductor company leading the AI and GPU revolution. Extremely sought after by computer science and electrical engineering graduates.' },
  { name: 'Intel', slug: 'intel', description: 'One of the world\'s largest semiconductor chip makers. Offers strong internship and graduate programs in hardware and software engineering.' },
  { name: 'IBM', slug: 'ibm', description: 'A multinational technology and consulting company with a long history of innovation. Known for its research division and enterprise software solutions.' },
  { name: 'Cisco', slug: 'cisco', description: 'A global leader in networking hardware and software. Popular among computer networking and cybersecurity graduates.' },
  { name: 'Oracle', slug: 'oracle', description: 'A major provider of database software and cloud solutions. Offers strong graduate hiring in software engineering and sales.' },
  { name: 'Qualcomm', slug: 'qualcomm', description: 'A semiconductor and wireless technology company behind most modern smartphone chips. Highly sought after by electrical and computer engineering graduates.' },
  { name: 'Spotify', slug: 'spotify', description: 'The world\'s largest music streaming platform. Known for its agile squad culture and popular among software and data science graduates.' },
  { name: 'Twitter / X', slug: 'twitter-x', description: 'A major social media platform now rebranded as X. Known for its fast-paced environment and engineering challenges at scale.' },
  { name: 'LinkedIn', slug: 'linkedin', description: 'The world\'s largest professional networking platform, owned by Microsoft. Popular among business and engineering graduates for its mission-driven culture.' },
  { name: 'Uber', slug: 'uber', description: 'A global ride-sharing and delivery platform. Known for its challenging engineering problems and strong new grad hiring programs.' },
  { name: 'Airbnb', slug: 'airbnb', description: 'An online marketplace for short-term rentals and travel experiences. Known for its design-first culture and competitive compensation.' },
  { name: 'Stripe', slug: 'stripe', description: 'A leading online payments infrastructure company. Highly regarded for its engineering culture and one of the most sought-after companies for software engineers.' },
  { name: 'Palantir', slug: 'palantir', description: 'A data analytics company working with government and enterprise clients. Known for its challenging work and selective hiring process.' },
  { name: 'Snowflake', slug: 'snowflake', description: 'A cloud data warehousing company growing rapidly. Popular among data engineering and software engineering graduates.' },
  { name: 'Databricks', slug: 'databricks', description: 'A data and AI company built on Apache Spark. Highly sought after by data science and machine learning graduates.' },
  { name: 'OpenAI', slug: 'openai', description: 'The AI research company behind ChatGPT and GPT-4. One of the most exciting and competitive employers for AI and machine learning graduates.' },
  { name: 'Anthropic', slug: 'anthropic', description: 'An AI safety company and creator of Claude. Highly sought after by machine learning researchers and engineers interested in safe AI development.' },
  { name: 'DeepMind', slug: 'deepmind', description: 'Google\'s AI research lab behind AlphaGo and AlphaFold. One of the most prestigious employers for AI and machine learning researchers.' },
  { name: 'ByteDance', slug: 'bytedance', description: 'The parent company of TikTok. One of the fastest growing tech companies, known for its fast-paced culture and competitive salaries.' },
  { name: 'Shopify', slug: 'shopify', description: 'A leading e-commerce platform powering millions of online stores. Known for its remote-first culture and strong engineering team.' },
  { name: 'Twilio', slug: 'twilio', description: 'A cloud communications platform used by developers worldwide. Popular among software engineering graduates for its developer-first culture.' },
  { name: 'GitHub', slug: 'github', description: 'The world\'s largest code hosting platform, owned by Microsoft. A dream employer for software engineers who want to build tools for developers.' },
  { name: 'Atlassian', slug: 'atlassian', description: 'The company behind Jira, Confluence, and Trello. Known for its strong engineering culture and distributed team model.' },
  { name: 'Dropbox', slug: 'dropbox', description: 'A cloud storage and collaboration platform. Known for its engineering culture and strong alumni network.' },
  { name: 'Zoom', slug: 'zoom', description: 'A leading video communications platform. Grew massively during the pandemic and offers strong engineering and product roles.' },
  { name: 'Slack', slug: 'slack', description: 'A workplace messaging platform now owned by Salesforce. Known for its thoughtful product culture and strong engineering team.' },
  { name: 'Square / Block', slug: 'square-block', description: 'A financial technology company behind Square payments and Cash App. Known for its mission-driven culture and strong engineering team.' },
  { name: 'Robinhood', slug: 'robinhood', description: 'A fintech company democratizing access to financial markets. Popular among finance and engineering graduates for its mission and fast growth.' },
  { name: 'Coinbase', slug: 'coinbase', description: 'A leading cryptocurrency exchange platform. Popular among finance and engineering graduates interested in blockchain and web3.' },
  { name: 'Figma', slug: 'figma', description: 'A collaborative design tool now owned by Adobe. Extremely popular among product design and frontend engineering graduates.' },
  { name: 'Notion', slug: 'notion', description: 'A productivity and note-taking platform loved by millions. Known for its small but highly talented team and strong product culture.' },
  { name: 'Canva', slug: 'canva', description: 'An online design platform used by millions worldwide. Popular among design and engineering graduates for its mission and growth trajectory.' },
  { name: 'Roblox', slug: 'roblox', description: 'An online gaming platform and creation system. Popular among game development and software engineering graduates.' },
  { name: 'Epic Games', slug: 'epic-games', description: 'The company behind Fortnite and Unreal Engine. A top destination for game development and graphics engineering graduates.' },
  { name: 'Riot Games', slug: 'riot-games', description: 'The company behind League of Legends and Valorant. Popular among game development graduates for its player-focused culture.' },
  { name: 'Goldman Sachs', slug: 'goldman-sachs', description: 'A leading global investment bank and financial services company. Top destination for finance and computer science graduates.' },
  { name: 'JPMorgan Chase', slug: 'jpmorgan-chase', description: 'One of the largest banks in the world with a massive tech division. Popular among finance and software engineering graduates.' },
  { name: 'McKinsey & Company', slug: 'mckinsey', description: 'One of the world\'s most prestigious management consulting firms. Highly sought after by business and engineering graduates.' },
  { name: 'Boston Consulting Group', slug: 'bcg', description: 'A top-tier management consulting firm. Known for its intellectual culture and strong graduate recruiting programs.' },
  { name: 'Deloitte', slug: 'deloitte', description: 'One of the Big Four professional services firms. Offers roles in consulting, technology, and finance for a wide range of graduates.' },
  { name: 'SpaceX', slug: 'spacex', description: 'Elon Musk\'s aerospace company pushing the boundaries of space exploration. A dream employer for aerospace and mechanical engineering graduates.' },
  { name: 'Tesla', slug: 'tesla', description: 'An electric vehicle and clean energy company. Highly sought after by mechanical, electrical, and software engineering graduates.' },
]

async function main(){
    const adminUser = await prisma.user.findUnique({where: {email: process.env.ADMIN_EMAIL}})

    if (!adminUser) {
        console.log("Error - Couldn't reach admin user.");
        return;
    }

    for (const company of companies) {
        await prisma.company.upsert({
            where: {slug: company.slug},
            update: {},
            create: {
                name: company.name,
                slug: company.slug,
                description: company.description,
                status: 'approved',
                userId: adminUser.id,
            }
        });
        console.log(`Done adding ${company.name}`);
    }
    console.log("Complete");
}

main()
    .catch(console.error)
    .finally(()=>prisma.$disconnect())