"use client";
import React, { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
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
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import ProfilePhotoPreview from "@/components/common/profile-photo/ProfilePhotoPreview";
import { isDemoEnv } from "../../../../config";

const CompanyToggleDrawer = ({
  toggleBtnText,
  showAddNew = true,
}: {
  toggleBtnText?: string;
  showAddNew?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const {
    myCompanyMappings = [],
    currentUcrm,
    switchCompany,
  } = useCompanySessionContext();

  const initiateNewCompany = () => {
    router.push("/onboarding/new-company");
  };
  if (!currentUcrm || !myCompanyMappings.length) return null;

  return (
    <Fragment>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="gap-6 border-none py-5 px-2 -ml-2 justify-around bg-none bg-transparent w-fit"
          >
            <div className="flex flex-row items-center gap-2">
              {!toggleBtnText && (
                <ProfilePhotoPreview
                  firstName={currentUcrm.company?.name?.split(' ')?.[0]}
                  lastName={currentUcrm.company?.name?.split(' ')?.[1]}
                  photo={currentUcrm.company.logo}
                  size={28}
                />
              )}
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#1e1e2a",
                }}
              >
                {toggleBtnText || currentUcrm.company.name}
              </p>
            </div>
            {open ? (
              <SymbolIcon icon="keyboard_arrow_up" />
            ) : (
              <SymbolIcon icon="keyboard_arrow_down" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 ml-4">
          <p className="text-muted px-2 py-1 text-xs">{"Switch accounts"}</p>
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
                    <ProfilePhotoPreview
                      firstName={ucrm.company?.name?.split(' ')[0]}
                      lastName={ucrm.company?.name?.split(' ')[1]}
                      photo={ucrm.company.logo}
                      size={30}
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
          {showAddNew && !isDemoEnv() && (
            <Fragment>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="my-2 cursor-pointer"
                onClick={initiateNewCompany}
              >
                Add new company
              </DropdownMenuItem>
            </Fragment>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
};

export default CompanyToggleDrawer;
