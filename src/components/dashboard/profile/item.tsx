import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import ProfileModal from "@/components/generalComponents/ProfileModal";
import ProfilePhoto from "@/components/profile-photo";
import React from "react";

export type RowData = {
  id: string;
  title: string;
  description?: string;
  value: any;
  type?: string;
  unFormattedValue?: any;
  isEditable: boolean;
  actions: Record<string, (data?: any) => Promise<false | void>>;
};

const ProfileItem = ({ rowData }: { rowData: RowData }) => {
  const renderValues = () => {
    switch (rowData.type) {
      case "photo":
        return (
          <ProfilePhoto
            firstName={rowData?.value?.name}
            photo={rowData?.value?.logo}
            updatePhoto={rowData.actions?.updatePhoto}
            removePhoto={rowData.actions?.removePhoto}
            canEdit={rowData.isEditable}
            showButtons={true}
          />
        );
      default:
        return (
          <div className="flex flex-col min-w-56 gap-1">
            <span className="text-primary whitespace-break-spaces">
              {rowData.value}
            </span>
            {rowData.isEditable && rowData.value && (
              <ProfileModal rowData={rowData} />
            )}
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
        );
    }
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-primary flex flex-col gap-1 w-64">
        <span
          style={{ fontSize: "15px", fontWeight: 400, lineHeight: "24px " }}
        >
          {rowData.title}
        </span>
        {rowData.description && (
          <span className="text-gray-400 text-xs whitespace-break-spaces">
            {rowData.description}
          </span>
        )}
      </div>
      {renderValues()}
    </div>
  );
};

export default ProfileItem;
