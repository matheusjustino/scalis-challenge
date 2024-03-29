import { NextResponse } from 'next/server';

// LIBS
import prisma from '@/lib/prisma';

// ENUMS
import { AccountType } from '@/enums/account-type.enum';

// INTERFACES
import { CreateAccountPayload } from '@/interfaces/create-account.interface';

export async function POST(req: Request) {
    const { type, balance, ...body } =
        (await req.json()) as CreateAccountPayload;

    const newAcc =
        type === AccountType.CHECKING
            ? await prisma.checkingAccount.create({
                  data: {
                      ...body,
                      type,
                      balance: Number(balance),
                  },
              })
            : await prisma.savingsAccount.create({
                  data: {
                      ...body,
                      type,
                      balance: Number(balance),
                  },
              });

    return NextResponse.json(newAcc, { status: 201 });
}
