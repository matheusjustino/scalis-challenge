'use client';

import { NextPage } from 'next';
import { useSession } from 'next-auth/react';

// COMPONENTS
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// SERVICES
import { useAccountDetails } from './useAccountDetails';

interface AccountDetailsPageProps {
    params: {
        accountId: string;
    };
}

const AccountDetailsPage: NextPage<AccountDetailsPageProps> = ({
    params: { accountId },
}) => {
    const { data: session } = useSession();
    const {
        form,
        getAccountDetailsQuery,
        getUserAccounts,
        handleSelectAccountToTransfer,
        handleTransferAmount,
    } = useAccountDetails(session?.user.id, accountId);

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
