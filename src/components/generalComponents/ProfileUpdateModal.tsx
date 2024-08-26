import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import SymbolIcon from "./MaterialSymbol/SymbolIcon";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AutoForm from "../ui/auto-form";
import { toast } from "react-toastify";
import { DependencyType } from "../ui/auto-form/types";
import { RowData } from "@/types/general";
import { Loader2Icon } from "lucide-react";

const ProfileUpdateModal = ({ rowData }: { rowData: RowData }) => {
  const [schema, setSchema] = useState<any>({});
  const [values, setValues] = useState<any>({});
  const [config, setConfig] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const configId = rowData.id?.includes("address") ? "address" : rowData.id;
    const inputProps =
      rowData.id === "legal_address"
        ? { addressType: "address" }
        : rowData.id === "mailing_address"
        ? { addressType: "mailing_address" }
        : "";
    setConfig({
      [configId]: {
        fieldType: rowData.type,
        label: rowData.label,
        inputProps: inputProps,
      },
    });
    setSchema(rowData.schema);

    if (rowData.id === "dob") {
      setValues({ dob: new Date(rowData.values?.dob) });
    } else {
      setValues(rowData.values);
    }
  }, [rowData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <DialogTitle className="text-left">Edit {rowData.label}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row items-center space-x-2 w-full">
          {schema && values && (
            <AutoForm
              onSubmit={async (values) => {
                if (rowData.id.endsWith("address")) {
                  setLoading(true);
                  return rowData.actions?.onUpdate(values).then((res: any) => {
                    if (res?.status === 200) {
                      setLoading(false);
                      setOpen(false);
                      toast.success(`Successfully updated ${rowData.label}`, {
                        position: "bottom-center",
                        hideProgressBar: true,
                      });
                    }
                  });
                } else {
                  setLoading(true);
                  return rowData.actions?.onUpdate(values).then((res: any) => {
                    if (res?.status === 200) {
                      setLoading(false);
                      setOpen(false);
                      toast.success(`Successfully updated ${rowData.label}`, {
                        position: "bottom-center",
                        hideProgressBar: true,
                      });
                    }
                  });
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
                  sourceField: `address.address_line_1`,
                  type: DependencyType.HIDES,
                  targetField: "address_id",
                  when: () => {
                    return true;
                  },
                },
                {
                  sourceField: `country_code`,
                  type: DependencyType.HIDES,
                  targetField: "country_code",
                  when: () => {
                    return true;
                  },
                },
              ]}
              defaultValues={{
                address: {
                  country: "US",
                },
              }}
            >
              <div className="w-full flex flex-row gap-4 justify-end items-center !mt-5">
                <DialogClose asChild disabled={loading}>
                  <Button className="text-primary" variant="outline">
                    Close
                  </Button>
                </DialogClose>
                <Button
                  className="background-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading && <Loader2Icon className="animate-spin" />}
                  Save
                </Button>
              </div>
            </AutoForm>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileUpdateModal;
