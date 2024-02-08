'use client';

import { useSession } from 'next-auth/react';
import { ChevronFirst, ChevronLast } from 'lucide-react';

// PROVIDERS
import { useSidebar } from '@/providers/sidebar.provider';

// COMPONENTS
import { Logo } from '@/components/logo';
import { AvatarImg } from '@/components/avatar-img';

interface SidebarProps {
    children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
    const { data: session } = useSession();
    const { expanded, handleExpand } = useSidebar();

    return (
        <aside className="h-screen">
            <nav className="h-full flex flex-col border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <div
                        className={`overflow-hidden transition-all
                        ${expanded ? 'w-32' : 'w-0'}`}
                    >
                        <Logo />
                    </div>

                    <button
                        onClick={handleExpand}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-gray-100"
                    >
                        {expanded ? <ChevronFirst /> : <ChevronLast />}
                    </button>
                </div>

                <ul className="flex-1 px-3">{children}</ul>

                <div className="border-t flex p-3">
                    <div className="w-10 h-10">
                        <AvatarImg
                            firstName={session?.user.firstName}
                            lastName={session?.user.lastName}
                        />
                    </div>

                    <div
                        className={`flex justify-between items-center
                        overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}`}
                    >
                        <div className="leading-4">
                            <h4 className="font-semibold">
                                {session?.user.firstName}{' '}
                                {session?.user.lastName}
                            </h4>

                            <span className="text-xs text-gray-600">
                                {session?.user.email}
                            </span>
                        </div>
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export { Sidebar };
