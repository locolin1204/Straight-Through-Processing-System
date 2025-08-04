import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/app/util/font";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, } from "@/components/ui/sidebar"
import SideBar from "@/components/layout/side-bar";
import { DateProvider } from "@/contexts/date-context";
import { Toaster } from "sonner";

export const metadata: Metadata = {
    title: "STP Trade System",
    description: "Straight Through Processing Trade System",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className={`${inter.variable} antialiased`}>
        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <DateProvider>
            <SidebarProvider>
                <SideBar />
                <main className="h-screen w-full">
                    {children}
                </main>
                <Toaster richColors />
            </SidebarProvider>
            </DateProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
