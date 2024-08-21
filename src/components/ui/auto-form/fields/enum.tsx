import * as z from "zod";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import {
  Select as RadixSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import { AutoFormInputComponentProps } from "../types";
import { getBaseSchema } from "../utils";
import { Country, ICountry } from "country-state-city";
import { country, countryDropdown } from "@/utils/constants";
import { useEffect, useState } from "react";
import { findCountryItem } from "@/utils/utils";

export default function AutoFormEnum({
  label,
  isRequired,
  field,
  fieldConfigItem,
  zodItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  const baseValues = (getBaseSchema(zodItem) as unknown as z.ZodEnum<any>)._def
    .values;

  let values: [string, string][] = [];
  if (!Array.isArray(baseValues)) {
    values = Object.entries(baseValues);
  } else {
    values = baseValues.map((value) => [value, value]);
  }

  function findItem(value: any) {
    return values.find((item) => item[0] === value);
  }
  const [countryValue, setCountryValue] = useState<string | undefined>("US");
  const [countryDisplay, setCountryDisplay] = useState<string | undefined>(
    "United States"
  );
  useEffect(() => {
    if (typeof field.value === "string") {
      setCountryValue(field.value);
      setCountryDisplay(findCountryItem(field.value?.toUpperCase()));
    }
  }, [countryDisplay, field.value]);

  if (
    field.name.endsWith("address.country") ||
    field.name === "tax_residence_country"
  ) {
    return (
      <FormItem className="flex flex-col">
        <AutoFormLabel
          label={fieldConfigItem?.label || label}
          isRequired={isRequired}
          className={fieldProps.labelclass}
        />
        <FormControl>
          <RadixSelect
            onValueChange={field.onChange}
            value={countryValue}
            {...fieldProps}
          >
            <SelectTrigger className={fieldProps.className}>
              <SelectValue placeholder={countryDisplay ?? "Select an option"}>
                {countryDisplay && countryDisplay.trim() !== ""
                  ? countryDisplay
                  : "Select an option"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {countryDropdown?.map(
                (item: ICountry | undefined, index: number) => {
                  return (
                    <SelectItem
                      value={item?.isoCode ?? ""}
                      key={item?.isoCode ?? ""}
                    >
                      {item?.name}
                    </SelectItem>
                  );
                }
              )}
            </SelectContent>
          </RadixSelect>
        </FormControl>
        <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
        <FormMessage />
      </FormItem>
    );
  } else {
    return (
      <FormItem className="flex flex-col">
        <AutoFormLabel
          label={fieldConfigItem?.label || label}
          isRequired={isRequired}
          className={fieldProps.labelclass}
        />
        <FormControl>
          <RadixSelect
            onValueChange={field.onChange}
            value={field.value}
            {...fieldProps}
          >
            <SelectTrigger className={fieldProps.className}>
              <SelectValue
                placeholder={fieldConfigItem.inputProps?.placeholder}
              >
                {field.value ? findItem(field.value)?.[1] : "Select an option"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {values.map(([value, label]) => (
                <SelectItem value={label} key={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </RadixSelect>
        </FormControl>
        <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
        <FormMessage />
      </FormItem>
    );
  }
}
