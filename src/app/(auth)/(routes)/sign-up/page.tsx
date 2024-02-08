'use client';

import { NextPage } from 'next';
import Link from 'next/link';

// HOOKS
import { useSignIn } from './useSignUp';

// COMPONENTS
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SignUpPage: NextPage = () => {
    const { register, handleLogin, handleSubmit, errors, isLoading } =
        useSignIn();

    return (
        <div className="border-2 max-w-[480px] max-h-[720px] p-2 w-full rounded-md shadow-md">
            <div className="w-full h-[32px]">
                <Logo />
            </div>

            <form
                onSubmit={handleSubmit(handleLogin)}
                className="flex flex-col pt-6 gap-3"
            >
                <Input
                    id="firstName"
                    placeholder="First Name"
                    type="text"
                    register={register('firstName', { required: true })}
                    errors={errors}
                />

                <Input
                    id="lastName"
                    placeholder="Last Name"
                    type="text"
                    register={register('lastName', { required: true })}
                    errors={errors}
                />

                <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    register={register('email', { required: true })}
                    errors={errors}
                />

                <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    register={register('password', { required: true })}
                    errors={errors}
                />

                <div className="ml-auto">
                    <Link href="/sign-in">
                        <Button variant="link">Sign in</Button>
                    </Link>

                    <Button>Sign Up</Button>
                </div>
            </form>
        </div>
    );
};

export default SignUpPage;
