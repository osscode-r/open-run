import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, CircleCheckBig, Rocket } from "lucide-react"

export default function Documentation() {
    return (
        <div className="container">
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-full mx-auto py-24">
                    <div className="text-center space-y-10">
                        <div className="w-full h-auto">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-6xl px-4">
                                Why should you self-host<span className="text-yellow-500">?</span>
                            </h1>
                            <h2 className="text-base pb-10 pt-2 text-neutral-400 px-4">You will be cool.</h2>
                            <div className="pb-2 flex justify-center text-center gap-8 px-4">
                                <Button variant={'secondary'} size={'lg'} className="text-xl py-6 px-10">
                                    <Link href="/docs" shallow className="flex justify-center items-center gap-2">
                                        <Rocket />
                                        <span>Get Started</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2 pt-10">
                            <div className="tracking-tight text-white font-mono bg-secondary p-4 rounded text-xs md:text-sm text-left w-fit space-y-1 mx-auto">
                                <div className="select-none text-neutral-400 font-bold pr-2 pb-4">
                                    # The self-hosted version is ready on your server in under a minute - <span className="text-warning/90">always free, with all functionalities</span>.
                                </div>
                                <div>
                                    <span className="select-none text-neutral-500 font-extrabold pr-2">&gt;</span>
                                    curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-auto">
                            <h3 className="text-xl font-bold tracking-tight text-white md:text-3xl pt-10 px-4">
                                Self-hosting in general<span className="text-warning">.</span>
                            </h3>
                            <h4 className="text-base pb-2 pt-2 text-neutral-400 px-4">There are plenty of benefits.</h4>
                            <div className="mt-10 max-w-3xl mx-auto px-2">
                                <ul role="list" className="mt-8 space-y-8 text-neutral-400 text-left">
                                    <li className="flex items-start gap-x-3">
                                        <CircleCheckBig className="text-yellow-500" style={{ minWidth: '2rem', minHeight: '2rem' }} />
                                        <span className="flex-1">
                                            <strong className="font-bold text-yellow-500">No Hidden Costs.</strong> Cloud providers can become costly once you surpass the free tier. Once you go beyond the free tier, expenses can accumulate rapidly. There are plenty of <a className="underline text-white" href="https://serverlesshorrors.com/?utm_source=coolify.io" target="_blank">horror stories</a>.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-x-3">
                                        <CircleCheckBig className="text-yellow-500" style={{ minWidth: '2rem', minHeight: '2rem' }} />
                                        <span className="flex-1">
                                            <strong className="font-bold text-yellow-500">Cost Efficient.</strong> You get way more resources for your money and you can save a lot (thousands of $) every month, like <a className="underline text-white" href="https://twitter.com/heyandras/status/1742078215986860460" target="_blank">this</a> and <a className="underline text-white" href="https://twitter.com/heyandras/status/1752209429276086688" target="_blank">this</a> and <a className="underline text-white" href="https://twitter.com/heyandras/status/1724510876256944244" target="_blank">this</a>.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-x-3">
                                        <CircleCheckBig className="text-yellow-500" style={{ minWidth: '2rem', minHeight: '2rem' }} />
                                        <span className="flex-1">
                                            <strong className="font-bold text-yellow-500">Easier Than You Think.</strong> Servers (hardware + software) have changed a lot since cloud providers emerged. And with software (like <a href="/" className="text-white underline">Coolify</a>), you can start hosting in minutes without any maintenance work.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-x-3">
                                        <CircleCheckBig className="text-yellow-500" style={{ minWidth: '2rem', minHeight: '2rem' }} />
                                        <span className="flex-1">
                                            <strong className="font-bold text-yellow-500">Data Privacy.</strong> Currently, data privacy is a major issue. By self-hosting, you have complete control over your data and can guarantee that it is not being misused.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="w-full h-auto">
                            <h3 className="text-xl font-bold tracking-tight text-white md:text-3xl pt-10 px-4">
                                Self-hosting with Coolify<span className="text-warning">.</span>
                            </h3>
                            <h4 className="text-base pb-2 pt-2 text-neutral-400 px-4">Even more benefits.</h4>
                            <div className="mt-10 max-w-3xl mx-auto px-2">
                                <ul role="list" className="mt-8 space-y-8 text-neutral-400 text-left">
                                    <li className="flex items-start gap-x-3">
                                        <CircleCheckBig className="text-yellow-500" style={{ minWidth: '2rem', minHeight: '2rem' }} />
                                        <span className="flex-1">
                                            <strong className="font-bold text-yellow-500">No Features Behind Paywall.</strong> Everything is included in the open-source software (OSS) version. And will always be.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-x-3">
                                        <CircleCheckBig className="text-yellow-500" style={{ minWidth: '2rem', minHeight: '2rem' }} />
                                        <span className="flex-1">
                                            <strong className="font-bold text-yellow-500">No Limitations.</strong> You have the freedom to host an unlimited number of websites on any quantity of servers without any restrictions.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-x-3">
                                        <CircleCheckBig className="text-yellow-500" style={{ minWidth: '2rem', minHeight: '2rem' }} />
                                        <span className="flex-1">
                                            <strong className="font-bold text-yellow-500">Nice UI.</strong> You get a simple and easy to use UI to manage your servers and applications.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-x-3">
                                        <CircleCheckBig className="text-yellow-500" style={{ minWidth: '2rem', minHeight: '2rem' }} />
                                        <span className="flex-1">
                                            <strong className="font-bold text-yellow-500">Open Source.</strong> You can see the source code and contribute to it, if you want. You can shape the future of the software.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
