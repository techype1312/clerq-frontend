import * as React from "react";

import { cn } from "@/utils/utils";
import Link from "next/link";
import { format } from "date-fns";
import { SymbolCodepoints } from "react-material-symbols";
import { ISearchSelects } from "@/types/general";
import { Button } from "@/components/ui/button";
import { pages } from "@/utils/constants/pages";
import { transactions } from "@/utils/constants/transactions";
import SymbolIcon from "../../common/MaterialSymbol/SymbolIcon";
import { routePermissionMatcher } from "@/utils/route-permission-matcher.util";
import { useCompanySessionContext } from "@/context/CompanySession";
import { pathPermission } from "@/utils/constants/path-permissions";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: SymbolCodepoints;
  endIcon?: SymbolCodepoints;
  outerClassName?: string;
}

const DEFAULT_SEARCH = "Pages";
const searchSelects = [
  {
    id: 1,
    icon: <SymbolIcon icon={"web_asset"} size={20} />,
    name: "Pages",
  },
  {
    id: 2,
    icon: <SymbolIcon icon={"list"} size={20} />,
    name: "Transactions",
  },
];

const SearchBar = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, outerClassName, type, value, ...props }, ref) => {
    const searchRef = React.useRef<any>(null);
    const [selectedSearch, setSelectedSearch] = React.useState<
      string | undefined
    >(DEFAULT_SEARCH);
    const { permissions } = useCompanySessionContext();
    const [openDropdown, setOpenDropdown] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const [searchedPages, setSearchedPages] = React.useState<any>(pages);

    const resetSearch = () => {
      setSelectedSearch(DEFAULT_SEARCH);
    };

    React.useEffect(() => {
      if (
        selectedSearch === "Pages" &&
        value !== "" &&
        value !== undefined &&
        typeof value === "string"
      ) {
        setSearchedPages(
          pages.filter((page) =>
            page.name.toLowerCase().includes(value?.toLowerCase())
          )
        );
      } else if (selectedSearch === "Pages") {
        setSearchedPages(pages);
      }
    }, [value]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
          //   !searchRef.current.contains(event.target as Node)
        ) {
          setOpenDropdown(false);
          resetSearch();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div className="flex flex-col h-12 w-full relative items-center">
        <div
          className={cn(
            "md:w-[500px] max-md:w-full h-full relative",
            outerClassName
          )}
          ref={dropdownRef}
        >
          <div
            className={cn(
              "w-full h-10 relative border border-input rounded-md flex items-center md:ml-5 mr-4 bg-white",
              {
                ["!border-b-2 !border-b-[#233FDB] !rounded-b-none"]:
                  openDropdown,
              }
            )}
            onClick={() => {
              setOpenDropdown(true);
            }}
          >
            <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2 items-center flex py-2">
              <SymbolIcon icon={"search"} size={20} />
            </div>
            {selectedSearch && (
              <div className="text-primary ml-8 w-fit text-sm flex items-center gap-2 px-2 py-1 hover:bg-gray-100 background-muted rounded-lg cursor-pointer">
                {selectedSearch}
                <span
                  onClick={() => {
                    resetSearch();
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <SymbolIcon color="#DA2444" icon={"cancel"} size={20} />
                </span>
              </div>
            )}
            <input
              type={type}
              className={cn(
                "border-0 flex h-12 grow w-full rounded-md bg-background py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
                selectedSearch ? "pl-3 pr-8" : "pl-8",
                className
              )}
              ref={searchRef}
              value={value}
              {...props}
            />
            {openDropdown && (
              <div className="relative cursor-pointer">
                <div
                  onClick={() => {
                    setOpenDropdown(false);
                    resetSearch();
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 items-center flex"
                >
                  <SymbolIcon icon={"cancel"} size={20} />
                </div>
              </div>
            )}
          </div>
          {openDropdown && (
            <div
              className="absolute top-11 md:ml-5 mr-4 w-[-webkit-fill-available] bg-white shadow p-2"
              ref={searchRef}
            >
              {!selectedSearch && (
                <div className="flex flex-col gap-2">
                  <p className="text-muted text-sm">Searching for</p>
                  <div className="flex flex-col md:flex-row gap-2">
                    {searchSelects.map((select: ISearchSelects) => (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedSearch(select.name);
                        }}
                        key={select.id}
                        className="flex items-center gap-2 px-2 py-0 h-8 hover:bg-gray-100 background-muted rounded-lg cursor-pointer max-md:w-[130px]"
                        variant={"ghost"}
                      >
                        {select.icon}
                        <span className="text-primary text-sm">
                          {select.name}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {selectedSearch === "Pages" && (
                <div className="flex flex-col mt-2 overflow-auto max-h-[50rem]">
                  <p className="text-sm text-muted mb-2 ml-2">Pages</p>
                  {searchedPages.map((page: any) => {
                   const showPage = routePermissionMatcher(
                      // @ts-ignore
                      permissions?.routes[pathPermission[page.pathname]],
                      page.pathname
                    );
                    if(!showPage && page.pathname !== "/dashboard/my-profile") return null;
                    return (
                      <Link
                        className="group text-base text-primary flex flex-row justify-between items-center rounded-md hover:bg-slate-100 px-2 py-[7px]"
                        key={page.name}
                        href={page.pathname}
                        onClick={() => {
                          setOpenDropdown(false);
                          resetSearch();
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <SymbolIcon icon={"web_asset"} size={16} />{" "}
                          {page.name}
                        </div>
                        <SymbolIcon
                          icon={"chevron_right"}
                          size={22}
                          color="#233FDB"
                          className="!hidden group-hover:!block"
                        />
                      </Link>
                    );
                  })}
                </div>
              )}
              {selectedSearch === "Transactions" && (
                <div className="flex flex-col gap-2 mt-2 overflow-auto max-h-[50rem]">
                  <p className="text-sm text-muted">Transactions</p>
                  {transactions?.map((transaction, index) => (
                    <Link
                      className="flex gap-4"
                      key={index}
                      href={`/dashboard/transactions?open=${transaction.id}`}
                      onClick={() => {
                        setOpenDropdown(false);
                        resetSearch();
                      }}
                    >
                      <span className="text-nowrap">
                        {format(transaction.date, "MMM dd")}
                      </span>
                      <span className="w-full">{transaction.description}</span>
                      <span>{transaction.type}</span>
                      <span>{transaction.amount}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
SearchBar.displayName = "SearchBar";

export { SearchBar };
