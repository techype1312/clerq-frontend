"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import { ErrorProps } from "@/types/general";
import { useCompanySessionContext } from "./CompanySession";
import { ICompany, ICompanyContext } from "@/types/company";
import { IImageFileType } from "@/types/file";
import CompanyApis from "@/actions/data/company.data";

export const CompanyContext = createContext<ICompanyContext>(
  {} as ICompanyContext
);

// Create a provider component
export const CompanyContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { currentUcrm } = useCompanySessionContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [companyData, setCompanyData] = useState<ICompany>();

  const onError = (err: string | ErrorProps) => {
    setError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onFetchCompanyDetailsSuccess = (res: any) => {
    if (res) {
      setCompanyData(res);
    }
    setLoading(false);
  };

  const fetchCompanyData = useCallback(async () => {
    if (loading || !currentUcrm?.company?.id) return false;
    setLoading(true);
    return CompanyApis.getCompany(currentUcrm?.company?.id).then(
      onFetchCompanyDetailsSuccess,
      onError
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUcrm?.company?.id]);

  const onUpdateCompanyDataSuccess = (res: any) => {
    if (res) {
      setCompanyData(res);
    }
    return res;
  };

  const updateCompanyData = async (payload: Record<string, any>) => {
    if (!currentUcrm?.company?.id) return false;
    return CompanyApis.updateCompany(currentUcrm?.company?.id, payload).then(
      onUpdateCompanyDataSuccess,
      onError
    );
  };

  const updateCompanyDetails = async (values: any) => {
    const payload: Record<string, any> = {};
    if (values.companyName) {
      payload.name = values.companyName;
    }
    if (values.phone) {
      payload.phone = values.phone;
    }
    if (values.country_code) {
      payload.country_code = values.country_code;
    }
    if (!isEmpty(payload)) {
      return updateCompanyData(payload);
    }
  };

  const updateCompanyLogo = async (logo: IImageFileType) => {
    return updateCompanyData({ logo });
  };

  const removeCompanyLogo = async () => {
    return updateCompanyData({ logo: {} });
  };

  useEffect(() => {
    if (companyData && companyData.id === currentUcrm?.company?.id) return;
    fetchCompanyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUcrm?.company?.id]);

  return (
    <CompanyContext.Provider
      value={{
        loading,
        error,
        companyData,
        setCompanyData,
        updateCompanyLogo,
        removeCompanyLogo,
        updateCompanyDetails,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

// Hook to use the context
export const useCompanyContext = () => useContext(CompanyContext);
