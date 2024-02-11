import { CheckingAccount, SavingsAccount } from '@prisma/client';
import { AccountType } from '@/enums/account-type.enum';

export const dashboardAccounts: (CheckingAccount | SavingsAccount)[] = [
    {
        id: 'clsfzy3vl0004d6wo4y1r75tt',
        name: 'Checking Acc',
        balance: 1000,
        userId: 'clsfzwdjv0000d6wo9rp4ingv',
        type: AccountType.CHECKING,
    },
    {
        id: 'clsfzya920006d6womuxnegr3',
        name: 'Saving Acc',
        balance: 1000,
        userId: 'clsfzwdjv0000d6wo9rp4ingv',
        type: AccountType.SAVING,
    },
];
