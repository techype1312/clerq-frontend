'use client'
import { UserContext } from "@/context/User";
import React, { useEffect } from "react";

const Page = () => {
 const {refreshUser} = React.useContext(UserContext);
  useEffect(()=>{
    refreshUser()
  },[])
  return <div>page</div>;
};

export default Page;
