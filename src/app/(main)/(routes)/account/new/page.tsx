'use client';

import { NextPage } from 'next';

// COMPONENTS
import { Input } from '@/components/ui/input';

const NewAccountPage: NextPage = () => {
    return (
        <div className="w-full">
            <h1 className="text-3xl text-indigo-800 uppercase">New Account</h1>

            <form className="flex gap-4 flex-col mt-10 w-full md:w-1/2">
                <Input placeholder="Account name" />

                <Input placeholder="Account balance" type="number" />
            </form>
        </div>
    );
};

export default NewAccountPage;
