import { NextPage } from 'next';

// COMPONENTS
import { Navbar } from './_components/navbar';

const HomePage: NextPage = () => {
    return (
        <>
            <Navbar />

            <div className="pt-32 flex flex-col items-center justify-center gap-12 px-3 py-2">
                <h1 className="text-5xl">Welcome back, visitor!</h1>

                <h2 className="text-2xl">
                    This is the{' '}
                    <b className="underline text-blue-700">SCALIS</b> challenge.
                </h2>
            </div>
        </>
    );
};

export default HomePage;
