// Signup route
import {prisma} from "@/src/lib/db";
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';


export async function POST(request: Request){
    const {name, email, password} = await request.json();

    if (!name || !email || !password) {
        return NextResponse.json(
            {error: 'Name, email, and password are required.'},
            {status: 400}
        )
    }

    if (password.length < 8) {
        return NextResponse.json(
            {error: "Password must be at least 8 characters."},
            {status: 400}
        )
    }

    // Check if exists
    const existing = await prisma.user.findUnique({
        where: {
            email: email,
        }
    })
    if (existing){
        return NextResponse.json(
            {error: "Email already exists"},
            {status: 400}
        )
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            email,
            name,
            password: hashPassword,
        }
    });

    return NextResponse.json({success: true});


}