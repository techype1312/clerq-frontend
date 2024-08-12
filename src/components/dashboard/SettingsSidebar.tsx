"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import SymbolIcon from "../generalComponents/MaterialSymbol/SymbolIcon";
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
      } px-4 rounded py-1 ml-7`}
      href={href}
      onClick={() => {
        setOpen(false);
      }}
    >
      <p className="flex items-center gap-2">{children}</p>
    </Link>
  );
};

const BackSidebarLink = ({ pathname, href, setOpen, children }: any) => {
  const isActive =
    pathname === href ||
    (pathname.startsWith(href) &&
      pathname !== "/dashboard" &&
      href !== "/dashboard");
  return (
    <Link
      className={`${
        isActive ? "text-black font-medium" : "text-primary background-light"
      } px-4 rounded py-1`}
      href={href}
      onClick={() => {
        setOpen(false);
      }}
    >
      <p className="flex items-center gap-2">{children}</p>
    </Link>
  );
};

const SettingsSidebar = ({ isOpen, setOpen }: any) => {
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
      <div className="mt-2 mb-1 text-muted text-sm flex flex-row items-center gap-2 px-4">
        <SymbolIcon icon="apartment" size={24} />
        <span>Company</span>
      </div>

      <SidebarLink
        pathname={pathname}
        href="/dashboard/settings/company-profile"
        setOpen={setOpen}
      >
        Company Profile
      </SidebarLink>
      <SidebarLink
        pathname={pathname}
        href="/dashboard/settings/team"
        setOpen={setOpen}
      >
        Team
      </SidebarLink>
      <SidebarLink
        pathname={pathname}
        href="/dashboard/settings/controls"
        setOpen={setOpen}
      >
        Controls
      </SidebarLink>

      <div className="mt-2 mb-1 text-muted text-sm flex flex-row items-center gap-2 px-4">
        <SymbolIcon icon="person" size={24} />
        <span>Personal</span>
      </div>

      <SidebarLink
        pathname={pathname}
        href="/dashboard/settings/my-profile"
        setOpen={setOpen}
      >
        My profile
      </SidebarLink>
      <SidebarLink
        pathname={pathname}
        href="/dashboard/settings/notifications"
        setOpen={setOpen}
      >
        Notifications
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

        <BackSidebarLink
          pathname={pathname}
          href="/dashboard"
          setOpen={setOpen}
        >
          <SymbolIcon
            icon="arrow_back"
            color={pathname === "/dashboard" ? "#5266EB" : ""}
            size={24}
          />
          Settings
        </BackSidebarLink>
        <div className="flex flex-col gap-4 px-2 overflow-scroll">{items}</div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
