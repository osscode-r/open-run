import React from 'react'
import Image from "next/image"
import Link from "next/link"
import {
    Search,
    PanelLeft,
    Home,
    ShoppingCart,
    Package,
    Users2,
    LineChart,
    Package2,
    LucideIcon,
    BookOpen
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from '@/components/ui/mode-toggle'
import { useAuth } from '@/app/login/hooks/useAuth'

interface MobileNavItemProps {
    href: string;
    icon: LucideIcon;
    label: string;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ href, icon: Icon, label }) => (
    <Link
        href={href}
        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
    >
        <Icon className="h-5 w-5" />
        {label}
    </Link>
)


const Header = () => {
    const { logout } = useAuth();

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            href="#"
                            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                        >
                            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        <MobileNavItem href="#" icon={Home} label="Dashboard" />
                        <MobileNavItem href="#" icon={ShoppingCart} label="Orders" />
                        <MobileNavItem href="#" icon={Package} label="Products" />
                        <MobileNavItem href="#" icon={Users2} label="Customers" />
                        <MobileNavItem href="#" icon={LineChart} label="Analytics" />
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
            </div>
            <Button variant={"link"} className="no-underline hover:no-underline text-foreground">
                <Link href={'/docs'} shallow className="flex justify-center items-center space-x-2 leading-normal tracking-wide" target="_blank">
                    <BookOpen size={16} />
                    <span>Documentation</span>
                </Link>
            </Button>
            <ModeToggle />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="overflow-hidden rounded-full"
                    >
                        <Image
                            src="/placeholder-user.jpg"
                            width={36}
                            height={36}
                            alt="Avatar"
                            className="overflow-hidden rounded-full"
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}

export default Header