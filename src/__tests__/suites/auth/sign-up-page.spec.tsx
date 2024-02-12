import { expect, test, describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// PAGES
import SignUpPage from '@/app/(auth)/(routes)/sign-up/page';

vi.mock('next/navigation', () => {
    return {
        useRouter: () => ({
            push: vi.fn(),
        }),
    };
});

describe('SignUp Page', () => {
    test(`Should render the page successfully`, () => {
        render(<SignUpPage />);

        expect(screen.getByText(`Sign Up`)).to.exist;
    });
});
