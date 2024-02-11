import { useQuery } from '@tanstack/react-query';

// SERVICES
import { getAccounts } from '@/services/bank-account';

const useDashboard = (userId: string) => {
    const accountsQuery = useQuery({
        queryKey: [`list-accounts-${userId}`],
        queryFn: async () => await getAccounts(userId),
    });

    return {
        accountsQuery,
    };
};

export { useDashboard };
