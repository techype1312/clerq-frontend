"use client";
import React, { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ErrorProps } from "@/types/general";
import isObject from "lodash/isObject";
import BankingApis from "@/actions/data/banking.data";
import { useUserContext } from "@/context/User";
import CompanyApis from "@/actions/data/company.data";
import { setAuthOnboardingStatus } from "@/utils/session-manager.util";
import { useCompanySessionContext } from "@/context/CompanySession";

const Step4 = ({
  userData,
}: {
  changeStep: (step: number) => void;
  userData: any;
  step: number;
}) => {
  const { updateUserData } = useUserContext();
  const {fetchCurrentUcrm} = useCompanySessionContext();
  const router = useRouter();
  const [linkToken, setLinkToken] = useState<string>("");
  const [companyId, setCompanyId] = useState<string>("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const config: PlaidLinkOptions = {
    onSuccess: (public_token, metadata) => {
      BankingApis.exchangePublicToken({
        publicToken: public_token,
        company: {
          id: companyId,
        },
      }).then((res) => {
        setAuthOnboardingStatus(true);
        updateUserData(
          {
            onboarding_completed: true,
          },
          true
        );
        fetchCurrentUcrm(companyId)
        router.push("/dashboard");
        return true;
      });
    },
    onExit: (err, metadata) => {
      toast.info("Banking connection failed");
    },
    onEvent: (eventName, metadata) => {},
    token: linkToken,
  };

  const { open, exit, ready } = usePlaidLink(config);

  const onFetchLinkTokenSuccess = (res: any) => {
    if (res) {
      setLinkToken(res.link_token);
    }
    setLoading(false);
  };

  const generateLinkToken = () => {
    if (!companyId || linkToken) return false;
    setLoading(true);
    setServerError("");
    return BankingApis.generateLinkToken({ companyId }).then(
      onFetchLinkTokenSuccess,
      onError
    );
  };

  const onFetchCompaniesSuccess = (res: any) => {
    if (res) {
      setCompanyId(res.data[0]?.id);
    }
    setLoading(false);
  };

  const fetchMyCompanies = () => {
    if (!userData?.id || companyId) return false;
    setLoading(true);
    setServerError("");
    return CompanyApis.getAllCompanies().then(onFetchCompaniesSuccess, onError);
  };

  useEffect(() => {
    fetchMyCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id, companyId]);

  useEffect(() => {
    generateLinkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, linkToken]);

  return (
    <>
      <Card
        onClick={() => {
          open();
        }}
        className={`${
          !linkToken ? "cursor-wait" : "cursor-pointer"
        } flex flex-col md:flex-row items-center md:items-start py-8 px-4 md:p-8 gap-2 bg-[#FAFBFD] border-none`}
      >
        <div className="my-auto">
          <Image
            src="/otto_plaid.png"
            alt="Plaid & Otto"
            width={102}
            height={64}
          />
        </div>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl font-normal text-primary">
            Connect with Plaid
          </CardTitle>
          <CardDescription className="text-sm md:text-base font-normal text-label">
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
      </Card>
    </>
  );
};

export default Step4;
