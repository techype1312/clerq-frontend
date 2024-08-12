import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import { format } from "date-fns";
import React from "react";

export type rowData = {
  id: string;
  title: string;
  description?: string;
  value: string;
  type?: string;
  isEditable: boolean;
};

const ProfileItem = ({ rowData }: { rowData: rowData }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-primary flex flex-col gap-1 w-64">
        <span
          style={{ fontSize: "15px", fontWeight: 400, lineHeight: "24px " }}
        >
          {rowData.title}
        </span>
        {rowData.description && (
          <span
            style={{
              fontSize: "14px",
              lineHeight: "20px",
              color: "#363644",
              whiteSpace: "break-spaces",
            }}
          >
            {rowData.description}
          </span>
        )}
      </div>
      <div className="flex flex-col min-w-56 gap-1">
        <span className="text-primary whitespace-break-spaces">
          {rowData.value}
        </span>
        {rowData.isEditable && rowData.value && (
          <button className="flex items-center text-background-primary gap-1">
            <span>Edit</span>
            <SymbolIcon icon="chevron_right" color="#5265EB" size={20} />
          </button>
        )}
        {rowData.isEditable && !rowData.value && (
          <button className="flex items-center text-background-primary gap-1">
            <span>Add</span>
            <SymbolIcon icon="chevron_right" color="#5265EB" size={20} />
        </button>
        )}
      </div>
    </div>
  );
};

export default ProfileItem;
