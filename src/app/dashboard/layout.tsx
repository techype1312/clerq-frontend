"use client";
import { Inter as FontSans } from "next/font/google";
import Header from "@/components/generalComponents/Header";
import { usePathname } from "next/navigation";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showHeader = !pathname.startsWith("/auth") && pathname !== "/signin";
  return (
    <div>
      {showHeader && <Header />}
      {children}
    </div>
  );
}
