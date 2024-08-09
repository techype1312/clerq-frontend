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
  const [month, setMonth] = useState<Date | null>();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsEdit(false);
      }
    };
    setMonth(field.value);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  console.log("field", field.value);
  return (
    <FormItem className="flex flex-col gap-2" ref={dropdownRef}>
      <AutoFormLabel
        label={fieldConfigItem?.label || label}
        isRequired={isRequired}
        className={fieldProps.labelclass}
      />
      <FormControl>
        <div className="relative">
          <div
            className="border p-2 rounded-md cursor-pointer text-sm"
            onClick={() => setIsEdit(!isEdit)}
          >
            {field?.value && format(field?.value, "yyyy-MM-dd")}
            {!field.value && <p className="text-muted">1990-01-01</p>}
          </div>
          {isEdit && (
            <div className="absolute z-10 bg-white border ">
              <DayPicker
                mode="single"
                month={month}
                onMonthChange={setMonth}
                selected={field.value}
                onSelect={field.onChange}
                showOutsideDays
                fixedWeeks
                captionLayout="dropdown-buttons"
                fromYear={1900}
                toYear={year}
                value={field.value}
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
