import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json({error: 'invalid request'}, {status: 400});
        }

        if(password.length < 8) {
            return NextResponse.json({error: 'Password must be at least 8 characters'}, {status: 400});
        }

        const resetToken = await prisma.passwordResetToken.findUnique({
            where: {token}
        })

        if (!resetToken || resetToken.expiresAt < new Date()) {
            return NextResponse.json({error: 'Reset Link is invalid or has expired'}, {status: 400});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: {id: resetToken.userId},
            data: {password: hashedPassword}
        })

        await prisma.passwordResetToken.delete({
            where: {token}
        })

        return NextResponse.json({success: true});
    }catch (error) {
        console.log("ERROR------------------>", error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500})
    }
    

}