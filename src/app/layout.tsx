import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/them-provider";
import { ModeToggle } from "@/components/ui/toogle-mode";

import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/trpc/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FooterSection } from "@/modules/landing/ui/sections/footer-section";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simply Vote",
  description: "SimplyVote est une plateforme de vote électronique pour les élections étudiantes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange

        >
          <ClerkProvider>
            <TRPCReactProvider>
              <TooltipProvider>

                <Toaster />
                {children}
                <FooterSection />
              </TooltipProvider>
            </TRPCReactProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
