"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUserContext } from "@/context/User";
import localStorage from "@/utils/storage/local-storage.util";
import {
  removeAuthOnboardingStatus,
  removeAuthRefreshToken,
  removeAuthToken,
  removeAuthUcrmId,
  removeSessionId,
} from "@/utils/session-manager.util";
import { Button } from "../ui/button";
import AuthApis from "@/actions/data/auth.data";
import { useRouter } from "next/navigation";
import { ErrorProps } from "@/types/general";
import { isObject } from "lodash";

const Header = () => {
  const { userData } = useUserContext();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(userData ? true : false);
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

  useEffect(() => {
    if (userData) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userData]);

  return (
    <div className="p-2">
      <div className="ml-auto w-fit mr-2">
        {isLoggedIn ? (
          <div className="flex gap-4 items-center justify-center">
            <Link href="/dashboard">Dashboard</Link>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        ) : (
          <Link href="/auth/signin">Sign In</Link>
        )}
      </div>
    </div>
  );
};

export default Header;
