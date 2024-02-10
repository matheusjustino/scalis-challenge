// ENUMS
import { AccountType } from '@/enums/account-type.enum';

export interface ITransferAmountPayload {
    userId: string;
    sourceAccountId: string;
    targetAccountId: string;
    sourceAccountType: AccountType;
    targetAccountType: AccountType;
    amount: string;
}
