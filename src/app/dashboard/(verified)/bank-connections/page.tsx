"use client";
import React, { Fragment, lazy, Suspense, useEffect, useState } from "react";

import isObject from "lodash/isObject";
import BankingApis from "@/actions/apis/BankingApis";
import { useCompanySessionContext } from "@/context/CompanySession";
import { ErrorProps } from "@/types/general";
import BankConnectionsSkeleton from "@/components/skeletonLoading/dashboard/BankConnectionsSkeleton";
import Script from "next/script";

const BankConnections = lazy(() => import("./BankConnections"));

export default function Page() {
  const { currentUcrm } = useCompanySessionContext();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState<Record<string, any>[]>([]);

  const onError = (err: string | ErrorProps) => {
    setError(isObject(err) ? err.message : err);
    setLoading(false);
  };

  const onFetchAccountsSuccess = (res: any) => {
    if (res.data && res.data.length) {
      setBankAccounts(res.data);
    }
    setLoading(false);
  };

  const fetchBankAccounts = () => {
    if (!currentUcrm?.company?.id) return false;
    return BankingApis.getBankAccounts(currentUcrm?.company?.id).then(
      onFetchAccountsSuccess,
      onError
    );
  };

  useEffect(() => {
    fetchBankAccounts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUcrm?.company?.id]);

  return (
    <Fragment>
      <Script
        src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"
        strategy="beforeInteractive"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      />
      <div className="flex gap-24 flex-row justify-center">
        <div className="w-full lg:max-w-[950px]">
          <div className="flex flex-col gap-4">
            <h1 className="text-primary text-2xl font-medium max-md:hidden">
              Bank Accounts
            </h1>
            <div className="flex flex-col gap-2 mb-4 border-b border-[#F1F1F4]">
              <h6 className="text-primary">Linked bank accounts</h6>
              <p className="text-muted">
                Automatically extract all business transactions for bookkeeping.
              </p>
              <Suspense fallback={<BankConnectionsSkeleton />}>
                <BankConnections
                  bankAccounts={bankAccounts}
                  companyId={currentUcrm?.company?.id as string}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
