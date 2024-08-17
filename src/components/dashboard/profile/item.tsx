import AuthApis from "@/actions/apis/AuthApis";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import ProfileModal from "@/components/generalComponents/ProfileModal";
import SocialModal from "@/components/generalComponents/SocialModal";
import AutoForm from "@/components/ui/auto-form";
import { DependencyType } from "@/components/ui/auto-form/types";
import FormDate from "@/components/ui/date";
import { Input } from "@/components/ui/input";
import InputPhone from "@/components/ui/phone";
import { addressSchema } from "@/types/schema-embedded";
import { mergeJsonArray } from "@/utils/utils";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export type rowData = {
  id: string;
  title: string;
  description?: string;
  value: any;
  type?: string;
  unFormattedValue?: any;
  isEditable: boolean;
};


const ProfileItem = ({
  rowData,
  updateLocalUserData,
  editButton,
}: {
  rowData: rowData;
  updateLocalUserData: any;
  editButton?: any;
}) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (rowData.id !== "social") setValue(rowData.value);
  }, [rowData.id, rowData.value]);

  // console.log(rowData?.unFormattedValue);

  // const handleSave = async () => {
  //   let updateIds: string[] = [];
  //   let updateValues: string[] = [];
  //   if (rowData.id.split(",").length > 0) {
  //     updateIds = rowData.id?.split(",");
  //     updateValues = value?.split(" ");
  //     console.log(updateIds, updateValues, "here");
  //   } else {
  //     updateIds = [rowData.id];
  //     updateValues = [value];
  //     console.log(updateValues);
  //   }
  //   const newValues = updateIds?.map((id, index) => {
  //     return { [id.trim()]: updateValues[index] };
  //   });
  //   const res = await AuthApis.updateUser(mergeJsonArray(newValues));
  //   if (res && res.status === 200) {
  //     updateLocalUserData(res.data);
  //     toast.success("Successfully updated " + rowData.title);
  //   }
  // };

  return (
    <div className="grid grid-cols-2 gap-4">
      {rowData.id === "social" ? (
        <SocialModal
          rowData={rowData}
          updateLocalUserData={updateLocalUserData}
        />
      ) : (
        <>
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
            {editButton && editButton}
            {rowData.isEditable && rowData.value && (
              <ProfileModal rowData={rowData} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileItem;
