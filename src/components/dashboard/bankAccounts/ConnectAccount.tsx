"use client";

import React, { useState } from "react";
import { PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { Loader2Icon } from "lucide-react";
import isObject from "lodash/isObject";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import BankingApis from "@/actions/apis/BankingApis";
import { Button } from "@/components/ui/button";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import { Card } from "@/components/ui/card";
import { ErrorProps } from "@/types/general";

const ConnectAccount = ({ companyId }: { companyId: string }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkToken, setLinkToken] = useState<string>("");

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
        router.push("/dashboard");
      });
    },
    onExit: (err, metadata) => {
      console.log("onExit", err, metadata);
    },
    onEvent: (eventName, metadata) => {
      console.log("onEvent", eventName, metadata);
    },
    token: linkToken,
  };
  const { open, ready } = usePlaidLink(config);

  const onError = (err: string | ErrorProps) => {
    setError(isObject(err) ? err.message : err);
    setLoading(false);
  };

  const onFetchLinkTokenSuccess = (res: any) => {
    if (res.data) {
      setLinkToken(res.data.link_token);
    }
    setLoading(false);
  };

  const handleLinkTokenGeneration = () => {
    if (companyId && !linkToken) {
      setLoading(true);
      const body = { companyId };
      BankingApis.generateLinkToken(JSON.stringify(body)).then(
        onFetchLinkTokenSuccess,
        onError
      );
    } else {
      open();
    }
  };

  React.useEffect(() => {
    if (linkToken && ready) {
      open();
    }
  }, [linkToken, open, ready]);

  return (
    <Card
      onClick={handleLinkTokenGeneration}
      className="p-4 flex gap-2 bg-[#FAFBFD] border-none cursor-pointer"
      style={{
        pointerEvents: loading ? "none" : "auto",
      }}
    >
      <Button
        variant={"ghost"}
        className="pl-0 flex items-center justify-start gap-2 w-full hover:bg-transparent"
      >
        <span className="background-muted flex items-center justify-center rounded-full p-2">
          {loading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <SymbolIcon icon="add" color="#70707C" />
          )}
        </span>
        <div className="text-primary">Add Account</div>
      </Button>
    </Card>
  );
};

export default ConnectAccount;
