'use client'
import React, { useContext } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { supabase } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import { UserContext } from "@/context/User";

const DashboardTop = () => {
  const { refreshUser } = useContext(UserContext);
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
    <div className="my-4 w-full flex">
      <Input
        className="w-1/2 rounded-2xl"
        outerClassName="flex items-center justify-center"
        endIcon={"search"}
        placeholder="Search for a product"
        type="text"
      />
      <Button className="ml-auto mr-4" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default DashboardTop;
