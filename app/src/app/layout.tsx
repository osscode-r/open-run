"use client"

import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider';
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/toaster"
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";

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
          <PersistGate loading={null} persistor={persistor}>
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
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
