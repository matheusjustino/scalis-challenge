import { NextResponse } from 'next/server';

// LIBS
import prisma from '@/lib/prisma';

// ENUMS
import { AccountType } from '@/enums/account-type.enum';

// INTERFACES
import { ITransferAmountPayload } from '@/interfaces/transfer-amount-payload.interface';
import { ITransferAmountResponse } from '@/interfaces/transfer-amount-response.interface';

export async function POST(req: Request) {
    const {
        userId,
        targetAccountId,
        targetAccountType,
        sourceAccountId,
        sourceAccountType,
        amount,
    } = (await req.json()) as ITransferAmountPayload;

    if (targetAccountType === AccountType.CHECKING) {
        const targetAcc = await prisma.checkingAccount.findFirst({
            where: {
                id: targetAccountId,
                userId,
            },
        });
        if (!targetAcc) {
            return NextResponse.json('Target account not found', {
                status: 404,
            });
        }

        if (sourceAccountType === AccountType.CHECKING) {
            const sourceAcc = await prisma.checkingAccount.findFirst({
                where: {
                    id: sourceAccountId,
                    userId,
                },
            });
            if (!sourceAcc) {
                return NextResponse.json('Source account not found', {
                    status: 404,
                });
            }

            if (sourceAcc.balance - Number(amount) <= 0) {
                return NextResponse.json('Insufficient funds', { status: 400 });
            }

            const [source, target] = await prisma.$transaction([
                prisma.checkingAccount.update({
                    where: {
                        id: sourceAccountId,
                        userId,
                    },
                    data: {
                        balance: {
                            set: sourceAcc.balance - Number(amount),
                        },
                    },
                }),
                prisma.checkingAccount.update({
                    where: {
                        id: targetAccountId,
                        userId,
                    },
                    data: {
                        balance: {
                            set: targetAcc.balance + Number(amount),
                        },
                    },
                }),
            ]);

            return NextResponse.json<ITransferAmountResponse>({
                sourceAccount: source,
                targetAccount: target,
            });
        } else {
            const sourceAcc = await prisma.savingsAccount.findFirst({
                where: {
                    id: sourceAccountId,
                    userId,
                },
            });
        }
    }
}
