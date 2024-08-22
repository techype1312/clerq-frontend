"use client";

import React, { useEffect, useState } from "react";
import isObject from "lodash/isObject";
import { Loader2Icon } from "lucide-react";
import BankingApis from "@/actions/apis/BankingApis";
import AccountsTable from "@/components/dashboard/bankAccounts/AccountsTable";
import { useCompanySessionContext } from "@/context/CompanySession";
import { ErrorProps } from "@/types/general";
import { useMainContext } from "@/context/Main";

const Page = () => {
  const { currentUcrm } = useCompanySessionContext();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    if (loading || !currentUcrm?.company?.id) return false;
    setLoading(true);
    return BankingApis.getBankAccounts(currentUcrm?.company?.id).then(
      onFetchAccountsSuccess,
      onError
    );
  };

  useEffect(() => {
    fetchBankAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUcrm?.company?.id]);

  const {windowWidth} = useMainContext();

  return (
    <div className="flex gap-24 flex-row justify-center">
      <div className="w-full lg:max-w-[950px]">
        <div className="flex flex-col gap-4">
        {windowWidth > 767 && (
          <h1 className="text-primary text-2xl font-medium">Bank Accounts</h1>
          )}
          <div className="flex flex-col gap-2 mb-4 border-b border-[#F1F1F4]">
            <h6 className="text-primary">Linked bank accounts</h6>
            <p className="text-muted">
              Automatically extract all business transactions for bookkeeping.
            </p>
            {loading ? (
              <div className="w-full flex items-center h-12 justify-center">
                <Loader2Icon className="animate-spin" />
              </div>
            ) : (
              <AccountsTable
                accounts={bankAccounts}
                companyId={currentUcrm?.company?.id as string}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
