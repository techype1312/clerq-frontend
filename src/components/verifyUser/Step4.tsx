"use client";
import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { supabase } from "@/utils/supabase/client";

const Step4 = ({
  changeStep,
  userdata,
  otherUserData,
  step,
}: {
  changeStep: (step: number) => void;
  userdata: User;
  otherUserData: any;
  step: number;
}) => {
  const [token, setToken] = useState<string>("");
  const body = {
    userId: userdata?.id,
    clientName:
      userdata?.user_metadata.first_name +
      " " +
      userdata?.user_metadata.last_name,
  };
  const config: PlaidLinkOptions = {
    onSuccess: (public_token, metadata) => {
      supabase.functions
        .invoke("plaid-success", {
          method: "POST",
          body: { public_token, user_id: userdata?.id },
        })
        .then((res) => {
          changeStep(step + 1);
        });
    },
    onExit: (err, metadata) => {
      changeStep(step + 1);
    },
    onEvent: (eventName, metadata) => {},
    token: token,
  };
  const { open, exit, ready } = usePlaidLink(config);

  useEffect(() => {
    if (body.userId && !token) {
      console.log(userdata);
      supabase.functions
        .invoke("plaid", {
          method: "POST",
          body: body,
        })
        .then(async (res) => {
          console.log(res);
          setToken(res.data.link_token);
        });
    }
  }, [body.userId]);
  return (
    <>
      <Card
        onClick={() => {
          open();
        }}
        className="p-4 flex gap-2 bg-[#FAFBFD] border-none cursor-pointer"
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
