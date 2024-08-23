"use client";
import React, { useContext, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useUserContext } from "@/context/User";
import AuthApis from "@/actions/apis/AuthApis";
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
import ProfilePhotoPreview from "../profile-photo/ProfilePhotoPreview";
import { dashboardTitle } from "@/utils/constants";
import { Button } from "../ui/button";
import SymbolIcon from "../generalComponents/MaterialSymbol/SymbolIcon";
import { cn } from "@/utils/utils";

const DashboardTop = () => {
  const router = useRouter();
  const { userData } = useUserContext();
  const pathname = usePathname();
  const inputRef = useRef<any>(null);

  const handleLogout = async () => {
    return AuthApis.signOut().then(() => {
      localStorage.clear();
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      Cookies.remove("onboarding_completed");
      router.replace("/auth/signin");
      router.refresh();
    });
  };
  const [showInput, setShowInput] = React.useState(false);

  const mobileTitle = dashboardTitle.find(
    (title) =>
      pathname === `/dashboard/${title.toLowerCase().replace(" ", "-")}` ||
      (title === "Overview" && pathname === "/dashboard") ||
      (title === "Bank accounts" &&
        pathname === "/dashboard/bank-connections") ||
      (title === "Settings" && pathname === "/dashboard/controls") ||
      (title === "Profile" && pathname === "/dashboard/my-profile")
  );
  const [search, setSearch] = React.useState("");

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
    <div className="my-4 w-full flex" ref={inputRef}>
      <h1
        className={cn(
          "text-primary text-2xl font-medium ml-14 flex items-center justify-center md:hidden",
          {
            ["flex"]: !showInput,
            ["hidden"]: showInput,
          }
        )}
      >
        {mobileTitle ? mobileTitle : "Dashboard"}
      </h1>

      <Input
        className="ml-8 w-3/4 md:w-1/2 rounded-2xl bg-white"
        outerClassName={cn(
          "items-center justify-center max-md:hidden md:flex",
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
        className={cn("ml-auto mr-4 hover:bg-white md:hidden", {
          ["flex"]: !showInput,
          ["hidden"]: showInput,
        })}
        onClick={() => {
          setShowInput(!showInput);
        }}
      >
        <SymbolIcon icon="search" className="text-muted" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="md:ml-auto mr-4 md:mr-8 flex items-center cursor-pointer">
            <ProfilePhotoPreview
              firstName={userData?.firstName}
              lastName={userData?.lastName}
              photo={userData?.photo}
              size={38}
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
          <DropdownMenuItem
            onClick={handleLogout}
            className="py-4 cursor-pointer"
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DashboardTop;
