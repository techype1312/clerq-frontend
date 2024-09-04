"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/User";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfilePhotoPreview from "@/components/common/profile-photo/ProfilePhotoPreview";
import { isDemoEnv } from "../../../../../config";
import { useTrackerContext } from "@/context/Tracker";

const UserMenu = () => {
  const router = useRouter();
  const { userData } = useUserContext();
  const { resetSession } = useTrackerContext();
  const [open, setOpen] = React.useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onLogoutSuccess = (res: any) => {
    resetSession();
    setLoading(false);
    localStorage.remove("user");
    removeAuthToken();
    removeAuthRefreshToken();
    removeAuthUcrmId();
    removeSessionId();
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

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div
          className="md:ml-auto flex items-center cursor-pointer"
        //   onMouseEnter={() => setOpen(true)}
        //   onMouseLeave={() => setOpen(false)}
        >
          <ProfilePhotoPreview
            firstName={userData?.firstName}
            lastName={userData?.lastName}
            photo={userData?.photo}
            size={36}
            className="rounded-full"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 mr-8"
        // onMouseEnter={() => setOpen(true)}
        // onMouseLeave={() => setOpen(false)}
      >
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
          {/* <DropdownMenuItem
              className="py-2 cursor-pointer"
              onClick={() => {
                router.push("/dashboard/security");
              }}
            >
              Security
            </DropdownMenuItem> */}
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
  );
};

export default UserMenu;
