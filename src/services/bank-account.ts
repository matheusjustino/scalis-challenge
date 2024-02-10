import { CheckingAccount, SavingsAccount } from '@prisma/client';

// LIBS
import { api } from '@/lib/axios';

// INTERFACES
import { CreateAccountPayload } from '@/interfaces/create-account.interface';

export const createNewAccount = async (payload: CreateAccountPayload) => {
    return api
        .post<CheckingAccount | SavingsAccount>(`/accounts/new`, payload)
        .then((res) => res.data);
};

export const getAccounts = async (userId: string) => {
    return api
        .get<(CheckingAccount | SavingsAccount)[]>(`/accounts/${userId}`)
        .then((res) => res.data);
};

export const getAccount = async (userId: string, accountId: string) => {
    return api
        .get<
            CheckingAccount | SavingsAccount
        >(`/accounts/${userId}/${accountId}`)
        .then((res) => res.data);
};
