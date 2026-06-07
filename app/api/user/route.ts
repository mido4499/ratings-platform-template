import { prisma } from '@/src/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function PATCH(
    request: Request,
){  
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({error: "unauthorized"}, {status: 401});
    }
    const user = session.user;

    const {name, password} = await request.json();

    if (password) {
        const dbUser = await prisma.user.findUnique({
            where: {id: user.id},
        });
        if (!dbUser?.password) {
            return NextResponse.json({error: 'Cannot set passwords/emails for Google Accounts'}, {status: 400});
        }
    }

    const updatedUser = await prisma.user.update({
        where: {id: user.id},
        data: {
            ...(name && {name}),
            ...(password && {password: await bcrypt.hash(password, 10)})
        }
    })

    return Response.json(updatedUser);
}