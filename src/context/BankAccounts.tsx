"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import isObject from "lodash/isObject";
import { ErrorProps } from "@/types/general";
import { useCompanySessionContext } from "./CompanySession";
import BankingApis from "@/actions/data/banking.data";

export const BankAccountsContext = createContext<any>({} as any);

export const BankAccountsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { currentUcrm, permissions } = useCompanySessionContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bankAccountsData, setBankAccountsData] = useState<any>();
  const onError = (err: string | ErrorProps) => {
    setError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onFetchBankAccountsSuccess = (res: any) => {
    if (res) {
      setBankAccountsData(res);
    }
    setLoading(false);
  };

  const fetchBankAccounts = useCallback(async () => {
    if (!currentUcrm?.company?.id) return false;
    setLoading(true);
    return BankingApis.getBankAccounts(currentUcrm?.company?.id).then(
      onFetchBankAccountsSuccess,
      onError
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUcrm?.company?.id]);

  useEffect(() => {
    if (currentUcrm?.company?.id && permissions?.finance?.viewFinance) {
      fetchBankAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUcrm?.company?.id]);

  const refreshBankAccounts = async() => {
    if(!currentUcrm?.company?.id) return false;
    setLoading(true);
    return BankingApis.getBankAccounts(currentUcrm?.company?.id).then(
      onFetchBankAccountsSuccess,
      onError
    );
  }

  return (
    <BankAccountsContext.Provider
      value={{
        loading,
        error,
        bankAccountsData,
        setBankAccountsData,
        fetchBankAccounts,
        refreshBankAccounts
      }}
    >
      {children}
    </BankAccountsContext.Provider>
  );
};

// Hook to use the context
export const useBankAccountsContext = () => useContext(BankAccountsContext);
