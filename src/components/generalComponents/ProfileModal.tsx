import React, { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import SymbolIcon from "./MaterialSymbol/SymbolIcon";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import AutoForm from "../ui/auto-form";
import { z } from "zod";
import { mergeJsonArray } from "@/utils/utils";
import AuthApis from "@/actions/apis/AuthApis";
import { UserContext } from "@/context/User";
import { toast } from "react-toastify";
import { addressSchema } from "@/types/schema-embedded";
import { DependencyType } from "../ui/auto-form/types";

const ProfileModal = ({ rowData }: { rowData: any }) => {
  const [schema, setSchema] = useState<any>({});
  const [values, setValues] = useState<any>({});
  const [config, setConfig] = useState<any>({});
  const { updateLocalUserData } = useContext(UserContext);
  useEffect(() => {
    if (rowData.title === "Preferred name")
      setSchema(z.object({ firstName: z.string(), lastName: z.string() }));
    else if (rowData.id === "dob") {
      setSchema(
        z.object({
          dob: z
            .date()
            .min(new Date("1900-01-01"), {
              message: "A valid date of birth is required",
            })
            .refine(
              (value) =>
                value <
                new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
              {
                message: "Date of birth cannot be less than 18 years ago",
              }
            ),
        })
      );
    } else if (rowData.id === "phone")
      setSchema(z.object({ phone: z.string() }));
    else if (rowData.id === "address" || rowData.id === "mailing_address") {
      setSchema(addressSchema);
    }
    setConfig({
      [rowData.id]: {
        fieldType: rowData.type,
        label: rowData.title,
      },
    });
    if (rowData.id === "address" || rowData.id === "mailing_address") {
      return setValues({
        address: {
          address_line_1: rowData.unFormattedValue.address_line_1,
          address_line_2: rowData.unFormattedValue.address_line_2,
          city: rowData.unFormattedValue.city,
          state: rowData.unFormattedValue.state,
          postal_code: rowData.unFormattedValue.postal_code,
          country: "United States",
        },
        address_id: rowData.unFormattedValue.id,
      });
    } else {
      let updateIds: string[] = [];
      let updateValues: string[] = [];
      if (rowData.id.split(",").length > 0) {
        updateIds = rowData.id?.split(",");
        updateValues = rowData.value?.split(" ");
      } else {
        updateIds = [rowData.id];
        updateValues = [rowData.value];
      }
      const newValues = updateIds?.map((id, index) => {
        if (id.trim() === "dob") {
          return { [id.trim()]: new Date(updateValues[index]) };
        } else {
          return { [id.trim()]: updateValues[index] };
        }
      });
      setValues(mergeJsonArray(newValues));
    }
  }, [rowData]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="w-fit pl-0 hover:bg-transparent flex items-center text-background-primary gap-1"
        >
          <span>Edit</span>
          <SymbolIcon icon="chevron_right" color="#5265EB" size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="">Edit {rowData.title}</div>
        </DialogHeader>
        <div className="flex flex-row items-center space-x-2 w-full">
          {schema && values && (
            <AutoForm
              onSubmit={async (values) => {
                if (
                  rowData.id === "address" ||
                  rowData.id === "mailing_address"
                ) {
                  return;
                } else {
                  const res = await AuthApis.updateUser(values);
                  if (res.status === 200) {
                    toast.success(`Successfully updated ${rowData.title}`);
                    updateLocalUserData(res.data);
                  }
                }
              }}
              formSchema={schema}
              values={values}
              fieldConfig={config}
              dependencies={[
                {
                  sourceField: "address_id",
                  type: DependencyType.HIDES,
                  targetField: "address_id",
                  when: () => {
                    return true;
                  },
                },
                {
                  sourceField: "address.address_line_1",
                  type: DependencyType.HIDES,
                  targetField: "address_id",
                  when: () => {
                    return true;
                  },
                },
              ]}
            >
              <DialogClose asChild>
                <Button className="background-primary " type="submit">
                  Save
                </Button>
              </DialogClose>
            </AutoForm>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
