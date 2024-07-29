// "use client";
// import React, { useContext } from "react";

// const Page = () => {
//   return (
//     <div className="flex flex-col gap-4">
//     </div>
//   );
// };

// export default Page;

"use client";
import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { supabase } from "@/utils/supabase/client";

const Page = ({}) => {
  const body = {
    userId: "98d46477-37c8-4b35-9ed0-bc6596d0b7e9",
    clientName: "John Doe",
  };
  const [token, setToken] = useState<string>("");
  const config: PlaidLinkOptions = {
    onSuccess: (public_token, metadata) => {
      supabase.functions
        .invoke("plaid-success", {
          method: "POST",
          body: { public_token, user_id: "98d46477-37c8-4b35-9ed0-bc6596d0b7e9" },
        })
        .then((res) => {});
    },
    onEvent: (eventName, metadata) => {},
    token: token,
  };
  const { open, exit, ready } = usePlaidLink(config);

  useEffect(() => {
    if ("1" && !token) {
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
  }, []);
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

export default Page;
