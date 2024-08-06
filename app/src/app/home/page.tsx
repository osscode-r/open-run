"use client"
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from './components/sidebar'
import Header from './components/header'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useAuth } from '../login/hooks/useAuth'

interface BreadcrumbItem {
    href: string;
    label: string;
}

const DashboardLayout = ({ children }: React.PropsWithChildren) => {
    const pathname = usePathname()
    const router = useRouter()
    const { isAuthenticated } = useAuth();
    const getBreadcrumbs = (): BreadcrumbItem[] => {
        const asPathNestedRoutes = pathname.split("/").filter(v => v.length > 0)

        const crumblist = asPathNestedRoutes.map((subpath, idx) => {
            const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/")
            return { href, label: subpath.charAt(0).toUpperCase() + subpath.slice(1) }
        })

        return [{ href: "/home", label: "Dashboard" }, ...crumblist]
    }

    const breadcrumbs = getBreadcrumbs()
    // if(!isAuthenticated) {
    //     router.push('/login')
    //     return <div className="flex h-screen w-full items-center justify-center">Please login to continue</div>
    // }
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Sidebar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <Header />
                <main className="flex-1 p-4 sm:px-6 sm:py-10 container">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout