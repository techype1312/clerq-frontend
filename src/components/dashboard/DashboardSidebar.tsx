"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SymbolIcon from "../generalComponents/MaterialSymbol/SymbolIcon";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/User";
import CompanyToggleDrawer from "./company-toggle-drawer";

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

const DashboardSidebar = ({ isOpen, setOpen }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const [windowWidth, setWindowWidth] = useState<number>(300);
  const { userData } = useUserContext();

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
        href="/dashboard/deal-tracker"
        setOpen={setOpen}
      >
        <Image src="/dollarWithArrow.svg" alt="a" width={24} height={24} />
        Deal tracker
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
          color={pathname === "/dashboard/balance-sheet" ? "#5266EB" : ""}
        />
        Balance sheets
      </SidebarLink>
      <SidebarLink
        pathname={pathname}
        href="/dashboard/documents"
        setOpen={setOpen}
      >
        <SymbolIcon
          icon="article"
          color={pathname === "/dashboard/documents" ? "#5266EB" : ""}
        />
        Documents
      </SidebarLink>
      <SidebarLink
        pathname={pathname}
        href="/dashboard/bank-connections"
        setOpen={setOpen}
      >
        <SymbolIcon
          icon="account_balance"
          color={pathname === "/dashboard/bank-connections" ? "#5266EB" : ""}
        />
        Bank connections
      </SidebarLink>
    </>
  ) : (
    <></>
  );

  return (
    <div
      className={`absolute h-screen background-light border-r border-[#F1F1F4] z-40 lg:flex lg:static gap-2 lg:h-auto flex-col min-w-fit transition-all duration-500 ${
        isOpen
          ? "px-0 pt-6 pb-4 min-w-48"
          : "-translate-x-full lg:translate-x-0 ml-auto overflow-hidden pt-6 pb-8"
      } `}
    >
      <div className="flex justify-between items-center pb-4 lg:hidden">
        {/* <div>Icon will go here</div> */}
        <button
          className="block"
          onClick={() => {
            setOpen(false);
          }}
        >
          <X size={30} />
        </button>
      </div>
      <div className="flex flex-col mt-0 gap-4">
        <CompanyToggleDrawer />
        <div className="flex flex-col gap-4 px-2">{items}</div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
