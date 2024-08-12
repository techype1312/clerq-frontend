"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import CompanyApis from "@/actions/apis/CompanyApis";
import { useRouter } from "next/navigation";

// Create a context
export const CompanySessionContext = createContext<any>(null);

// Create a provider component
export const CompanySessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [myCompanyMappings, setMyCompanyMappings] = useState<
    Record<string, any>[]
  >([]);
  const [selectedUcrm, setSelectedUcrm] = useState<string>();

  const switchCompany = (ucrmId: string) => {
    setSelectedUcrm(ucrmId);
    refreshUcrm(ucrmId);
  };

  const updateCompanyMappingsList = (ucrms: Record<string, any>[]) => {
    setMyCompanyMappings(ucrms);
  };

  const refreshUcrm = useCallback(async (ucrmId: string) => {
    const token = Cookies.get("token");
    if (token && ucrmId) {
      try {
        await CompanyApis.getUCRM(ucrmId).then((res) => {
          Cookies.set("otto_ucrm", res?.data?.id);
          router.refresh();
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [router]);

  const refreshUcrmList = useCallback(async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const res = await CompanyApis.getMyAllUCRMs();
        updateCompanyMappingsList(res?.data.data);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    const ucrmFromCookie = Cookies.get("otto_ucrm");
    if (!myCompanyMappings.length) return;
    if (token && ucrmFromCookie) {
      const currentUcrm = myCompanyMappings.find(
        (ucrm) => ucrm.id === ucrmFromCookie
      );
      if (currentUcrm) {
        setSelectedUcrm(ucrmFromCookie);
        Cookies.set("otto_ucrm", ucrmFromCookie);
      } else {
        setSelectedUcrm(myCompanyMappings[0].id);
        Cookies.set("otto_ucrm", myCompanyMappings[0].id);
      }
    }
    if (token && !ucrmFromCookie) {
      setSelectedUcrm(myCompanyMappings[0].id);
      Cookies.set("otto_ucrm", myCompanyMappings[0].id);
    }
  }, [myCompanyMappings]);

  useEffect(() => {
    refreshUcrmList()
  }, [refreshUcrmList]);

  return (
    <CompanySessionContext.Provider
      value={{
        myCompanyMappings,
        currentUcrm: myCompanyMappings.find((ucrm) => ucrm.id === selectedUcrm),
        switchCompany,
      }}
    >
      {children}
    </CompanySessionContext.Provider>
  );
};

// Hook to use the context
export const useCompanySession = () => useContext(CompanySessionContext);
