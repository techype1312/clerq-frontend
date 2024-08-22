"use client";
import React, { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { UserContext } from "@/context/User";
import AuthApis from "@/actions/apis/AuthApis";
import { Button } from "../ui/button";

const Header = () => {
  const { userData, refreshUser } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(userData ? true : false);
  useEffect(() => {
    if (userData) {
      setIsLoggedIn(true);
    } else{
      setIsLoggedIn(false);
    }
  }, [userData]);
  
  const handleLogout = async () => {
    return AuthApis.signOut().then(() => {
      Cookies.remove('token')
      Cookies.remove('refreshToken')
      Cookies.remove('onboarding_completed')
      localStorage.clear();
    })
  };

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
