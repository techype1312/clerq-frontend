"use client";
import { useUserContext } from "@/context/User";
import React, { useEffect } from "react";

const Page = () => {
  const { refreshUser } = useUserContext();

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>page</div>;
};

export default Page;
