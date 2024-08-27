import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { HelpCenter } from "@/components/dashboard/help";
import { CompanySessionProvider } from "@/context/CompanySession";
import { SkeletonTheme } from "react-loading-skeleton";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SkeletonTheme highlightColor="#d3d3d3">
      <CompanySessionProvider>
        <DashboardLayout>{children}</DashboardLayout>
        <HelpCenter />
      </CompanySessionProvider>
    </SkeletonTheme>
  );
}
