import { expect, test, describe } from 'vitest';
import { render, screen } from '@testing-library/react';

import MarketingPage from '@/app/(marketing)/page';

describe(`Marking Page`, () => {
    test(`Should render the successfully`, () => {
        render(<MarketingPage />);

        expect(screen.getByText(`Welcome back, visitor!`)).to.exist;

        expect(screen.getByText(`Log in`)).to.exist;
    });
});
