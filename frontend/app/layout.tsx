import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { appDetails } from "@/config/config";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import Provider from "@/providers/providers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: appDetails.title,
  description: appDetails.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Provider>
              <Navbar />
              <div className="min-h-screen flex flex-col">
                <main className="flex-grow">
                  {children}
                </main>
              </div>
              <Footer />
            </Provider>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </>
  );
}
