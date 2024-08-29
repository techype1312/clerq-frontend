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
  DialogTitle,
} from "@/components/ui/dialog";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { IUcrm, IUCRMContext } from "@/types/ucrm";
import CompanyApis from "@/actions/data/company.data";
import { getAuthUcrmId, setAuthUcrmId } from "@/utils/session-manager.util";
import { Loader2Icon } from "lucide-react";
import ProfilePhotoPreview from "@/components/common/profile-photo/ProfilePhotoPreview";

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
  const [currentUcrm, setCurrentUcrm] = useState<IUcrm>();
  const [nextUcrm, setNextUcrm] = useState<IUcrm>();

  const onError = (err: string | ErrorProps) => {
    setError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const setUcrmCookie = (ucrmId: IUcrm["id"]) => {
    setAuthUcrmId(ucrmId);
  };

  const handleCurrentUcrm = (ucrmId: IUcrm["id"]) => {
    setCurrentUcrm(myCompanyMappings?.find((ucrm) => ucrm.id === ucrmId));
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
      handleCurrentUcrm(res?.id);
    }
    setNextUcrm(undefined);
    setLoading(false);
    setopenSwitchDialog(false);
    router.replace("/dashboard");
  };

  const fetchUcrm = async (ucrmId: IUcrm["id"]) => {
    setLoading(true);
    return CompanyApis.getUCRM(ucrmId).then(onFetchUCRMSuccess, onError);
  };

  const switchCompany = async (ucrmId: IUcrm["id"]) => {
    setNextUcrm(myCompanyMappings?.find((ucrm) => ucrm.id === ucrmId));
    setopenSwitchDialog(true);
    setLoading(true);
    return fetchUcrm(ucrmId);
  };

  const onFetchUCRMListSuccess = (res: any) => {
    if (res.data) {
      setMyCompanyMappings(res?.data);
    }
    setLoading(false);
  };

  const addNewCompanyMapping = (newUcrm: IUcrm) => {
    setMyCompanyMappings([...myCompanyMappings, newUcrm]);
    return switchCompany(newUcrm.id);
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
      const ucrmFound = myCompanyMappings?.find(
        (ucrm) => ucrm.id === ucrmFromCookie
      );
      if (ucrmFound) {
        handleCurrentUcrm(ucrmFromCookie);
      } else {
        handleCurrentUcrm(myCompanyMappings[0].id);
      }
    }
    if (!ucrmFromCookie) {
      handleCurrentUcrm(myCompanyMappings[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myCompanyMappings]);

  useEffect(() => {
    refreshUcrmList();
  }, [refreshUcrmList]);

  return (
    <CompanySessionContext.Provider
      value={{
        loading,
        error,
        currentUcrm,
        myCompanyMappings,
        addNewCompanyMapping,
        switchCompany,
      }}
    >
      {loading && !openSwitchDialog && (
        <div
          style={{
            height: "100%",
            width: "100%",
            zIndex: 999,
            position: "fixed",
            background: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Loader2Icon
            className="animate-spin absolute top-[50%] left-[50%] stroke-[#233ED6] z-[1000]"
            size={"48px"}
          />
        </div>
      )}
      {children}
      <SwitchUcrmDialog
        currentUcrm={currentUcrm}
        nextUcrm={nextUcrm}
        open={openSwitchDialog}
      />
    </CompanySessionContext.Provider>
  );
};

const SwitchUcrmDialog = ({
  currentUcrm,
  nextUcrm,
  open,
}: {
  currentUcrm?: IUcrm;
  nextUcrm?: IUcrm;
  open: boolean;
}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const openDialog = open && !!nextUcrm && !!currentUcrm;

  return (
    <Dialog open={openDialog}>
      <DialogContentWithoutClose className="sm:max-w-md flex flex-col items-center p-8">
        <DialogTitle className="hidden"></DialogTitle>
        <div className="relative h-16">
          <div
            className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${
              animate ? "icon1-animate" : ""
            }`}
          >
            <ProfilePhotoPreview
              firstName={currentUcrm?.company?.name?.split(" ")?.[0]}
              lastName={currentUcrm?.company?.name?.split(" ")?.[1]}
              photo={currentUcrm?.company?.logo}
              size={38}
            />
          </div>

          <div
            className={`absolute left-full top-1/2 transform -translate-y-1/2 transition-all duration-1000 ${
              animate ? "icon2-animate" : "hidden"
            }`}
          >
            <ProfilePhotoPreview
              firstName={nextUcrm?.company?.name?.split(" ")?.[0]}
              lastName={nextUcrm?.company?.name?.split(" ")?.[1]}
              photo={nextUcrm?.company?.logo}
              size={38}
            />
          </div>
        </div>
        <DialogDescription className="p-4 flex flex-col items-center">
          <span>{`Switching to...`}</span>
          <span className="font-bold text-black">
            {nextUcrm?.company?.name}
          </span>
        </DialogDescription>
      </DialogContentWithoutClose>
    </Dialog>
  );
};

// Hook to use the context
export const useCompanySessionContext = () => useContext(CompanySessionContext);
