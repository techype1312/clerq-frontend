import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cn } from "@/utils/utils";
import { MainContextProvider } from "@/context/Main";
// import "react-material-symbols/rounded";
import { Toaster } from "@/components/ui/toaster";
import { UserContextProvider } from "@/context/User";
import "react-loading-skeleton/dist/skeleton.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Otto",
  description: "Simplified finances with Otto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <MainContextProvider>
        <UserContextProvider>
          <body
            className={cn(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.variable
            )}
          >
            {children}
            <ToastContainer />
            <Toaster />
          </body>
        </UserContextProvider>
      </MainContextProvider>
    </html>
  );
}
