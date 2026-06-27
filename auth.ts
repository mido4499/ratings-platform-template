import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/src/lib/db";
import bcrypt from 'bcryptjs';


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Credentials({
            credentials: {
                email: {label: 'Email', type: 'email'},
                password: {label: 'Password', type: 'password'}
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing Credentials---------------_!!!!!!!!!!!!!!!!!!!!!!!!!");
                    return null;
                }; // Checks both email and password are provided

                const user = await prisma.user.findUnique({
                    where: {email: credentials.email as string} // Gets the user with this email from the database
                });

                if (!user) {console.log("user not found"); return null;}
                if (!user.password){console.log("user doesn't have a password---------------_!!!!!!!!!!!!!!!!!!!!!!!!!")}

                if (!user || !user.password) {return null}; // If the user does not exist or a password doesn't exist, null

                const isValid = await bcrypt.compare(credentials.password as string, user.password); // Validates the password

                if (!isValid) {console.log("passwords didn't match---------------_!!!!!!!!!!!!!!!!!!!!!!!!!", user.email, "--------", user.password); return null}; 

                return user;
            }
        })
    ],
    session: { strategy: 'jwt' },
    callbacks: {
        async signIn({user, account}) {
            if (account?.provider === 'google') {
                await prisma.user.upsert({
                    where: {email: user.email!},
                    update: {},
                    create: {
                        email: user.email!,
                        name: user.name,
                        image: user.image,
                    }
                })
            }
            return true;
        },

        async jwt({token, trigger, session, account}) {
            if (account) {
                const dbUser = await prisma.user.findUnique({
                    where: {email: token.email!}
                })
                if (dbUser) token.id = dbUser.id;
            }
            if (trigger === 'update' && session?.name) {
                token.name = session.name
            }
            return token;
        },
        async session({session, token}) {
            session.user.id = token.id as string;

            return session;
        }
    }
})