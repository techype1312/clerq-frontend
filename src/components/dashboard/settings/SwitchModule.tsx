"use client";
import { Switch } from "@/components/ui/switch";
import { SwitchModuleType } from "@/types/general";
import React, { useState } from "react";

const SwitchModule = ({ moduleData }: { moduleData: SwitchModuleType }) => {
  const [isActive, setIsActive] = useState(moduleData?.isActive);
  return (
    <div className="flex w-full justify-between border-b border-muted pb-4">
      <div className="flex flex-col">
        <h1 className="text-primary">{moduleData.title}</h1>
        <p className="text-muted">{moduleData?.description}</p>
      </div>
      <Switch
        checked={isActive}
        onCheckedChange={() => {
          setIsActive(!isActive);
        }}
      />
    </div>
  );
};

export default SwitchModule;
