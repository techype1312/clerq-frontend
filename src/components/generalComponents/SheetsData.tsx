//This component will be used to display the data on Income statement and Balance sheet pages
import React, { useEffect } from "react";
import { sheetDataType } from "@/types/general";
import SymbolIcon from "./MaterialSymbol/SymbolIcon";

const SheetsData = ({
  sheetData,
  isOpened,
}: {
  sheetData: sheetDataType;
  isOpened?: string;
}) => {
  const [showData, setShowData] = React.useState<boolean>(
    sheetData.isCollapsible ? false : true
  );
  useEffect(() => {
    if (sheetData.isCollapsible) {
      if (isOpened === sheetData.title.title || isOpened === "all") {
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
        <h1 className="text-xl flex items-center">
          {sheetData.isCollapsible && (
            <span className={showData ? "h-fit" : "-rotate-90 h-fit"}>
              <SymbolIcon icon="arrow_drop_down" color="#1E1E2A" size={32} />
            </span>
          )}
          {sheetData.title.title}
        </h1>
        <p className="text-label font-semibold">
          {sheetData.title.value < 0 && "-"}$
          {Math.abs(sheetData.title.value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
      {showData && (
        <>
          {sheetData.data.map((data, index) => (
            <div key={index} className="flex justify-between text-muted">
              <p className="text-sm">{data.title}</p>
              <p className="text-sm">
                {data.value < 0 && "-"}$
                {Math.abs(data.value).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          ))}
          {sheetData.showFooter && sheetData.footerData && (
            <div className="flex justify-between font-semibold text-primary-alt">
              <p className="text-sm">{sheetData.footerData.title}</p>
              <p className="text-sm">
                {sheetData.footerData.value < 0 && "-"}$
                {Math.abs(sheetData.footerData.value).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SheetsData;
