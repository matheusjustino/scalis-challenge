'use client';

import { NextPage } from 'next';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

// SERVICES
import { getAccounts } from '@/services/bank-account';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatBalance } from '@/utils/format-balance';

const DashboardPage: NextPage = () => {
    const { data: session } = useSession();
    const accountsQuery = useQuery({
        queryKey: [`list-accounts-${session?.user.id}`],
        queryFn: async () => await getAccounts(session?.user.id),
    });

    if (accountsQuery.isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full gap-3">
                <h1 className="text-xl text-indigo-800">
                    Loading your accounts...
                </h1>
                <Spinner size="lg" />
            </div>
        );
    }

    if (accountsQuery.data?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full gap-3">
                <h1 className="text-xl text-indigo-800 font-semibold">{`You don't have any account yet. Please, create a new one.`}</h1>
                <Link href="/account/new">
                    <Button>Create here</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full h-full">
            {accountsQuery.data?.map((account) => (
                <Link key={account.id} href={`/account/${account.id}`}>
                    <div className="flex flex-col justify-between min-w-[220px] min-h-[120px] w-full bg-indigo-100 px-3 py-2 rounded-md">
                        <h1 className="text-xl font-bold">{account.name}</h1>

                        <span>Balance: {formatBalance(account.balance)}</span>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default DashboardPage;
