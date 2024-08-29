import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { HelpCenter } from "@/components/dashboard/help";
import { BankAccountsContextProvider } from "@/context/BankAccounts";
import { CompanyContextProvider } from "@/context/Company";
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
        <CompanyContextProvider>
          <BankAccountsContextProvider>
            <DashboardLayout>{children}</DashboardLayout>
            <HelpCenter />
          </BankAccountsContextProvider>
        </CompanyContextProvider>
      </CompanySessionProvider>
    </SkeletonTheme>
  );
}
