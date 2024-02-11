'use client';

import { NextPage } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// UTILS
import { formatBalance } from '@/utils/format-balance';

// HOOKS
import { useDashboard } from './useDashboard';

// COMPONENTS
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

const DashboardPage: NextPage = () => {
    const { data: session } = useSession();
    const { accountsQuery } = useDashboard(session?.user.id);

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

    if (!accountsQuery.data || accountsQuery.data.length === 0) {
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
        <div className="flex justify-between gap-4 w-full h-0 flex-wrap">
            {accountsQuery.data.map((account) => (
                <Link
                    key={account.id}
                    href={`/account/${account.id}`}
                    className="sm:max-w-[260px] w-full"
                >
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
