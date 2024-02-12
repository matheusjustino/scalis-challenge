import { expect, test, describe, vi, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';

// HOOKS
import { useDashboard } from '@/app/(main)/(routes)/dashboard/useDashboard';

// WRAPPER
import { createWrapper } from '@/__tests__/helpers/query-client-wrapper';

// MOCKS
import { dashboardAccounts } from '@/__tests__/mocks/dashboard.mock';

// PAGES
import DashboardPage from '@/app/(main)/(routes)/dashboard/page';

vi.mock('next-auth/react');
vi.mock(`@/app/(main)/(routes)/dashboard/useDashboard`);

describe(`Dashboard Page`, () => {
    test(`Should render a loading message`, () => {
        const userId = `userId`;
        const mockedSession = useSession as Mock;
        mockedSession.mockImplementation(() => ({
            data: {
                user: {
                    id: userId,
                },
            },
        }));
        const mockedHook = useDashboard as Mock;
        mockedHook.mockImplementation(() => ({
            accountsQuery: {
                isLoading: true,
            },
        }));

        render(<DashboardPage />, {
            wrapper: createWrapper(),
        });

        expect(screen.getByText(`Loading your accounts...`)).to.exist;
    });

    test(`Should render successfully without data`, () => {
        const userId = `userId`;
        const mockedSession = useSession as Mock;
        mockedSession.mockImplementation(() => ({
            data: {
                user: {
                    id: userId,
                },
            },
        }));
        const mockedHook = useDashboard as Mock;
        mockedHook.mockImplementation(() => ({
            accountsQuery: {
                isLoading: false,
            },
        }));

        render(<DashboardPage />, {
            wrapper: createWrapper(),
        });

        expect(
            screen.getByText(
                `You don't have any account yet. Please, create a new one.`,
            ),
        ).to.exist;
    });

    test(`Should render successfully with checking account`, () => {
        const userId = `userId`;
        const mockedSession = useSession as Mock;
        mockedSession.mockImplementation(() => ({
            data: {
                user: {
                    id: userId,
                },
            },
        }));
        const mockedHook = useDashboard as Mock;
        mockedHook.mockImplementation(() => ({
            accountsQuery: {
                data: dashboardAccounts,
                isLoading: false,
            },
        }));

        render(<DashboardPage />, {
            wrapper: createWrapper(),
        });

        expect(screen.getByText(`Checking Acc`)).to.exist;

        expect(
            screen.getAllByText((content, element) => {
                return content.startsWith('Balance');
            }),
        ).to.exist;

        expect(
            screen.getAllByText((content, element) => {
                return content.endsWith('$1,000.00');
            }),
        ).to.exist;
    });

    test(`Should render successfully with saving account`, () => {
        const userId = `userId`;
        const mockedSession = useSession as Mock;
        mockedSession.mockImplementation(() => ({
            data: {
                user: {
                    id: userId,
                },
            },
        }));
        const mockedHook = useDashboard as Mock;
        mockedHook.mockImplementation(() => ({
            accountsQuery: {
                data: dashboardAccounts,
                isLoading: false,
            },
        }));

        render(<DashboardPage />, {
            wrapper: createWrapper(),
        });

        expect(screen.getByText(`Saving Acc`)).to.exist;

        expect(
            screen.getAllByText((content, element) => {
                return content.startsWith('Balance');
            }),
        ).to.exist;

        expect(
            screen.getAllByText((content, element) => {
                return content.endsWith('$1,000.00');
            }),
        ).to.exist;
    });
});
