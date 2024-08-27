"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserContext } from "@/context/User";
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
import CompanyToggleDrawer from "../company/CompanyToggleDrawer";
import { isEmpty } from "lodash";

const OnboardingHeader = () => {
  const router = useRouter();
  const { userData } = useUserContext();
  const pathname = usePathname();
  const inputRef = useRef<any>(null);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

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

  if (!userData || isEmpty(userData)) return null;
  return (
    <div className="my-5 flex px-4 sm:px-8 md:mx-8" ref={inputRef}>
      <div
        className={cn(
          "text-primary text-2xl font-medium flex items-center justify-center"
        )}
      >
        <CompanyToggleDrawer
          toggleBtnText="Switch Accounts"
          showAddNew={false}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="ml-auto flex items-center cursor-pointer">
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

export default OnboardingHeader;
