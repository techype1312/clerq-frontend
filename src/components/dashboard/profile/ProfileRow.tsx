import React from "react";

export type rowData = {
  title: string;
  value: string[];
  isEditable: boolean;
};

const ProfileRow = ({ rowData }: { rowData: rowData }) => {
  return (
    <div className="grid grid-cols-3">
      <div className="text-primary">{rowData.title}</div>
      {rowData.value.map((value, index) => (
        <div className="flex flex-col h-16" key={value + index}>
          <span className="text-primary">{value}</span>
          <span>
            {rowData.isEditable && (
              <button className="text-background-primary">Edit</button>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProfileRow;
