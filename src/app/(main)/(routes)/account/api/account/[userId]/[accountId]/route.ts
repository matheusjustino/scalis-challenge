import { NextResponse } from 'next/server';

// LIBS
import prisma from '@/lib/prisma';

export async function GET(_: Request, ctx: any) {
    const { userId, accountId } = ctx.params;

    const checkingAccount = await prisma.checkingAccount.findFirst({
        where: {
            id: accountId,
            userId,
        },
    });
    if (checkingAccount)
        return NextResponse.json(checkingAccount, { status: 200 });

    const savingAccount = await prisma.savingsAccount.findFirst({
        where: {
            id: accountId,
            userId,
        },
    });
    if (savingAccount) return NextResponse.json(savingAccount, { status: 200 });

    return NextResponse.json('Account not found', { status: 404 });
}
