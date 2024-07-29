import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import {
  AutoFormInputComponentProps,
  FieldConfig,
  FieldConfigItem,
} from "../types";
import { Button } from "../../button";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AutoFormObject from "./object";
import { z } from "zod";
import { ControllerRenderProps, FieldValues, useForm } from "react-hook-form";

type AutoFormModalComponentProps = {
  label: string;
  item: z.ZodObject<any, any>;
  form: ReturnType<typeof useForm>;
  fieldConfig?: FieldConfig<z.infer<z.ZodObject<any, any>>>;
  zodItemClass?: string;
  path: string[];
  name: string;
  labelClass?: string;
  isPresent?: boolean;
};

export default function AutoFormModal({
  label,
  item,
  form,
  fieldConfig,
  zodItemClass,
  path = [],
  name,
  labelClass,
  isPresent = false
}: AutoFormModalComponentProps) {
  const [saved, setSaved] = useState(false);
  // const [oldState, setOldState] = useState<any>();
  // const [update, setUpdate] = useState(false);
  // useEffect(() => {
  //   if(update) {
  //     const value = form.getValues();
  //     console.log(value)
  //     setOldState(value);
  //   }
  // }, [update]);
  useEffect(()=>{
    if(isPresent){
      setSaved(true);
    }
  },[isPresent])
  return (
    <>
      <div className="flex flex-row items-center space-x-2 w-full">
        <FormItem className="flex w-full flex-col justify-start">
          <FormControl>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  className="background-muted text-background-primary hover:!background-muted "
                  variant={"ghost"}
                  // onClick={() => {
                  //   setUpdate(!update);
                  // }}
                >
                  {saved ? "Edit" : "Add"} {label?.toLowerCase()}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add {label}</DialogTitle>
                </DialogHeader>
                <AutoFormObject
                  schema={item as unknown as z.ZodObject<any, any>}
                  form={form}
                  fieldConfig={
                    (fieldConfig?.[name] ?? {}) as FieldConfig<
                      z.infer<typeof item>
                    >
                  }
                  path={[name]}
                  innerClassName={zodItemClass}
                  labelClass={labelClass}
                />
                <DialogFooter className="mr-auto my-2 h-12 flex gap-2">
                  <DialogClose asChild>
                    {/* 
                    Disabling the cancel button right now as for some reason it's not working as I want it to.
                    I want it to reset the form to the previous state but it's not working.
                    <Button
                      type="button"
                      variant="ghost"
                      className="background-muted text-label hover:!background-muted h-12 px-10 rounded-full"
                       onClick={() => {
                         console.log(name, oldState);
                         setUpdate(false);
                         form.setValue(name, oldState);
                       }}
                    >
                      Close
                    </Button> */}
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        setSaved(true);
                        // setUpdate(false);
                      }}
                      type="button"
                      className="background-primary px-10 rounded-full h-12"
                    >
                      {saved ? "Save changes" : "Add"}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* <Button
              onClick={() => setIsOpen(true)}
              className="background-muted text-background-primary hover:!background-muted "
              variant={"ghost"}
            >
              Add {fieldConfigItem?.label || label}
            </Button> */}
          </FormControl>
          <FormMessage />
        </FormItem>
      </div>
    </>
  );
}
