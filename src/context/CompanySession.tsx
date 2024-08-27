"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import isObject from "lodash/isObject";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ErrorProps } from "@/types/general";
import {
  Dialog,
  DialogContentWithoutClose,
  DialogDescription,
} from "@/components/ui/dialog";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { IUcrm, IUCRMContext } from "@/types/ucrm";
import CompanyApis from "@/actions/data/company.data";
import { getAuthUcrmId, setAuthUcrmId } from "@/utils/session-manager.util";

// Create a context
export const CompanySessionContext = createContext<IUCRMContext>(
  {} as IUCRMContext
);

// Create a provider component
export const CompanySessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [myCompanyMappings, setMyCompanyMappings] = useState<IUcrm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openSwitchDialog, setopenSwitchDialog] = useState(false);
  const [selectedUcrm, setSelectedUcrm] = useState<IUcrm["id"]>();
  const [currentUcrm, setCurrentUcrm] = useState<IUcrm>();

  const onError = (err: string | ErrorProps) => {
    setError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const setUcrmCookie = (ucrmId: IUcrm["id"]) => {
    setAuthUcrmId(ucrmId);
  };

  const handleUcrmSwitch = (ucrmId: IUcrm["id"]) => {
    setSelectedUcrm(ucrmId);
    setUcrmCookie(ucrmId);
  };

  const onFetchUCRMSuccess = (res: any) => {
    if (res) {
      toast.success(`you've switched to ${res?.company?.name}`, {
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

  const fetchUcrm = async (ucrmId: IUcrm["id"]) => {
    setLoading(true);
    return CompanyApis.getUCRM(ucrmId).then(onFetchUCRMSuccess, onError);
  };

  const switchCompany = async (ucrmId: IUcrm["id"]) => {
    handleUcrmSwitch(ucrmId);
    setopenSwitchDialog(true);
    setLoading(true);
    return fetchUcrm(ucrmId);
  };

  const onFetchUCRMListSuccess = (res: { data: IUcrm[] }) => {
    if (res.data) {
      setMyCompanyMappings(res?.data);
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
    const ucrmFromCookie = getAuthUcrmId();
    if (!myCompanyMappings?.length) return;
    if (ucrmFromCookie) {
      const currentUcrm = myCompanyMappings?.find(
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

  useEffect(() => {
    setCurrentUcrm(myCompanyMappings?.find((ucrm) => ucrm.id === selectedUcrm));
  }, [myCompanyMappings, selectedUcrm]);

  return (
    <CompanySessionContext.Provider
      value={{
        loading,
        error,
        myCompanyMappings,
        currentUcrm,
        switchCompany,
      }}
    >
      {children}
      <SwitchUcrmDialog
        nextUcrm={myCompanyMappings?.find((ucrm) => ucrm.id === selectedUcrm)}
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
export const useCompanySessionContext = () => useContext(CompanySessionContext);
