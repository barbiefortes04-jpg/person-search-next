import type { Metadata } from "next";
import { Geist, Azeret_Mono as Geist_Mono } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Person Search App - OAuth Secured",
  description: "A secure person search app with Google OAuth authentication",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // const session = null; // Disabled temporarily

  return (
    <html lang="en" suppressHydrationWarning={true}>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
    >          

<ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >

        <Navbar session={session} />
        <main className="flex-grow">
          {children}
        </main>
        <Toaster />

        <Footer />
        </ThemeProvider>

    </body>

  </html>  );
}

