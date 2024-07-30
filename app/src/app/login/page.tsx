"use client";
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex h-full flex-col items-center justify-between p-6 gap-10">
        <div className="flex w-full items-center justify-between">
          <Button variant={"link"} className="no-underline hover:no-underline text-foreground">
            <Link href={'/'} shallow className="flex justify-center items-center space-x-2 leading-normal tracking-wide" target="_blank">
              <Image src="/next.svg" alt="logo" width={150} height={80} />
            </Link>
          </Button>
          <Button variant={"link"} className="no-underline hover:no-underline text-foreground">
            <Link href={'/docs'} shallow className="flex justify-center items-center space-x-2 leading-normal tracking-wide" target="_blank">
              <BookOpen size={16} />
              <span>Documentation</span>
            </Link>
          </Button>
        </div>

        <div className="flex h-full max-w-sm items-center justify-center">
          <div className="mx-auto grid max-w-full w-[350px] gap-10 ">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Welcome</h1>
              <p className="text-balance text-muted-foreground">
                Login using email
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" placeholder="Password" required />
              </div>
              <Button type="submit" className="w-full" onClick={() => router.push('/home')}>
                Login
              </Button>
              <div className="w-full">
                <p className="text-balance text-sm text-muted-foreground text-center">
                  By signing up you agree to our <Link href={'/'} shallow className="text-primary hover:text-primary">terms</Link> and <Link href={'/'} shallow className="text-primary hover:text-primary">privacy</Link> policy.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-between">
          <p className="text-balance text-md text-muted-foreground text-center mx-auto">
            Having login issues? <Link href={'/'} shallow className="text-primary hover:text-primary">Email us</Link> or <Link href={'/'} shallow className="text-primary hover:text-primary">ask us in Discord</Link>
          </p>
        </div>
      </div>
      <div className="h-full bg-muted py-24 px-10">
        <div className="flex h-full items-center justify-center">
          <div className="mx-auto grid max-w-full gap-5 text-center">
            <h1 className="text-3xl font-bold">Open Run is redefining the admin panels for modern developers.</h1>
            <p className="text-balance text-muted-foreground">
              Raghav, the creator of open run
            </p>
          </div>
        </div>
        <div className="flex flex-col w-full items-center justify-between gap-5">
          <p className="text-balance text-lg text-muted-foreground text-center mx-auto">
            Trusted by developers at
          </p>
          <div className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-3 text-charcoal-500 xl:justify-between xl:gap-0">
            <Link href={'/'} shallow className="flex justify-center items-center space-x-2 leading-normal tracking-wide" target="_blank">
              <Image src="/next.svg" alt="logo" className="opacity-20" width={150} height={80} />
            </Link>
            <Link href={'/'} shallow className="flex justify-center items-center space-x-2 leading-normal tracking-wide" target="_blank">
              <Image src="/next.svg" alt="logo" className="opacity-20" width={150} height={80} />
            </Link>
            <Link href={'/'} shallow className="flex justify-center items-center space-x-2 leading-normal tracking-wide" target="_blank">
              <Image src="/next.svg" alt="logo" className="opacity-20" width={150} height={80} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
