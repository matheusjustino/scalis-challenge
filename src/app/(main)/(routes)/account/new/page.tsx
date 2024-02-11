'use client';

import { NextPage } from 'next';

// COMPONENTS
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';

// HOOKS
import { useAccountNew } from './useAccountNew';

// ENUMS
import { AccountType } from '@/enums/account-type.enum';

// COMPONENTS
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const NewAccountPage: NextPage = () => {
    const { data: session } = useSession();
    const { form, handleCreateAccount, loading } = useAccountNew(
        session?.user.id,
    );

    return (
        <div className="w-full">
            <h1 className="text-3xl text-indigo-800 uppercase">New Account</h1>

            <form
                onSubmit={form.handleSubmit(handleCreateAccount)}
                className="flex gap-6 flex-col mt-10 w-full md:w-1/2"
            >
                <Input
                    id="name"
                    placeholder="Account name"
                    type="text"
                    register={form.register('name', { required: true })}
                    errors={form.formState.errors}
                />

                <Input
                    id="balance"
                    placeholder="Account Balance"
                    type="text"
                    register={form.register('balance', { required: true })}
                    errors={form.formState.errors}
                />

                <div className="flex flex-col gap-2">
                    <h1 className="text-xl">Account Type</h1>

                    <RadioGroup
                        value={form.watch('type')}
                        defaultValue={form.watch('type')}
                        onValueChange={(v: AccountType) =>
                            form.setValue('type', v)
                        }
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value={AccountType.CHECKING}
                                id={AccountType.CHECKING}
                            />
                            <label
                                className="capitalize"
                                htmlFor={AccountType.CHECKING}
                            >
                                {AccountType.CHECKING.toLowerCase()}
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value={AccountType.SAVING}
                                id={AccountType.SAVING}
                            />
                            <label
                                className="capitalize"
                                htmlFor={AccountType.SAVING}
                            >
                                {AccountType.SAVING.toLowerCase()}
                            </label>
                        </div>
                    </RadioGroup>
                </div>

                <Button loading={loading} disabled={loading} type="submit">
                    Create
                </Button>
            </form>
        </div>
    );
};

export default NewAccountPage;
