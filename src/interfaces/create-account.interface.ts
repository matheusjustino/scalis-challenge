// ENUMS
import { AccountType } from '@/enums/account-type.enum';

export interface CreateAccountPayload {
    name: string;
    balance: string;
    type: AccountType;
    userId: string;
}
