import { format } from "date-fns";
import React from "react";

export type rowData = {
  title: string;
  value: string[];
  isEditable: boolean;
  type?: string;
};

const ProfileRow = ({ rowData }: { rowData: rowData }) => {
  return (
    <div className="grid grid-cols-3">
      <div className="text-primary">{rowData.title}</div>
      {rowData.value.map((value, index) => (
        <div className="flex flex-col h-16" key={index}>
          {rowData.type === "date" ? (
            <span className="text-primary">
              {format(value, "MMMM d, yyyy")}
            </span>
          ) : (
            <>
              {rowData.type === "social" ? (
                <button className="text-background-primary text-left">
                  Add another
                </button>
              ) : (
                <>
                  {rowData.type === "social-link" ? (
                    <span className="text-primary">@{value.split("/")[3]}</span>
                  ) : (
                    <span className="text-primary">
                      {rowData.type === "phone" && "+"}
                      {value}
                    </span>
                  )}
                </>
              )}
            </>
          )}
          <span>
            {rowData.isEditable && value && (
              <button className="text-background-primary">Edit</button>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProfileRow;
