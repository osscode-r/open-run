import React from 'react'
import Link from "next/link"
import {
    Package2,
    Home,
    Settings,
    LucideIcon,
    Clock,
    Folder,
    Server,
    Package,
} from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/ui/tooltip"

const NavItem = ({ href, icon: Icon, label }: { href: string, icon: LucideIcon, label: string }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Link
                href={href}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{label}</span>
            </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
)

const Sidebar = () => {
    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Link
                    href="#"
                    className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                    <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                    <span className="sr-only">Acme Inc</span>
                </Link>
                <TooltipProvider>
                    <NavItem href="/home" icon={Home} label="Dashboard" />
                    <NavItem href="/cron-jobs" icon={Clock} label="Cron Jobs" />
                    <NavItem href="/general" icon={Package} label="General" />
                    <NavItem href="/file-manager" icon={Folder} label="File Manager" />
                    <NavItem href="/load-balancers" icon={Server} label="Load Balancers" />
                </TooltipProvider>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                <TooltipProvider>
                    <NavItem href="#" icon={Settings} label="Settings" />
                </TooltipProvider>
            </nav>
        </aside>
    )
}

export default Sidebar