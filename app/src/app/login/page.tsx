"use client";

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useAuth } from "./hooks/useAuth";

const formSchema = z.object({
  email_or_username: z.string({
    message: "Please enter a valid username or email address.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 5 characters.",
  }),
})

export default function Login() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email_or_username: "",
      password: "",
    },
  })

  const { login } = useAuth();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email_or_username, password } = values
    await login(email_or_username, password);
    router.push('/home')
  }

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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email_or_username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email or Username</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/forgot-password"
                          className="ml-auto inline-block text-sm"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input type="password" placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </Form>
            <div className="w-full">
              <p className="text-balance text-sm text-muted-foreground text-center">
                By signing up you agree to our <Link href={'/'} shallow className="text-primary hover:text-primary">terms</Link> and <Link href={'/'} shallow className="text-primary hover:text-primary">privacy</Link> policy.
              </p>
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