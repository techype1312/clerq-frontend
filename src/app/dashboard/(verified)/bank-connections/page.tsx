"use client";

import React, { Fragment, lazy, Suspense, useEffect, useState } from "react";
import isObject from "lodash/isObject";
import { useCompanySessionContext } from "@/context/CompanySession";
import { ErrorProps } from "@/types/general";
import Script from "next/script";
import BankingApis from "@/actions/data/banking.data";
import BankConnectionsSkeleton from "@/components/skeletons/dashboard/BankConnectionsSkeleton";
import ConnectAccount from "@/components/dashboard/bankAccounts/ConnectAccount";
import { useBankAccountsContext } from "@/context/BankAccounts";

const BankConnections = lazy(() => import("./BankConnections"));

export default function Page() {
  const { currentUcrm } = useCompanySessionContext();
  const { bankAccountsData } = useBankAccountsContext();

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
                  bankAccounts={bankAccountsData}
                  companyId={currentUcrm?.company?.id as string}
                />
              </Suspense>
              <ConnectAccount companyId={currentUcrm?.company?.id as string} />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
