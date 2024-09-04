//This component will be used to display the data on Income statement and Balance sheet pages
import React, { useEffect } from "react";
import { SheetDataType } from "@/types/general";
import SymbolIcon from "./MaterialSymbol/SymbolIcon";
import { formatAmount } from "@/utils/utils";

const SheetsData = ({
  sheetData,
  isOpened,
}: {
  sheetData: SheetDataType;
  isOpened?: string;
}) => {
  const [showData, setShowData] = React.useState<boolean>(
    sheetData.isCollapsible ? false : true
  );
  useEffect(() => {
    if (sheetData.isCollapsible) {
      if (isOpened === sheetData.title.label || isOpened === "all") {
        setShowData(true);
      } else {
        setShowData(false);
      }
    }
  }, [isOpened]);

  return (
    <div className="flex flex-col gap-3">
      <div
        onClick={() => {
          if (sheetData.isCollapsible) {
            setShowData(!showData);
          }
        }}
        className="flex justify-between text-primary cursor-pointer"
      >
        <h1 className="text-base md:text-xl flex items-center">
          {sheetData.isCollapsible && (
            <span className={showData ? "h-fit" : "-rotate-90 h-fit"}>
              <SymbolIcon icon="arrow_drop_down" color="#1E1E2A" size={32} />
            </span>
          )}
          {sheetData.title.label}
        </h1>
        <p className="text-label font-medium md:font-semibold">
          {formatAmount(sheetData.title.value)}
        </p>
      </div>
      {showData && (
        <>
          {sheetData.data.map((data, index) => (
            <div key={index} className="flex justify-between text-muted">
              <p className="text-sm">{data.label}</p>
              <p className="text-sm">
                {formatAmount(data.value)}
              </p>
            </div>
          ))}
          {sheetData.showFooter && sheetData.footerData && (
            <div className="flex justify-between font-semibold text-primary-alt">
              <p className="text-sm">{sheetData.footerData.label}</p>
              <p className="text-sm">
                {formatAmount(sheetData.footerData.value)}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SheetsData;
