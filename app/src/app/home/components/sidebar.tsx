import React, { useState } from 'react';
import Link from 'next/link';
import {
    Package2,
    Home,
    Settings,
    LucideIcon,
    Clock,
    Folder,
    Server,
    Package,
} from 'lucide-react';

interface NavItemProps {
    href: string;
    icon: LucideIcon;
    label: string;
    expanded: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, expanded }) => (
    <Link
        href={href}
        className={`flex h-10 items-center rounded-lg text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground ${expanded ? 'px-3 w-full' : 'w-10 justify-center'
            }`}
    >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span
            className={`ml-3 overflow-hidden transition-all duration-200 ${expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
                }`}
        >
            {label}
        </span>
    </Link>
);

const Sidebar: React.FC = () => {
    const [expanded, setExpanded] = useState(false);

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-10 flex flex-col border-r bg-background transition-all duration-300 ease-in-out ${expanded ? 'w-60' : 'w-14'
                }`}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            <div className="flex h-14 items-center justify-center px-3 py-2">
                <Link
                    href="#"
                    className="flex h-10 items-center gap-2 rounded-lg bg-primary px-3 text-primary-foreground"
                >
                    <Package2 className="h-5 w-5 flex-shrink-0" />
                    <span
                        className={`overflow-hidden transition-all duration-200 ${expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
                            }`}
                    >
                        Acme Inc
                    </span>
                </Link>
            </div>
            <nav className="flex flex-col gap-1 px-2 py-4">
                <NavItem href="/home" icon={Home} label="Dashboard" expanded={expanded} />
                <NavItem href="/cron-jobs" icon={Clock} label="Cron Jobs" expanded={expanded} />
                <NavItem href="/general" icon={Package} label="General" expanded={expanded} />
                <NavItem href="/file-manager" icon={Folder} label="File Manager" expanded={expanded} />
                <NavItem href="/load-balancers" icon={Server} label="Load Balancers" expanded={expanded} />
            </nav>
            <nav className="mt-auto flex flex-col gap-1 px-2 py-4">
                <NavItem href="#" icon={Settings} label="Settings" expanded={expanded} />
            </nav>
        </aside>
    );
};

export default Sidebar;
