import React from "react";
import isEmpty from "lodash/isEmpty";
import ProfilePhotoEditModel from "@/components/common/profile-photo";
import ProfileUpdateModal from "@/components/common/ProfileUpdateModal";
import { RowData } from "@/types/general";

const ProfileItem = ({ rowData }: { rowData: RowData }) => {
  const renderValues = () => {
    switch (rowData.type) {
      case "photo":
        return (
          <ProfilePhotoEditModel
            firstName={rowData?.values?.name?.split(' ')?.[0]}
            lastName={rowData?.values?.name?.split(' ')?.[1]}
            photo={rowData?.values?.logo}
            updatePhoto={rowData.actions?.updatePhoto}
            removePhoto={rowData.actions?.removePhoto}
            canEdit={rowData.isEditable}
            showButtons={true}
          />
        );
      default:
        return (
          <div className="flex flex-col min-w-40 md:min-w-56 gap-1 text-sm">
            <span className="text-primary whitespace-break-spaces">
              {rowData.formattedValue}
            </span>
            {rowData.isEditable && !isEmpty(rowData.values) && rowData.schema && !isEmpty(rowData.actions) && (
              <ProfileUpdateModal rowData={rowData} />
            )}
            {/* {rowData.isEditable && rowData.value && (
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
            )} */}
          </div>
        );
    }
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-primary flex flex-col gap-1 w-64">
        <span
          className="text-sm w-2/3 sm:w-full md:text-[15px] font-normal"
        >
          {rowData.label}
        </span>
        {rowData.description && (
          <span className="text-gray-400 w-1/2 sm:w-full text-xs whitespace-break-spaces">
            {rowData.description}
          </span>
        )}
      </div>
      {renderValues()}
    </div>
  );
};

export default ProfileItem;
