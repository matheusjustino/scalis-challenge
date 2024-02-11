import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckingAccount, SavingsAccount } from '@prisma/client';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

// ENUMS
import { AccountType } from '@/enums/account-type.enum';

// UTILS
import { validateBalanceValueRegex } from '@/utils/validate-balance-value';

// SERVICES
import { createNewAccount } from '@/services/bank-account';

const formSchema = z.object({
    name: z.string().min(1),
    balance: z
        .string()
        .min(1)
        .regex(validateBalanceValueRegex, 'Invalid value'),
    type: z.nativeEnum(AccountType).default(AccountType.CHECKING),
});

type FormType = z.infer<typeof formSchema & FieldValues>;

const useAccountNew = (userId: string) => {
    const queryClient = useQueryClient();
    const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: 'New Account',
            balance: '',
            type: AccountType.CHECKING,
        },
    });
    const createAccountBankMutation = useMutation({
        mutationKey: [`create-account-bank`],
        mutationFn: createNewAccount,
        onSuccess: (data) => {
            queryClient.setQueryData(
                [`list-accounts-${userId}`],
                (oldData?: (CheckingAccount | SavingsAccount)[]) => {
                    if (!oldData) return oldData;
                    return [...oldData, data];
                },
            );

            form.reset();
            toast.success(`New account created successfully`);
        },
        onError: (error: any) => {
            console.error(error);
            const errorMsg = error.response?.data || `Something went wrong`;
            toast.error(errorMsg, { description: `Try again later` });
        },
    });

    const handleCreateAccount: SubmitHandler<FormType> = async (
        data,
        event,
    ) => {
        event?.preventDefault();

        if (!Number(data.balance)) {
            return toast.warning(`Invalid balance value`);
        }

        await createAccountBankMutation.mutateAsync({
            ...data,
            userId,
        });
    };

    return {
        form,
        handleCreateAccount,
        loading: createAccountBankMutation.isPending,
    };
};

export { useAccountNew };
