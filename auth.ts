import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Credentials({
            credentials: {
                email: {label: 'Email', type: 'email'},
                password: {label: 'Password', type: 'password'}
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null; // Checks both email and password are provided

                const user = await prisma.user.findUnique({
                    where: {email: credentials.email as string} // Gets the user with this email from the database
                });

                if (!user || !user.password) return null; // If the user does not exist or a password doesn't exist, null

                const isValid = await bcrypt.compare(credentials.password as string, user.password); // Validates the password

                if (!isValid) return null; 

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

        async jwt({token, account}) {
            if (account) {
                const dbUser = await prisma.user.findUnique({
                    where: {email: token.email!}
                })
                if (dbUser) token.id = dbUser.id;
            }
            return token;
        },
        async session({session, token}) {
            session.user.id = token.id as string;

            return session;
        }
    }
})