import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import SymbolIcon from "../common/MaterialSymbol/SymbolIcon";
import { Input } from "./input";
import { Button } from "./button";
import { toast } from "react-toastify";

const FormSelect = ({
  baseValues,
  field,
  fieldConfigItem,
  fieldProps,
  value,
  setValues,
}: {
  baseValues: string[];
  field: any;
  fieldConfigItem: any;
  fieldProps: any;
  value: string[];
  setValues: (value: string[]) => void;
}) => {
  function findItem(value: any) {
    return values.find((item) => item[0] === value);
  }
  let values: [string, string][] = [];
  if (!Array.isArray(baseValues) && baseValues) {
    values = Object.entries(baseValues);
  } else {
    values = baseValues?.map((value) => [value, value]);
  }
  const [selectedValues, setSelectedValues] = React.useState<string[]>(value);
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const [customValue, setCustomValue] = React.useState("");
  return (
    <div className="w-full flex flex-col gap-4">
      {showCustomInput ? (
        <div className="flex gap-2">
          <Input
            name="customValue"
            placeholder="Add a custom value"
            onChange={(e) => setCustomValue(e.target.value)}
            value={customValue}
          />
          <Button
            onClick={() => {
              // if (customValue === "") return;
              // else if (selectedValues.includes(customValue)) return;
              // else {
                field.onChange([...selectedValues, customValue]);
                setSelectedValues([...selectedValues, customValue]);
                setValues([...value, customValue]);
                setCustomValue("");
                setShowCustomInput(false);
            }}
            variant="ghost"
            className="text-label background-muted border border-input "
          >
            Add
          </Button>
        </div>
      ) : (
        <Select
          onValueChange={(e) => {
            if (e === "Other") {
              setShowCustomInput(true);
            } else {
              field.onChange([...selectedValues, e]);
              setSelectedValues([...selectedValues, e]);
              setValues([...value, e]);
            }
          }}
          multiple
          defaultValue={field.value}
          //   value={field.value}
          {...fieldProps}
        >
          <SelectTrigger className={fieldProps.className}>
            <SelectValue placeholder={fieldConfigItem.inputProps?.placeholder}>
              {field.value ? findItem(field.value)?.[1] : "Select an option"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {values
              ?.filter(([value, label]) => !selectedValues.includes(value))
              .map(([value, label], index) => (
                <SelectItem value={label ?? "undefined"} key={value + index}>
                  {label ?? "Undefined value"}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}
      <div className="flex gap-4 flex-wrap">
        {selectedValues?.map((value: string, index) => (
          <div
            className="bg-muted flex gap-2 w-fit py-1 px-4 rounded-md"
            key={value + index}
          >
            <p className="text-label">{value}</p>
            <span
              className="cursor-pointer"
              onClick={() => {
                setSelectedValues(
                  selectedValues.filter((val) => val !== value)
                );
                setValues(selectedValues.filter((val) => val !== value));
                field.value = selectedValues;
              }}
            >
              <SymbolIcon icon="close" color="#535460" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormSelect;
