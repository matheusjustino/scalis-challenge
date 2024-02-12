import { expect, test, describe } from 'vitest';
import { render, screen } from '@testing-library/react';

// PAGES
import SignInPage from '@/app/(auth)/(routes)/sign-in/page';

describe('SignIn Page', () => {
    test(`Should render the page successfully`, () => {
        render(<SignInPage />);

        expect(screen.getByText(`Sign in`)).to.exist;
    });
});
