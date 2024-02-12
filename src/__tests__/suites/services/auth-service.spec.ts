import { expect, describe, test, vi, MockedFunction } from 'vitest';
import axios from 'axios';
import { User } from '@prisma/client';

// INTERFACES
import { IRegisterUser } from '@/interfaces/register-user.interface';

// SERVICES
import { register } from '@/services/auth.service';

vi.mock('axios', () => {
    return {
        default: {
            post: vi.fn(),
            get: vi.fn(),
            delete: vi.fn(),
            put: vi.fn(),
            create: vi.fn().mockReturnThis(),
            interceptors: {
                request: {
                    use: vi.fn(),
                    eject: vi.fn(),
                },
                response: {
                    use: vi.fn(),
                    eject: vi.fn(),
                },
            },
        },
    };
});

describe(`Auth Service`, () => {
    test(`Should create a new user`, async () => {
        const newUserPayload: IRegisterUser = {
            firstName: `Test`,
            lastName: `Scalis`,
            email: `test-scalis@email.com`,
            password: `123`,
        };
        const newUserMock: User = {
            id: `1`,
            createdAt: new Date(),
            updateAt: new Date(),
            ...newUserPayload,
        };
        (axios.post as MockedFunction<typeof axios.post>).mockImplementation(
            async () => ({
                data: newUserMock,
            }),
        );

        const newUser = await register(newUserPayload);

        expect(newUser.id).toBe(newUserMock.id);
        expect(newUser.email).toBe(newUserMock.email);
    });
});
