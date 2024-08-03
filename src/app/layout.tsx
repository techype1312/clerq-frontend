import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cn } from "@/utils/utils";
import { MainContextProvider } from "@/context/Main";
import 'react-material-symbols/rounded';
import { Toaster } from "@/components/ui/toaster";
import { HelpCenter } from "@/components/help";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Clerq",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <MainContextProvider>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          {children}
          <HelpCenter />
          <ToastContainer />
          <Toaster />
        </body>
      </MainContextProvider>
    </html>
  );
}
