import { CheckingAccount, SavingsAccount } from '@prisma/client';

export interface ITransferAmountResponse {
    sourceAccount: CheckingAccount | SavingsAccount;
    targetAccount: CheckingAccount | SavingsAccount;
}
