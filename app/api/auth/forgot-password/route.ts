import {prisma} from "@/src/lib/db";
import { NextResponse } from "next/server";
import crypto from 'crypto';
import { sendResetPasswordEmail } from "@/src/lib/email";

export async function POST(request: Request) {

    const { email } = await request.json();
    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user || !user.password) {
        return NextResponse.json({success: true})
    }

    await prisma.passwordResetToken.deleteMany({where: {userId: user.id}});

    const token = crypto.randomBytes(32).toString('hex');

    await prisma.passwordResetToken.create({
        data: {
            token,
            userId: user.id,
            expiresAt: new Date(Date.now() + 1000 * 3600),
        },
    })

    await sendResetPasswordEmail(email, token);

    return NextResponse.json({success: true});

}