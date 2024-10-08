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

const Step4 = ({
  changeStep,
  userdata,
  step,
}: {
  changeStep: (step: number) => void;
  userdata: any;
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
        router.push('/dashboard')
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
    if (userdata?.id && !companyId) {
      const fetchCompanyData = async () => {
        const res = await CompanyApis.getAllCompanies();
        setCompanyId(res.data?.data[0]?.id);
      };

      fetchCompanyData();
    }
  }, [userdata?.id, companyId]);

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
        className={`${!linkToken ? "cursor-wait" : "cursor-pointer"} p-4 flex gap-2 bg-[#FAFBFD] border-none`}
      >
        <div className="my-auto">
          <Image
            src="/plaid&clerq.png"
            alt="Plaid & Clerq"
            width={102}
            height={64}
          />
        </div>
        <CardHeader>
          <CardTitle className="text-xl font-normal text-primary">
            Connect with Plaid
          </CardTitle>
          <CardDescription className="text-base font-normal text-label">
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
      </Card>
    </>
  );
};

export default Step4;
