import { CheckingAccount, SavingsAccount } from '@prisma/client';

// LIBS
import { api } from '@/lib/axios';

// INTERFACES
import { CreateAccountPayload } from '@/interfaces/create-account.interface';
import { AxiosRequestConfig } from 'axios';

interface GetAccountsQuery {
    exclude: {
        accountsId: string[];
    };
}

export const createNewAccount = async (payload: CreateAccountPayload) => {
    return api
        .post<CheckingAccount | SavingsAccount>(`/account/new`, payload)
        .then((res) => res.data);
};

export const getAccounts = async (userId: string, query?: GetAccountsQuery) => {
    const config: AxiosRequestConfig = {
        params: {
            ...(!!query && { accountsId: query.exclude.accountsId }),
        },
    };
    return api
        .get<(CheckingAccount | SavingsAccount)[]>(`/account/${userId}`, config)
        .then((res) => res.data);
};

export const getAccount = async (userId: string, accountId: string) => {
    return api
        .get<
            CheckingAccount | SavingsAccount
        >(`/account/${userId}/${accountId}`)
        .then((res) => res.data);
};
