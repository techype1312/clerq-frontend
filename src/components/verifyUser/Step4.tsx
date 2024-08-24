"use client";
import React, { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import BankingApis from "@/actions/apis/BankingApis";
import CompanyApis from "@/actions/apis/CompanyApis";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import AuthApis from "@/actions/apis/AuthApis";

const Step4 = ({
  changeStep,
  userData,
  step,
}: {
  changeStep: (step: number) => void;
  userData: any;
  step: number;
}) => {
  const router = useRouter();
  const [linkToken, setLinkToken] = useState<string>("");
  const [companyId, setCompanyId] = useState<string>("");
  const config: PlaidLinkOptions = {
    onSuccess: (public_token, metadata) => {
      BankingApis.exchangePublicToken(
        JSON.stringify({
          publicToken: public_token,
          company: {
            id: companyId,
          },
        })
      ).then((res) => {
        Cookies.set("onboarding_completed", "true");
        // This will update the user as verified
        AuthApis.updateUser({
          onboarding_completed: true,
        });
        router.push("/dashboard");
      });
    },
    onExit: (err, metadata) => {
      // changeStep(step );
      toast.info("Banking connection failed");
    },
    onEvent: (eventName, metadata) => {},
    token: linkToken,
  };
  const { open, exit, ready } = usePlaidLink(config);

  useEffect(() => {
    if (userData?.id && !companyId) {
      const fetchCompanyData = async () => {
        const res = await CompanyApis.getAllCompanies();
        setCompanyId(res.data?.data[0]?.id);
      };

      fetchCompanyData();
    }
  }, [userData?.id, companyId]);

  useEffect(() => {
    if (companyId && !linkToken) {
      const body = { companyId };
      BankingApis.generateLinkToken(JSON.stringify(body)).then((res) => {
        setLinkToken(res.data.link_token);
      });
    }
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
