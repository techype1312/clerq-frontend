import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import { AutoFormInputComponentProps } from "../types";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";

export default function AutoFormDate({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
  titleDisabled,
}: AutoFormInputComponentProps & { titleDisabled?: unknown }) {
  const [isEdit, setIsEdit] = useState(false);
  const dropdownRef = useRef<any>();
  const year = new Date().getFullYear();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsEdit(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <FormItem className="flex flex-col gap-2" ref={dropdownRef}>
      <AutoFormLabel
        label={fieldConfigItem?.label || label}
        isRequired={isRequired}
      />
      <FormControl>
        <div className="relative">
          <div
            className="border p-2 rounded-md cursor-pointer"
            onClick={() => setIsEdit(!isEdit)}
          >
            {field.value ? format(field.value, "yyyy-MM-dd") : "Pick a date!"}
          </div>
          {isEdit && (
            <div className="absolute z-10 bg-white border ">
              <DayPicker
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                showOutsideDays
                fixedWeeks
                captionLayout="dropdown-buttons"
                fromYear={1900}
                toYear={year}
                {...fieldProps}
              />
            </div>
          )}
        </div>
      </FormControl>
      <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
      <FormMessage />
    </FormItem>
  );
}
