import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

// LIBS
import prisma from '@/lib/prisma';

// INTERFACES
import { IRequestUser } from '@/interfaces/request-user.interface';

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 12,
    },
    jwt: {
        maxAge: 60 * 60 * 12,
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {
                email: {
                    label: 'email',
                    type: 'email',
                    placeholder: 'your@email.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials, req) => {
                if (!credentials) {
                    throw new Error('Invalid data');
                }
                try {
                    const user = await prisma.user.findFirst({
                        where: {
                            email: credentials.email,
                        },
                    });

                    if (!user) {
                        throw new Error('Invalid credentials');
                    }

                    const validPassword = await compare(
                        credentials.password,
                        user.password,
                    );
                    if (!validPassword) {
                        throw new Error('Invalid credentials');
                    }

                    const token = sign(
                        {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                        },
                        process.env.NEXTAUTH_SECRET as string,
                        {
                            expiresIn: '12h',
                        },
                    );

                    return Promise.resolve({
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        token,
                    } as IRequestUser);
                } catch (error: any) {
                    console.error(error);
                    if (
                        error.message.includes('Network Error') ||
                        error.message.includes('connect ECONNREFUSED')
                    ) {
                        throw new Error('Unable to connect to the server');
                    }

                    const errorMsg =
                        error.response?.data.message || error.message || error;

                    throw new Error(errorMsg);
                }
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            user && (token.user = user);
            return token;
        },
        session: async ({ session, token }) => {
            if (session.user) {
                session.user = token.user as IRequestUser;
            }
            return session;
        },
    },
};

export const getAuthSession = () => getServerSession(authOptions);
