import { Prisma } from "@prisma/client";
import { DefaultSession } from "next-auth";
import { Company } from "@prisma/client";
export type Review = {
    score: number;
    id: string;
    text: string;
    createdAt: string;
    company: Company;
}

export type ReviewListProps = {
    reviews: Review[];
}

export type ReviewWithCompany = Prisma.ReviewGetPayload<{include:{company: true}}>;

export type ReviewListWithCompanyProps = {
    reviews: ReviewWithCompany[];
}

export type CompaniesListProps = {
    companies: Company[];
}

declare module 'next-auth' {
    interface Session {
        user: {
            id: string,
        } & DefaultSession['user']
    }
}