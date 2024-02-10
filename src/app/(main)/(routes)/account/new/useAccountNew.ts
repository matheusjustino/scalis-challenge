import { useCallback, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { AccountType } from '@/enums/account-type.enum';
import { useMutation } from '@tanstack/react-query';
import { createNewAccount } from '@/services/bank-account';

const formSchema = z.object({
    name: z.string().min(1),
    balance: z.string().min(1).default('0'),
    type: z.nativeEnum(AccountType).default(AccountType.CHECKING),
});

type FormType = z.infer<typeof formSchema & FieldValues>;

const useAccountNew = (userId: string) => {
    const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: 'New Account',
            balance: '0',
            type: AccountType.CHECKING,
        },
    });
    const createAccountBankMutation = useMutation({
        mutationKey: [`create-account-bank`],
        mutationFn: createNewAccount,
        onSuccess: () => form.reset(),
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
