"use client";
import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
export const MainContext = createContext<any>(null);

export const MainContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userdata, setuserdata] = useState<any>("");
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setWindowWidth(window.innerWidth);
      });
    };
  }, []);

  useEffect(() => {
    let data = localStorage.getItem("userdata");
    let token = Cookies.get("jwtToken");
    if (!token && data) {
      localStorage.removeItem("userdata");
    }
    if (data === "") {
      localStorage.removeItem("userdata");
    } else if (!localStorage.getItem("userdata")) {
      Cookies.remove("jwtToken");
    }
    if (data) {
      data = JSON.parse(data);
      setuserdata(data);
    }
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("userdata", JSON.stringify(userdata));
  //   if (userdata === "") {
  //     localStorage.removeItem("userdata");
  //     Cookies.remove("jwtToken");
  //   } else if (!localStorage.getItem("userdata")) {
  //     Cookies.remove("jwtToken");
  //   }
  // }, [userdata]);

  return (
    <MainContext.Provider
      value={
        {
          userdata,
          setuserdata,
          windowWidth,
        } as any
      }
    >
      {children}
    </MainContext.Provider>
  );
};
