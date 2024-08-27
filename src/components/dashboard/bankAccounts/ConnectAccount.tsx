"use client";

import React, { useState } from "react";
import { PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { Loader2Icon } from "lucide-react";
import isObject from "lodash/isObject";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { Card } from "@/components/ui/card";
import { ErrorProps } from "@/types/general";
import BankingApis from "@/actions/data/banking.data";
import { isDemoEnv } from "../../../../config";

const ConnectAccount = ({ companyId }: { companyId: string }) => {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkToken, setLinkToken] = useState<string>("");

  const config: PlaidLinkOptions = {
    onSuccess: (public_token, metadata) => {
      BankingApis.exchangePublicToken({
        publicToken: public_token,
        company: {
          id: companyId,
        },
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
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onFetchLinkTokenSuccess = (res: any) => {
    if (res) {
      setLinkToken(res.link_token);
    }
    setLoading(false);
  };

  const handleLinkTokenGeneration = () => {
    if (isDemoEnv()) return false;
    if (companyId && !linkToken) {
      setLoading(true);
      BankingApis.generateLinkToken({ companyId }).then(
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
