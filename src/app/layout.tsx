import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/navbar";
import "./globals.css";

import { EventProvider } from "@/lib/event-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DIU Event Hub",
  description:
    "Event Management Platform for Daffodil International University",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <EventProvider>
              <main className="min-h-screen mx-auto max-w-[1400px] w-full">
                {children}
              </main>
              <Toaster />
            </EventProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
