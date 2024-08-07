"use client";
import { createContext, useEffect, useState } from "react";
export const MainContext = createContext<any>(null);
// import { usePathname, useRouter } from "next/navigation";
// import Cookies from "js-cookie";

export const MainContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const router = useRouter();
  // const pathname = usePathname();
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

  return (
    <MainContext.Provider
      value={
        {
          windowWidth,
        } as any
      }
    >
      {children}
    </MainContext.Provider>
  );
};
