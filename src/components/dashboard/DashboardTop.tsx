"use client";
import React, { useContext } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/User";
import AuthApis from "@/actions/apis/AuthApis";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const DashboardTop = () => {
  const router = useRouter();
  const { userdata } = useContext(UserContext);

  const handleLogout = async () => {
    return AuthApis.signOut().then(() => {
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      Cookies.remove("onboarding_completed");
      localStorage.clear();
      router.replace("/auth/signin");
    });
  };

  return (
    <div className="my-4 w-full flex">
      <Input
        className="w-1/2 rounded-2xl"
        outerClassName="flex items-center justify-center"
        endIcon={"search"}
        placeholder="Search for a product"
        type="text"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="ml-auto mr-8 flex items-center cursor-pointer">
            <Image
              src="/profile.png"
              className="rounded-full"
              alt="logo"
              width={40}
              height={40}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mr-8">
          <DropdownMenuLabel className="py-2">
            <div className="flex flex-col">
              <p className="text-label">
                {userdata?.firstName} {userdata?.lastName}
              </p>
              <p className="text-muted">{userdata?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="py-2 cursor-pointer"
              onClick={() => {
                router.push("/dashboard/settings/my-profile");
              }}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="py-2 cursor-pointer"
              onClick={() => {
                router.push("/dashboard/settings/company-profile");
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
