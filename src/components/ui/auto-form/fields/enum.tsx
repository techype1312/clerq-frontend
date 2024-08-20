import * as z from "zod";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import {
  Select,
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
          <Select
            onValueChange={field.onChange}
            value={field?.value}
            {...fieldProps}
          >
            <SelectTrigger className={fieldProps.className}>
              <SelectValue placeholder={"Select an option"}>
                {field.value && field.value.trim() !== ""
                  ? findCountryItem(field?.value?.toUpperCase())
                  : "Select an option"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {countryDropdown.map(
                (item: ICountry | undefined, index: number) => (
                  <SelectItem value={item?.isoCode ?? ""} key={index}>
                    {item?.name}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
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
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
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
          </Select>
        </FormControl>
        <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
        <FormMessage />
      </FormItem>
    );
  }
}
