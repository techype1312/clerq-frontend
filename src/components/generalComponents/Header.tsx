"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import { UserContext } from "@/context/User";

const Header = () => {
  const { userdata, refreshUser } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(userdata ? true : false);
  useEffect(() => {
    if (userdata) {
      setIsLoggedIn(true);
    } else{
      setIsLoggedIn(false);
    }
  }, [userdata]);
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error logging out:", error.message);
      toast.error("Error logging out");
      return;
    } else {
      refreshUser();
    }
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
