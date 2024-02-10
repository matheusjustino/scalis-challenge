'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HandCoins, Home } from 'lucide-react';

// COMPONENTS
import { Sidebar } from './sidebar';
import { SidebarItem } from './sidebar-item';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const pathname = usePathname();
    const sidebarItems = useMemo(() => {
        return [
            {
                icon: <Home />,
                text: 'Home',
                active: pathname === '/dashboard',
                href: '/dashboard',
            },
            {
                icon: <HandCoins />,
                text: 'New Bank Acc',
                active: pathname === '/account/new',
                href: '/account/new',
            },
        ];
    }, [pathname]);

    return (
        <div className="flex">
            <Sidebar>
                {sidebarItems.map((item) => (
                    <Link href={item.href} key={item.text}>
                        <SidebarItem
                            icon={item.icon}
                            text={item.text}
                            active={item.active}
                        />
                    </Link>
                ))}
            </Sidebar>

            <div className="p-2 w-full h-screen">{children}</div>
        </div>
    );
};

export { Layout };
