import { auth } from "@/auth"
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { sendApprovalEmail, sendRejectionEmail } from "@/src/lib/email";

export async function PATCH(
    request: Request,
    { params }: {params: Promise<{companyid: string}>}
) {
    const session = await auth();
    const {companyid} = await params;

    if (session?.user?.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({error: "Forbidden"}, {status: 403});
    }

    const body = await request.json();
    const status = body.status;
    if (status !== 'approved' && status !== 'rejected') {
        return NextResponse.json({error: "Invalid Status"}, {status: 400});
    }

    const company = await prisma.company.update({
        where: {id: companyid},
        data: {status},
        include: {user: true},
    })

    if (company.user.email) {
        if (status === 'approved') {
            await sendApprovalEmail(company.user.email, company.name, company.slug);
        }else{
            await sendRejectionEmail(company.user.email, company.name);
        }
    }

    return NextResponse.json(company);

}

