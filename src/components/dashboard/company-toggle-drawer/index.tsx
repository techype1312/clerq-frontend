"use client";
import React, { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { useCompanySessionContext } from "@/context/CompanySession";
import { Button } from "@/components/ui/button";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";

const CompanyToggleDrawer = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const {
    myCompanyMappings = [],
    currentUcrm,
    switchCompany,
  } = useCompanySessionContext();

  if (!currentUcrm || !myCompanyMappings.length) return null;

  return (
    <Fragment>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="gap-6 border-none py-5 px-0 justify-around bg-none"
          >
            <div className="flex flex-row items-center gap-2">
              <Image
                src="/profile.png"
                className="rounded-lg"
                alt="logo"
                width={32}
                height={32}
              />
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#1e1e2a",
                }}
              >
                {currentUcrm.company.name}
              </p>
            </div>
            {open ? <SymbolIcon icon="keyboard_arrow_up" /> : <SymbolIcon icon="keyboard_arrow_down" />}
            
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 ml-4">
          <p className="text-muted px-2 py-1">{"Switch accounts"}</p>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="my-3">
            {myCompanyMappings.map((ucrm: any) => {
              return (
                <DropdownMenuItem
                  className="my-2 cursor-pointer justify-between"
                  key={ucrm.id}
                  onClick={() => switchCompany(ucrm.id)}
                >
                  <div className="flex flex-row items-center gap-2">
                    <Image
                      src="/profile.png"
                      className="rounded-lg"
                      alt="logo"
                      width={32}
                      height={32}
                    />
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: "#1e1e2a",
                      }}
                    >
                      {ucrm.company.name}
                    </p>
                  </div>
                  {currentUcrm.id === ucrm.id && (
                    <SymbolIcon icon="check" color="blue" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="my-2 cursor-pointer">
            Add new account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <span className="border-b"></span>
    </Fragment>
  );
};

export default CompanyToggleDrawer;
