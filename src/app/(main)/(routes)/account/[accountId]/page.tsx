'use client';

import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ENUMS
import { AccountType } from '@/enums/account-type.enum';

// COMPONENTS
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// SERVICES
import {
    getAccount,
    getAccounts,
    transferAmount,
} from '@/services/bank-account';
import { toast } from 'sonner';
import { CheckingAccount, SavingsAccount } from '@prisma/client';

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
    const queryClient = useQueryClient();
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
    const transferAmountMutation = useMutation({
        mutationKey: [`transfer-amount-${session?.user.id}-${accountId}`],
        mutationFn: async ({
            targetAccountType,
            targetAccountId,
            ...payload
        }: FormType) => {
            return await transferAmount({
                ...payload,
                userId: session?.user.id,
                targetAccountId,
                targetAccountType,
                sourceAccountId: accountId,
                sourceAccountType: getAccountDetailsQuery.data
                    ?.type as AccountType,
            });
        },
        onSuccess: ({ sourceAccount, targetAccount }) => {
            // update source acc
            queryClient.setQueryData(
                [`account-details-${accountId}`],
                (oldData?: CheckingAccount | SavingsAccount) => {
                    if (!oldData) return oldData;
                    return sourceAccount;
                },
            );

            // update target acc
            queryClient.setQueryData(
                [`account-details-${targetAccount.id}`],
                (oldData?: CheckingAccount | SavingsAccount) => {
                    if (!oldData) return oldData;
                    return targetAccount;
                },
            );

            // update account list at account details
            queryClient.setQueryData(
                [`list-user-accounts-${session?.user.id}-${accountId}`],
                (oldData?: (CheckingAccount | SavingsAccount)[]) => {
                    if (!oldData) return oldData;

                    const targetAccIndex = oldData.findIndex(
                        (acc) => acc.id === targetAccount.id,
                    );
                    if (targetAccIndex < 0) return oldData;

                    const oldDataCopy = [...oldData];
                    oldDataCopy[targetAccIndex] = targetAccount;

                    return oldDataCopy;
                },
            );

            // update account list at dashboard
            queryClient.setQueryData(
                [`list-accounts-${session?.user.id}`],
                (oldData?: (CheckingAccount | SavingsAccount)[]) => {
                    if (!oldData) return oldData;

                    const sourceAccIndex = oldData.findIndex(
                        (acc) => acc.id === sourceAccount.id,
                    );
                    const targetAccIndex = oldData.findIndex(
                        (acc) => acc.id === targetAccount.id,
                    );
                    if (sourceAccIndex < 0 || targetAccIndex < 0)
                        return oldData;

                    const oldDataCopy = [...oldData];
                    oldDataCopy[sourceAccIndex] = sourceAccount;
                    oldDataCopy[targetAccIndex] = targetAccount;

                    return oldDataCopy;
                },
            );

            form.reset();
            toast.success(`Transfer completed successfully`);
        },
        onError: (error: any) => {
            console.error(error);
            const errorMsg = error.response.data || `Something went wrong`;
            toast.error(errorMsg, { description: `Try again later` });
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

    const handleTransferAmount: SubmitHandler<FormType> = async (
        data,
        event,
    ) => {
        event?.preventDefault();

        if (
            getAccountDetailsQuery.data &&
            getAccountDetailsQuery.data.balance - Number(data.amount) <= 0
        ) {
            return toast.warning(`Insufficient funds`, {
                description: 'Choose another value',
            });
        }

        await transferAmountMutation.mutateAsync(data);
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
                onSubmit={form.handleSubmit(handleTransferAmount)}
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

                    <Input
                        register={form.register('amount', { required: true })}
                        errors={form.formState.errors}
                        type="number"
                        placeholder="Amount"
                    />
                </div>

                <Button type="submit">Transfer</Button>
            </form>
        </div>
    );
};

export default AccountDetailsPage;
