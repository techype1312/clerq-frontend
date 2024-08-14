"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import _ from "lodash";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CompanyApis from "@/actions/apis/CompanyApis";
import { ErrorProps } from "@/types/general";
import {
  Dialog,
  DialogContentWithoutClose,
  DialogDescription,
} from "@/components/ui/dialog";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openSwitchDialog, setopenSwitchDialog] = useState(false);
  const [selectedUcrm, setSelectedUcrm] = useState<string>();

  const onError = (err: string | ErrorProps) => {
    setError(_.isObject(err) ? err.message : err);
    setLoading(false);
  };

  const setUcrmCookie = (ucrmId: string) => {
    Cookies.set("otto_ucrm", ucrmId);
  };

  const handleUcrmSwitch = (ucrmId: string) => {
    setSelectedUcrm(ucrmId);
    setUcrmCookie(ucrmId);
  };

  const onFetchUCRMSuccess = (res: any) => {
    if (res.data) {
      handleUcrmSwitch(res?.data?.id);
      toast.success(`you've switched to ${res?.data?.company?.name}`, {
        delay: 500,
        pauseOnHover: false,
        autoClose: 3000,
        closeButton: false,
        position: "bottom-center",
        hideProgressBar: true,
        icon: <SymbolIcon icon="check_circle" size={24} color="#28BC97" />,
        style: {
          background: "black",
          color: "white",
        },
      });
    }
    setLoading(false);
    setopenSwitchDialog(false);
    router.refresh();
  };

  const fetchUcrm = (ucrmId: string) => {
    setLoading(true);
    CompanyApis.getUCRM(ucrmId).then(onFetchUCRMSuccess, onError);
  };

  const switchCompany = (ucrmId: string) => {
    setopenSwitchDialog(true);
    setLoading(true);
    fetchUcrm(ucrmId);
  };

  const onFetchUCRMListSuccess = (res: any) => {
    if (res.data) {
      setMyCompanyMappings(res?.data.data);
    }
    setLoading(false);
  };

  const refreshUcrmList = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    CompanyApis.getMyAllUCRMs().then(onFetchUCRMListSuccess, onError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const ucrmFromCookie = Cookies.get("otto_ucrm");
    if (!myCompanyMappings.length) return;
    if (ucrmFromCookie) {
      const currentUcrm = myCompanyMappings.find(
        (ucrm) => ucrm.id === ucrmFromCookie
      );
      if (currentUcrm) {
        handleUcrmSwitch(ucrmFromCookie);
      } else {
        handleUcrmSwitch(myCompanyMappings[0].id);
      }
    }
    if (!ucrmFromCookie) {
      handleUcrmSwitch(myCompanyMappings[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myCompanyMappings]);

  useEffect(() => {
    refreshUcrmList();
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
      <SwitchUcrmDialog
        nextUcrm={myCompanyMappings.find((ucrm) => ucrm.id === selectedUcrm)}
        open={loading && openSwitchDialog}
      />
    </CompanySessionContext.Provider>
  );
};

const SwitchUcrmDialog = ({
  nextUcrm,
  open,
}: {
  nextUcrm?: Record<string, any>;
  open: boolean;
}) => {
  if (!nextUcrm) return null;
  return (
    <Dialog open={open}>
      <DialogContentWithoutClose className="sm:max-w-lg">
        <DialogDescription className="p-12">{`Switching to ${nextUcrm?.company?.name} ...`}</DialogDescription>
      </DialogContentWithoutClose>
    </Dialog>
  );
};

// Hook to use the context
export const useCompanySession = () => useContext(CompanySessionContext);
