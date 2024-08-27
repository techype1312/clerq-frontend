import { cn } from "@/utils/utils";
import React from "react";

const ColumnRoleItem = ({
  label,
  className,
}: {
  label: string;
  row: any;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex max-md:w-fit w-full items-center justify-between",
        className
      )}
    >
      <div
        className="flex flex-col justify-center"
        style={{
          borderRadius: "4px",
          whiteSpace: "nowrap",
          color: "#1e1e2a",
          textTransform: "capitalize",
        }}
      >
        <span
          className="hover:bg-teal-100 max-md:text-xs text-sm text-[12px]"
          style={{
            border: "1px solid #cce8ea",
            borderRadius: "4px",
            padding: "0 8px",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default ColumnRoleItem;
