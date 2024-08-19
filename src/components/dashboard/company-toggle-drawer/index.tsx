"use client";
import React, { Fragment } from "react";
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
  const router = useRouter();
  const {
    myCompanyMappings = [],
    currentUcrm,
    switchCompany,
  } = useCompanySessionContext();

  if (!currentUcrm || !myCompanyMappings.length) return null;

  return (
    <Fragment>
      <DropdownMenu>
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
            <SymbolIcon icon="unfold_more" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 ml-4">
          <DropdownMenuGroup className="my-3">
            <DropdownMenuItem
              className="my-2 cursor-pointer"
              onClick={() => {
                router.push("/dashboard/settings/company-profile");
              }}
            >
              Company Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="my-2 cursor-pointer"
              onClick={() => {
                router.push("/dashboard/settings/controls");
              }}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="my-2 cursor-pointer"
              onClick={() => {
                router.push("/dashboard/documents");
              }}
            >
              Documents
            </DropdownMenuItem>
          </DropdownMenuGroup>
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
          <DropdownMenuItem className="my-2 cursor-pointer">
            Support
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="my-3 cursor-pointer">
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <span className="border-b"></span>
    </Fragment>
  );
};

export default CompanyToggleDrawer;
