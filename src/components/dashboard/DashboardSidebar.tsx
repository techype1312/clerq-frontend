"use client";

import {
  CreditCard,
  DollarSignIcon,
  HomeIcon,
  LandmarkIcon,
  Settings,
  SettingsIcon,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SymbolIcon from "../generalComponents/MaterialSymbol/SymbolIcon";

const DashboardSidebar = ({ isOpen, setOpen }: any) => {
  const pathname = usePathname();
  const [windowWidth, setWindowWidth] = useState<number>(300);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
    }
    console.log(windowWidth);

    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setWindowWidth(window.innerWidth);
      });
    };
  }, []);

  const items = pathname.startsWith("/dashboard") ? (
    <>
      <SidebarLink pathname={pathname} href="/dashboard" setOpen={setOpen}>
        <SymbolIcon
          icon="home"
          color={pathname === "/dashboard" ? "#5266EB" : ""}
        />
        Home
      </SidebarLink>
      <SidebarLink
        pathname={pathname}
        href="/dashboard/transactions"
        setOpen={setOpen}
      >
        <SymbolIcon
          icon="attach_money"
          color={pathname === "/dashboard/transactions" ? "#5266EB" : ""}
        />
        Transactions
      </SidebarLink>
      <SidebarLink
        pathname={pathname}
        href="/dashboard/income-statement"
        setOpen={setOpen}
      >
        <SymbolIcon
          icon="import_contacts"
          color={pathname === "/dashboard/income-statement" ? "#5266EB" : ""}
        />
        Income statements
      </SidebarLink>
      <SidebarLink
        pathname={pathname}
        href="/dashboard/balance-sheet"
        setOpen={setOpen}
      >
        <SymbolIcon
          icon="monitoring"
          color={pathname === "/dashboard/balance-sheets" ? "#5266EB" : ""}
        />
        Balance sheets
      </SidebarLink>
      <SidebarLink
        pathname={pathname}
        href="/dashboard/banking"
        setOpen={setOpen}
      >
        <SymbolIcon icon="article" color={pathname === "/dashboard/documents" ? "#5266EB": ""} />
        {/* <LandmarkIcon
          fill={pathname.startsWith("/dashboard/banking") ? "black" : "white"}
          stroke="#1E1E1E"
          size={"20"}
        /> */}
        Documents
      </SidebarLink>
      <SidebarLink
        pathname={pathname}
        href="/dashboard/bank-connections"
        setOpen={setOpen}
      >
        <SymbolIcon icon="account_balance" color={pathname === "/dashboard/bank-connections" ? "#5266EB" : ""} />
        Bank connections
      </SidebarLink>
      <SidebarLink
        pathname={pathname}
        href="/dashboard/payment"
        setOpen={setOpen}
      >
        <SymbolIcon icon="line_start_circle" />
        {/* <CreditCard
          fill={
            pathname.startsWith("/dashboard/integrations") ? "black" : "white"
          }
          stroke="#1E1E1E"
          size={"20"}
        /> */}
        Integrations
      </SidebarLink>
      <SidebarLink
        pathname={pathname}
        href="/dashboard/settings"
        setOpen={setOpen}
      >
        <SymbolIcon icon="settings" />
        Settings
      </SidebarLink>
    </>
  ) : (
    <></>
  );

  return (
    <div
      className={`absolute h-screen background-light border-r border-[#F1F1F4] z-40 lg:flex lg:static gap-2 lg:h-auto flex-col min-w-fit transition-all duration-500 ${
        isOpen
          ? "px-4 pt-6 pb-8 min-w-48"
          : "-translate-x-full lg:translate-x-0 ml-auto overflow-hidden px-4 pt-6 pb-8"
      } `}
    >
      <div className="flex justify-between items-center pb-4">
        {/* <div>Icon will go here</div> */}
        <button
          className="block lg:hidden"
          onClick={() => {
            setOpen(false);
          }}
        >
          <X size={30} />
        </button>
      </div>
      <div className="flex flex-col mt-4 gap-4">
        <div className="flex flex-col gap-4">{items}</div>
      </div>
    </div>
  );
};

export default DashboardSidebar;

const SidebarLink = ({ pathname, href, setOpen, children }: any) => {
  const isActive =
    pathname === href ||
    (pathname.startsWith(href) &&
      pathname !== "/dashboard" &&
      href !== "/dashboard");
  return (
    <Link
      className={`${
        isActive ? "text-black font-medium" : "text-primary background-light"
      } px-4 rounded py-2`}
      href={href}
      onClick={() => {
        setOpen(false);
      }}
    >
      <p className="flex items-center gap-2">{children}</p>
    </Link>
  );
};
