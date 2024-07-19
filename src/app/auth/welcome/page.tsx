'use client'
import { MainContext } from "@/context/Main";
import React, { useEffect } from "react";

const Page = () => {
 const {refreshUser} = React.useContext(MainContext);
  useEffect(()=>{
    refreshUser()
  },[])
  return <div>page</div>;
};

export default Page;
