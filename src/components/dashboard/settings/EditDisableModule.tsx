import React from "react";

type moduleData = {
  title: string;
  description?: string;
  showEdit?: boolean;
  showDisable?: boolean;
  status?: boolean; // true for Active, false for Inactive
};

const EditDisableModule = ({ moduleData }: { moduleData: moduleData }) => {
  return (
    <div className="flex flex-col gap-1 border-b pb-4 border-muted">
      <div className="flex w-full justify-between">
        <h1 className="text-primary">{moduleData.title}</h1>
        <div className="flex">
          <span
            className={`${
              moduleData.status === true ? "bg-[#CFF7E6] text-[#07603A]" : "text-destructive background-muted"
            } py-1 px-3 rounded-md`}
          >
            {moduleData.status === true ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
      <p className="text-muted w-1/2 text-sm">{moduleData.description}</p>
      <div className="flex gap-4 mt-5">
        {moduleData.showEdit && (
          <button className="text-label background-muted px-5 py-1 rounded-full text-sm">
            Edit
          </button>
        )}
        {moduleData.showDisable && (
          <button className="text-destructive background-muted px-5 py-1 rounded-full text-sm">
            Disable
          </button>
        )}
      </div>
    </div>
  );
};

export default EditDisableModule;
