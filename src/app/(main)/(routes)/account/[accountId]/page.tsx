'use client';

import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';

// ENUMS
import { AccountType } from '@/enums/account-type.enum';

// COMPONENTS
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// SERVICES
import { getAccount, getAccounts } from '@/services/bank-account';

const formSchema = z.object({
    amount: z.string().min(1).default('0'),
    targetAccountId: z.string().default(''),
    targetAccountType: z.nativeEnum(AccountType).default(AccountType.CHECKING),
});

type FormType = z.infer<typeof formSchema & FieldValues>;

interface AccountDetailsPageProps {
    params: {
        accountId: string;
    };
}

const AccountDetailsPage: NextPage<AccountDetailsPageProps> = ({
    params: { accountId },
}) => {
    const { data: session } = useSession();
    const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: '0',
            targetAccountType: AccountType.CHECKING,
        },
    });
    const getAccountDetailsQuery = useQuery({
        queryKey: [`account-details-${accountId}`],
        queryFn: async () => await getAccount(session?.user.id, accountId),
    });
    const getUserAccounts = useQuery({
        queryKey: [`list-user-accounts-${session?.user.id}-${accountId}`],
        queryFn: async () => {
            const query = {
                exclude: {
                    accountsId: [accountId],
                },
            };
            return await getAccounts(session?.user.id, query);
        },
    });

    const handleSelectAccountToTransfer = (accountId: string) => {
        const selectedAcc = getUserAccounts.data?.find(
            (acc) => acc.id === accountId,
        );
        if (selectedAcc) {
            form.setValue('targetAccountId', accountId);
            form.setValue('targetAccountType', selectedAcc.type as AccountType);
        }
    };

    if (getAccountDetailsQuery.isLoading || getUserAccounts.isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full gap-3">
                <h1 className="text-xl text-indigo-800">Loading...</h1>
                <Spinner size="lg" />
            </div>
        );
    }

    if (!getAccountDetailsQuery.data) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full gap-3">
                <h1 className="text-xl text-indigo-800 font-semibold">
                    Account not found
                </h1>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h1 className="text-3xl text-indigo-800 uppercase">
                ACCOUNT DETAILS
            </h1>

            <form
                // onSubmit={form.handleSubmit(handleCreateAccount)}
                className="flex gap-6 flex-col mt-10 w-full md:w-1/2"
            >
                <Input
                    id="name"
                    placeholder="Account name"
                    type="text"
                    disabled
                    value={getAccountDetailsQuery.data.name}
                />

                <Input
                    id="balance"
                    placeholder="Account Balance"
                    type="number"
                    disabled
                    value={getAccountDetailsQuery.data.balance}
                />

                <div className="flex flex-col gap-2">
                    <h1 className="text-xl">Transform amount to</h1>

                    <RadioGroup
                        value={form.watch('targetAccountId')}
                        defaultValue={form.watch('targetAccountId')}
                        onValueChange={handleSelectAccountToTransfer}
                    >
                        {getUserAccounts.data?.map((account) => (
                            <div
                                key={account.id}
                                className="flex items-center space-x-2"
                            >
                                <RadioGroupItem
                                    value={account.id}
                                    id={account.id}
                                />
                                <label
                                    className={`${form.watch('targetAccountId') === account.id ? 'text-md text-indigo-600' : 'text-md text-gray-500'}`}
                                    htmlFor={account.id}
                                >
                                    {account.name}
                                </label>
                            </div>
                        ))}
                    </RadioGroup>

                    <Input type="number" placeholder="Amount" />
                </div>

                <Button type="submit">Create</Button>
            </form>
        </div>
    );
};

export default AccountDetailsPage;
