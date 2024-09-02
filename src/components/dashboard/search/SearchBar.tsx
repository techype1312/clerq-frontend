import * as React from "react";

import { cn } from "@/utils/utils";
import { SymbolCodepoints } from "react-material-symbols";
import SymbolIcon from "../../common/MaterialSymbol/SymbolIcon";
import { ISearchSelects } from "@/types/general";
import { Button } from "@/components/ui/button";
import { pages } from "@/utils/constants/pages";
import Link from "next/link";
import { transactions } from "@/utils/constants/transactions";
import { format } from "date-fns";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: SymbolCodepoints;
  endIcon?: SymbolCodepoints;
  outerClassName?: string;
}

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
    >();
    const [openDropdown, setOpenDropdown] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const [searchedPages, setSearchedPages] = React.useState<any>(pages);
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
          //This will make search like mercury on clicking outside it clears the search
          //setSelectedSearch(undefined);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    console.log(openDropdown);

    return (
      <div className="flex flex-col h-12 w-full relative" ref={dropdownRef}>
        <div
          className={cn("w-full h-full relative border-input", outerClassName)}
          onClick={() => {
            setOpenDropdown(!openDropdown);
          }}
        >
          <div
            className={cn(
              "w-full h-10 max-w-md relative border border-input rounded-md flex items-center md:ml-5 mr-4 bg-white",
              selectedSearch && "rounded-b-none"
            )}
          >
            <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2 items-center flex py-2">
              <SymbolIcon icon={"search"} size={20} />
            </div>
            {selectedSearch && (
              <div className="text-primary ml-8 w-fit text-sm flex items-center gap-2 px-2 py-1 hover:bg-gray-100 background-muted rounded-lg cursor-pointer">
                {selectedSearch}
                <span
                  onClick={() => {
                    setSelectedSearch(undefined);
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
                "flex h-12 grow w-full rounded-md bg-background border-0 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
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
                    setSelectedSearch(undefined);
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
              className="border-t border-color-primary-background absolute top-10 -ml-4 md:ml-0.5 w-full max-w-[11.2rem] md:max-w-md bg-white shadow p-2"
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
                        className="flex items-center gap-2 px-2 py-0 h-8 hover:bg-gray-100 background-muted rounded-lg cursor-pointer"
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
                <div className="flex flex-col gap-2 mt-2 overflow-auto max-h-[50rem]">
                  <p className="text-sm text-muted">pages</p>
                  {searchedPages.map((page: any) => (
                    <Link
                      className="text-base text-primary flex items-center gap-2"
                      key={page.name}
                      href={page.pathname}
                    >
                      <SymbolIcon icon={"web_asset"} size={20} /> {page.name}
                    </Link>
                  ))}
                </div>
              )}
              {selectedSearch === "Transactions" && (
                <div className="flex flex-col gap-2 mt-2 overflow-auto max-h-[50rem]">
                  <p className="text-sm text-muted">transactions</p>
                  {transactions?.map((transaction, index) => (
                    <Link
                      className="flex gap-4"
                      key={index}
                      href={`/dashboard/transactions?open=${transaction.id}`}
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
