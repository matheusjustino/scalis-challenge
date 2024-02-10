import { NextResponse } from 'next/server';

// LIBS
import prisma from '@/lib/prisma';

export async function GET(_: Request, ctx: any) {
    const { userId } = ctx.params;

    const promises = await Promise.all([
        prisma.checkingAccount.findMany({
            where: {
                userId,
            },
        }),
        prisma.savingsAccount.findMany({
            where: {
                userId,
            },
        }),
    ]);

    return NextResponse.json(promises.flat(), { status: 200 });
}
