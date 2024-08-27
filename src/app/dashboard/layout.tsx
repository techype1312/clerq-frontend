"use client";
import { Inter as FontSans } from "next/font/google";
import Header from "@/components/common/Header";
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
  const showHeader =
    !pathname.startsWith("/auth") &&
    pathname !== "/dashboard/verify-user" &&
    !pathname.startsWith("/dashboard");
  return (
    <div>
      {showHeader && <Header />}
      {children}
    </div>
  );
}
