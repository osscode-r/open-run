import { useAppSelector } from "@/redux/hooks";
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Separator } from "./separator";

function Footer() {
    return (
        <div className="w-full bg-secondary">
            <Separator />
            <div className="container mx-auto">
                <footer className="p-6 py-20">
                    <div className=" mx-auto space-y-5 ">
                        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-3">
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-3">
                            <div className="flex flex-col space-y-4">
                                <div className="flex flex-col space-y-3 text-md "></div>
                            </div>
                            <div className="flex flex-col space-y-4">
                                <div className="flex flex-col space-y-3 text-md "></div>
                            </div>
                            <div className="flex flex-col space-y-4 mt-5">
                                <div className="flex flex-col">
                                    <div className="flex flex-row">
                                        <SocialLinks />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center px-6 pt-12 text-sm mb-5">
                        <LegalLinks />
                    </div>
                    <div className="flex items-center justify-center px-6 text-sm">
                        <p className="text-center text-muted-foreground"><small>Version: 1.02 | Updated on 25 July 2024</small></p>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default Footer;

const LinkSection = ({
    title,
    links,
    isSubscribed,
    userUrl
}: {
    title: string;
    links: { href: string; text: string }[];
    isSubscribed: boolean;
    userUrl?: string;
}) => (
    <div className="flex flex-col space-y-4">
        <h2 className="font-semibold text-xl">{title}</h2>
        <div className="flex flex-col space-y-3 text-md ">
            {links.map((link: { href: string; text: string }, index: number) => (
                <Link
                    key={index}
                    rel="noopener noreferrer"
                    href={link.text === "Create your profile" && userUrl ? "/" + userUrl : link.href}
                    className="text-muted-foreground hover:text-foreground"
                >
                    {link.text}
                </Link>
            ))}
        </div>
    </div>
);

const Navigation = ({ isSubscribed, userUrl }: { isSubscribed: boolean; userUrl?: string }) => (
    <>
        {sections.map((section, index) => (
            <LinkSection key={index} title={section.title} links={section.links} isSubscribed={isSubscribed} userUrl={userUrl} />
        ))}
    </>
);

const SocialLinks = () => (
    <div className="flex space-x-10">
        <Link
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
            href="https://www.facebook.com/shaaledotcom?_rdr"
            target="_blank"
        >
            <Facebook size={28} />
        </Link>
        <Link
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
            href="https://twitter.com/shaaledotcom?_rdr"
            target="_blank"
        >
            <Twitter size={28} />
        </Link>
        <Link
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
            href="https://www.instagram.com/shaaledotcom"
            target="_blank"
        >
            <Instagram size={28} />
        </Link>
        <Link
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
            href="https://www.youtube.com/shaaledotcom"
            target="_blank"
        >
            <Youtube size={28} />
        </Link>
    </div>
);

const LegalLinks = () => (
    <div className="flex text-muted-foreground ">
        <Link href="/faqs" className="mx-3 hover:text-foreground">
            FAQs
        </Link>
        |
        <Link href="/terms-of-service" className="mx-3 hover:text-foreground">
            Terms of Service
        </Link>
        |
        <Link href="/privacy-policy" className="mx-3 hover:text-foreground">
            Privacy Policy
        </Link>
        |
        <Link href="/refund-policy" className="mx-3 hover:text-foreground">
            Refund Policy
        </Link>
        |
        <Link href="/contact-us" className="mx-3 hover:text-foreground">
            Contact us
        </Link>
    </div>
);

const sections = [
    {
        title: "Company",
        links: [
            { href: "/about-us", text: "About us" },
            { href: "/about-us", text: "Join us" },
        ],
    },
    {
        title: "Artists",
        links: [
            { href: "/getstarted/create", text: "Create your profile" },
        ],
    },
    {
        title: "Community",
        links: [
            { href: "/subscribe", text: "Subscribe" },
            { href: "/build-with-us", text: "Build with us" },
            { href: "/subscribe", text: "Gift a subscription" },
            { href: "https://mail.google.com/mail/?view=cm&fs=1&to=support@shaale.com", text: "Support" },
        ],
    },
];