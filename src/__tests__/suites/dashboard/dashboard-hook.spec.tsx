import { expect, test, vi, Mock } from 'vitest';
import { waitFor, renderHook } from '@testing-library/react';

// HOOKS
import { useDashboard } from '@/app/(main)/(routes)/dashboard/useDashboard';

// WRAPPER
import { createWrapper } from '@/__tests__/helpers/query-client-wrapper';

// MOCKS
import { dashboardAccounts } from '@/__tests__/mocks/dashboard.mock';

vi.mock(`@/app/(main)/(routes)/dashboard/useDashboard`);

test(`Dashboard Hook`, async () => {
    const userId = `userId`;
    const mockedHook = useDashboard as Mock;
    mockedHook.mockImplementation(() => ({
        accountsQuery: {
            data: dashboardAccounts,
        },
    }));

    const { result } = renderHook(() => useDashboard(userId), {
        wrapper: createWrapper(),
    });
    await waitFor(() => result.current.accountsQuery.isSuccess);

    expect(result.current.accountsQuery.data).toBeDefined();
    expect(result.current.accountsQuery.data?.length).toEqual(
        dashboardAccounts.length,
    );
    expect(result.current.accountsQuery.data?.[0].id).toEqual(
        dashboardAccounts[0].id,
    );
});
