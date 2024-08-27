import { NewCompanyLayout } from "@/components/onboarding/NewCompanyLayout";
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
        <NewCompanyLayout>{children}</NewCompanyLayout>
      </CompanySessionProvider>
    </SkeletonTheme>
  );
}
