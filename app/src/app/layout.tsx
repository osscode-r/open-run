"use client"

import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider';
import { Provider } from "react-redux";
import { store } from '@/redux/store';
import { Toaster } from "@/components/ui/toaster"

const Source_Sans_Pro = Source_Sans_3({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${Source_Sans_Pro.className} flex flex-col min-h-screen bg-background text-foreground`}>
        <Provider store={store}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <main className="flex-grow">
              {children}
            </main>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
