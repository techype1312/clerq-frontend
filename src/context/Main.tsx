"use client";
import { createContext, useContext, useEffect, useState } from "react";
export const MainContext = createContext<any>(null);

export const MainContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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

export const useMainContext = () => useContext(MainContext);