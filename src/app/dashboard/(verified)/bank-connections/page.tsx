"use client";
import { LinkedTable } from "@/components/dashboard/bankAccounts/LinkedTable";
import { supabase } from "@/utils/supabase/client";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [cardsData, setCardsData] = useState([]);
  const [numberData, setNumberData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.functions
      .invoke("plaid-fetch-account", {
        method: "POST",
      })
      .then((res) => {
        setBankAccounts(
          res.data.accounts.filter((item: any) => {
            return item.type === "depository";
          })
        );
        setCardsData(
          res.data.accounts.filter((item: any) => item.type === "credit")
        );
        setNumberData(res.data.number);
      });
    setLoading(false);
  }, []);

  useEffect(() => {
    if (bankAccounts.length > 0) {
      bankAccounts.map((item: any) => {
        if (numberData.length > 0) {
          numberData.map((num: any) => {
            if (num.account_id === item.account_id) {
              item.account_no = num.account_no;
              item.routing = num.routing;
            }
          });
        }
      });
    }
  }, [bankAccounts]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-primary text-2xl font-medium ml-1">Bank Accounts</h1>
      <div className="flex flex-col gap-2 mb-4 border-b border-[#F1F1F4]">
        <h6 className="text-primary">Linked bank accounts</h6>
        <p className="text-muted">
          Automatically extract all business transactions for bookkeeping.
        </p>
        {loading ? (
          <div className="w-full flex items-center h-12">
            <Loader2Icon className="animate-spin" />
          </div>
        ) : (
          <LinkedTable
            details={bankAccounts}
            labels={{
              header1: "Account",
              header2: "Account no.",
              header3: "Routing no.",
            }}
          />
        )}
      </div>
      {!loading && (
        <div className="mt-4">
          <LinkedTable
            details={cardsData}
            labels={{
              header1: "Cards",
              header2: "Card no.",
              header3: "",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
