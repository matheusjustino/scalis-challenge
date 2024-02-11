import { CheckingAccount, SavingsAccount } from '@prisma/client';
import { z } from 'zod';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ENUMS
import { AccountType } from '@/enums/account-type.enum';

// UTILS
import { validateBalanceValueRegex } from '@/utils/validate-balance-value';

// SERVICES
import {
    getAccount,
    getAccounts,
    transferAmount,
} from '@/services/bank-account';

const formSchema = z.object({
    amount: z.string().min(1).regex(validateBalanceValueRegex, 'Invalid value'),
    targetAccountId: z.string().default(''),
    targetAccountType: z.nativeEnum(AccountType).default(AccountType.CHECKING),
});

type FormType = z.infer<typeof formSchema & FieldValues>;

const useAccountDetails = (userId: string, accountId: string) => {
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
        queryFn: async () => await getAccount(userId, accountId),
    });
    const getUserAccounts = useQuery({
        queryKey: [`list-user-accounts-${userId}-${accountId}`],
        queryFn: async () => {
            const query = {
                exclude: {
                    accountsId: [accountId],
                },
            };
            return await getAccounts(userId, query);
        },
    });
    const transferAmountMutation = useMutation({
        mutationKey: [`transfer-amount-${userId}-${accountId}`],
        mutationFn: async ({
            targetAccountType,
            targetAccountId,
            ...payload
        }: FormType) => {
            return await transferAmount({
                ...payload,
                userId,
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
                [`list-user-accounts-${userId}-${accountId}`],
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
                [`list-accounts-${userId}`],
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

    return {
        form,
        handleSelectAccountToTransfer,
        handleTransferAmount,
        getAccountDetailsQuery,
        getUserAccounts,
    };
};

export { useAccountDetails };
