"use client";

import React from "react";
import ComingSoonCard from "@/components/common/ComingSoonCard";

const InvoiceContainer = () => {
  return (
    <div className="flex gap-24 flex-row justify-center">
      <div className="w-full lg:max-w-[950px]">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-col md:flex-row justify-between">
            <h1 className="text-primary text-xl font-medium leading-10">
              {"Invoicing"}
            </h1>
          </div>
          <ComingSoonCard
            title="Effortless invoicing built into your bank account"
            description="Send professional invoices, track what you’re owed, and get
                    paid the way you want — all from where you manage your
                    banking."
          />
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return <InvoiceContainer />;
};

export default Page;
