import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
