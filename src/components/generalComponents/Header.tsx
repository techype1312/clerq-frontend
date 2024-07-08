"use client";
import React, { use, useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { MainContext } from "@/context/Main";

const Header = () => {
  const router = useRouter();
  const { userdata, setuserdata } = useContext(MainContext);
  const [isLoggedIn, setIsLoggedIn] = useState(userdata ? true : false);
  useEffect(() => {
    if (userdata) {
      setIsLoggedIn(true);
    }
  }, [userdata]);
  const handleLogout = () => {
    Cookies.remove("jwtToken");
    localStorage.removeItem("userdata");
    setuserdata(null)
    router.push("/signin");
    setIsLoggedIn(false)
  };
  return (
    <div className="p-2">
      <div className="ml-auto w-fit mr-2">
        {isLoggedIn ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Button onClick={() => router.push("/signin")}>Sign In</Button>
        )}
      </div>
    </div>
  );
};

export default Header;
