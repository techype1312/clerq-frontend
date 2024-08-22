"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SymbolIcon from "../generalComponents/MaterialSymbol/SymbolIcon";
import Image from "next/image";
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
        isActive ? "text-black font-normal" : "text-primary background-light"
      } px-4 rounded py-1`}
      href={href}
      onClick={() => {
        setOpen(false);
      }}
    >
      <p className="flex items-center gap-2 text-sm">{children}</p>
    </Link>
  );
};

const DashboardSidebar = ({ isOpen, setOpen }: any) => {
  const pathname = usePathname();
  const [windowWidth, setWindowWidth] = useState<number>(300);

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
      {/* Company Section */}
      <div className="mt-4 mb-1 text-muted text-sm flex flex-row items-center gap-2 px-4">
        {/* <SymbolIcon icon="apartment" size={24} /> */}
        <span>Company</span>
      </div>
      <SidebarLink pathname={pathname} href="/dashboard" setOpen={setOpen}>
        <SymbolIcon
          icon="home"
          color={pathname === "/dashboard" ? "#5266EB" : ""}
          size={20}
        />
        Home
      </SidebarLink>
      <SidebarLink
        pathname={pathname}
        href="/dashboard/deal-tracker"
        setOpen={setOpen}
      >
        <SymbolIcon
          icon="mintmark"
          color={pathname === "/dashboard/deal-tracker" ? "#5266EB" : ""}
          size={20}
        />
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
          size={20}
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
          size={20}
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
          size={20}
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
          size={20}
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
          size={20}
        />
        Bank connections
      </SidebarLink>

      {/* Settings Section */}
      <div className="mt-4 mb-1 text-muted text-sm flex flex-row items-center gap-2 px-4">
        {/* <SymbolIcon icon="settings" size={24} /> */}
        <span>Settings</span>
      </div>

      <SidebarLink
        pathname={pathname}
        href="/dashboard/company-profile"
        setOpen={setOpen}
      >
        <SymbolIcon
          icon="source_environment"
          color={pathname === "/dashboard/company-profile" ? "#5266EB" : ""}
          size={20}
        />
        Company Profile
      </SidebarLink>

      <SidebarLink pathname={pathname} href="/dashboard/team" setOpen={setOpen}>
        <SymbolIcon
          icon="group"
          color={pathname === "/dashboard/team" ? "#5266EB" : ""}
          size={20}
        />
        Team
      </SidebarLink>

      <SidebarLink
        pathname={pathname}
        href="/dashboard/controls"
        setOpen={setOpen}
      >
        <SymbolIcon
          icon="tune"
          color={pathname === "/dashboard/controls" ? "#5266EB" : ""}
          size={20}
        />
        Controls
      </SidebarLink>

      {/* User Section */}
      <div className="mt-4 mb-1 text-muted text-sm flex flex-row items-center gap-2 px-4">
        {/* <SymbolIcon icon="person" size={24} /> */}
        <span>Personal</span>
      </div>

      <SidebarLink
        pathname={pathname}
        href="/dashboard/my-profile"
        setOpen={setOpen}
      >
        <SymbolIcon
          icon="account_box"
          color={pathname === "/dashboard/my-profile" ? "#5266EB" : ""}
          size={20}
        />
        My profile
      </SidebarLink>

      <SidebarLink
        pathname={pathname}
        href="/dashboard/notifications"
        setOpen={setOpen}
      >
        <SymbolIcon
          icon="edit_notifications"
          color={pathname === "/dashboard/notifications" ? "#5266EB" : ""}
          size={20}
        />
        Notifications
      </SidebarLink>
    </>
  ) : (
    <></>
  );

  return (
    <div
      className={`absolute flex gap-3 h-screen background-light border-r border-[#F1F1F4] z-40 lg:flex lg:static lg:h-auto flex-col min-w-fit transition-all duration-500 ${
        isOpen
          ? "px-0 pt-3 pb-6 min-w-48"
          : "-translate-x-full lg:translate-x-0 ml-auto overflow-hidden pt-3 pb-6"
      } `}
    >
      <div className="flex flex-col mx-4 gap-3">
        <div className="flex justify-between items-center px-2 lg:hidden gap-6 ">
          <Image
            src={"/clerq_logo.png"}
            alt="Clerq"
            width={50}
            height={30}
          />
          <button
            className="block"
            onClick={() => {
              setOpen(false);
            }}
          >
            <SymbolIcon icon="close" />
          </button>
        </div>
        <CompanyToggleDrawer />
      </div>
      <div className="flex flex-col mt-0 gap-[6px] items-center">
        <div className="flex flex-col gap-3 px-4 border-t">{items}</div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
