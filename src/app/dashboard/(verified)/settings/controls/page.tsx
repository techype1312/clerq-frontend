"use client";
import EditDisableModule from "@/components/dashboard/settings/EditDisableModule";
import SwitchModule from "@/components/dashboard/settings/SwitchModule";
import React from "react";

const Page = () => {
  return (
    <div className="flex gap-4 flex-col">
      <h1 className="text-primary text-2xl font-medium">Settings</h1>
      <EditDisableModule
        moduleData={{
          title: "Require receipts for card transactions",
          description:
            "Your team will be required to upload receipts for any card transactions over the set amount. We'll email cardholders to let them know about the new policy once you enable it.",
          showEdit: true,
          showDisable: true,
          status: true,
        }}
      />
      <EditDisableModule
        moduleData={{
          title: "Require receipts for card transactions",
          description:
            "Your team will be required to upload receipts for any card transactions over the set amount. We'll email cardholders to let them know about the new policy once you enable it.",
          showEdit: true,
          showDisable: true,
          status: false,
        }}
      />
      <SwitchModule
        moduleData={{
          title: "Approved senders for bill forwarding",
          description:
            "Approved senders can email bills via your unique forwarding address.",
          isActive: true,
        }}
      />
      <SwitchModule
        moduleData={{
          title: "Notification as email",
          description:
            "Approved senders can email bills via your unique forwarding address.",
          isActive: true,
        }}
      />
      <SwitchModule
        moduleData={{
          title: "Approval for changes",
          description:
            "Approved senders can email bills via your unique forwarding address.",
          isActive: false,
        }}
      />
    </div>
  );
};

export default Page;
