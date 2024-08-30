"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserContext } from "@/context/User";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ProfilePhotoPreview from "../common/profile-photo/ProfilePhotoPreview";
import { dashboardTitle } from "@/utils/constants";
import { Button } from "../ui/button";
import SymbolIcon from "../common/MaterialSymbol/SymbolIcon";
import { cn } from "@/utils/utils";
import AuthApis from "@/actions/data/auth.data";
import isObject from "lodash/isObject";
import { ErrorProps } from "@/types/general";
import localStorage from "@/utils/storage/local-storage.util";
import {
  removeAuthOnboardingStatus,
  removeAuthRefreshToken,
  removeAuthToken,
  removeAuthUcrmId,
  removeSessionId,
} from "@/utils/session-manager.util";
import { isDemoEnv } from "../../../config";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useCompanySessionContext } from "@/context/CompanySession";

const DashboardTop = ({ toggleDrawer }: { toggleDrawer: () => void }) => {
  const router = useRouter();
  const { userData } = useUserContext();
  const { currentUcrm } = useCompanySessionContext();
  const pathname = usePathname();
  const inputRef = useRef<any>(null);
  const [showInput, setShowInput] = React.useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = React.useState("");

  const mobileTitle = dashboardTitle.find(
    (title) =>
      pathname === `/dashboard/${title.toLowerCase().replace(" ", "-")}` ||
      (title === "Overview" && pathname === "/dashboard") ||
      (title === "Bank accounts" &&
        pathname === "/dashboard/bank-connections") ||
      (title === "Settings" && pathname === "/dashboard/controls") ||
      (title === "Profile" && pathname === "/dashboard/my-profile")
  );

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onLogoutSuccess = (res: any) => {
    setLoading(false);
    removeAuthToken();
    removeAuthRefreshToken();
    removeAuthUcrmId();
    removeSessionId();
    localStorage.remove("user");
    removeAuthOnboardingStatus();
    router.replace("/auth/signin");
    router.refresh();
  };

  const handleLogout = async () => {
    if (loading) return false;
    setLoading(true);
    setServerError("");
    return AuthApis.signOutUser().then(onLogoutSuccess, onError);
  };

  const handleNotifications = () => {
    router.replace("/dashboard/notifications");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="py-3 w-[-webkit-fill-available] flex items-center pl-4 md:pl-8 pr-2 md:pr-8 fixed bg-white z-50"
      ref={inputRef}
    >
      <div className="flex items-center relative lg:hidden">
        <Button className="p-0 h-fit" onClick={toggleDrawer} variant="ghost">
          <ProfilePhotoPreview
            firstName={currentUcrm?.company?.name?.split(" ")?.[0]}
            lastName={currentUcrm?.company?.name?.split(" ")?.[1]}
            photo={currentUcrm?.company?.logo}
            size={30}
          />
        </Button>
      </div>
      <div className={cn("ml-4 flex items-center")}>
        <h1
          className={cn("text-xl font-medium md:hidden w-max", {
            ["flex"]: !showInput,
            ["hidden"]: showInput,
          })}
        >
          {mobileTitle ? mobileTitle : "Dashboard"}
        </h1>
        {/* <Image
          src={"/otto_logo_large.png"}
          alt="Otto"
          width={77}
          height={32}
          className="hidden lg:flex"
        /> */}
      </div>

      <Input
        className="w-full md:w-1/2 rounded-2xl bg-white h-9"
        outerClassName={cn(
          "items-center justify-center max-md:hidden md:flex ml-5 mr-4",
          {
            "!flex": showInput,
          }
        )}
        endIcon={"search"}
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        placeholder="Search for a product"
        type="text"
      />

      <Button
        variant={"ghost"}
        className={cn(
          "ml-auto hover:bg-white md:hidden min-w-8 h-8 mr-[22px] p-0",
          {
            ["flex"]: !showInput,
            ["hidden"]: showInput,
          }
        )}
        onClick={() => {
          setShowInput(!showInput);
        }}
      >
        <SymbolIcon icon="search" className="text-muted" size={28} />
      </Button>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            className="flex hover:bg-accent rounded-full min-w-8 h-8 mr-6 p-0 items-center justify-center"
            onClick={handleNotifications}
          >
            <SymbolIcon
              icon="notifications"
              color={pathname === "/dashboard/notifications" ? "#5266EB" : ""}
              size={28}
            />
          </TooltipTrigger>
          <TooltipContent className="text-xs bg-slate-800 text-white px-2 items-center">
            <p className="whitespace-break-spaces max-w-72">
              {"Notifications"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="md:ml-auto flex items-center cursor-pointer">
            <ProfilePhotoPreview
              firstName={userData?.firstName}
              lastName={userData?.lastName}
              photo={userData?.photo}
              size={36}
              className="rounded-full"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mr-8">
          <DropdownMenuLabel className="py-2">
            <div className="flex flex-col">
              <p className="text-label">
                {userData?.firstName} {userData?.lastName}
              </p>
              <p className="text-muted">{userData?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="py-2 cursor-pointer"
              onClick={() => {
                router.push("/dashboard/my-profile");
              }}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="py-2 cursor-pointer"
              onClick={() => {
                router.push("/dashboard/company-profile");
              }}
            >
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="py-2 cursor-pointer">
            Support
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {!isDemoEnv() && (
            <DropdownMenuItem
              onClick={handleLogout}
              className="py-4 cursor-pointer"
            >
              Log out
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DashboardTop;
