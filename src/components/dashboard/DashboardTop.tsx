"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "../ui/input";
import ProfilePhotoPreview from "../common/profile-photo/ProfilePhotoPreview";
import { dashboardTitle } from "@/utils/constants";
import { Button } from "../ui/button";
import SymbolIcon from "../common/MaterialSymbol/SymbolIcon";
import { cn } from "@/utils/utils";
import { useCompanySessionContext } from "@/context/CompanySession";
import UserMenu from "./user/UserMenu";
import { NotificationCenter } from "./notifications";
import { SearchBar } from "./search/SearchBar";

const DashboardTop = ({ toggleDrawer }: { toggleDrawer: () => void }) => {
  const router = useRouter();
  const { currentUcrm } = useCompanySessionContext();
  const pathname = usePathname();
  const inputRef = useRef<any>(null);
  const [showInput, setShowInput] = React.useState(false);
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
      className="py-3 w-[-webkit-fill-available] flex items-center pl-4 md:pl-8 pr-2 md:pr-8 fixed bg-white z-30"
      ref={inputRef}
    >
      <div className="flex items-center relative lg:hidden mr-6">
        <Button className="p-0 h-fit" onClick={toggleDrawer} variant="ghost">
          <ProfilePhotoPreview
            firstName={currentUcrm?.company?.name?.split(" ")?.[0]}
            lastName={currentUcrm?.company?.name?.split(" ")?.[1]}
            photo={currentUcrm?.company?.logo}
            size={30}
          />
        </Button>
      </div>
      <div className={cn("flex items-center")}>
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

      <SearchBar
        className="w-full md:w-1/2 rounded-md bg-white h-9"
        outerClassName={cn(
          "items-center justify-center max-md:hidden md:flex md:ml-5 mr-4",
          {
            "!flex": showInput,
          }
        )}
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        placeholder="Search or jump to"
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
      <NotificationCenter />
      <UserMenu />
    </div>
  );
};

export default DashboardTop;
