/* eslint-disable react/display-name */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return ({ children }: any) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
