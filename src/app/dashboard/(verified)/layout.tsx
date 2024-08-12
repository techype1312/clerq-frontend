import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { HelpCenter } from "@/components/help";
import { CompanySessionProvider } from "@/context/CompanySession";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CompanySessionProvider>
      <DashboardLayout>{children}</DashboardLayout>
      <HelpCenter />
    </CompanySessionProvider>
  );
}
