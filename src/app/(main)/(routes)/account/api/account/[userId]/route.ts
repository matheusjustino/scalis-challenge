import { NextRequest, NextResponse } from 'next/server';

// LIBS
import prisma from '@/lib/prisma';

interface IParams {
    userId: string;
    exclude: {
        accountsId: string[];
    };
}

export async function GET(req: NextRequest, ctx: any) {
    const { searchParams } = new URL(req.url);
    const { userId } = ctx.params as IParams;

    const promises = await Promise.all([
        prisma.checkingAccount.findMany({
            where: {
                userId,
                id: {
                    notIn: searchParams.getAll('accountsId[]'),
                },
            },
        }),
        prisma.savingsAccount.findMany({
            where: {
                userId,
                id: {
                    notIn: searchParams.getAll('accountsId[]'),
                },
            },
        }),
    ]);

    return NextResponse.json(promises.flat(), { status: 200 });
}
