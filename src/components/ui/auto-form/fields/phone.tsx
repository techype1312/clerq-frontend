import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import { AutoFormInputComponentProps } from "../types";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { country } from "@/utils/constants";

export default function AutoFormPhone({
  label,
  isRequired,
  fieldConfigItem,
  fieldProps,
  form,
}: AutoFormInputComponentProps & { form?: any }) {
  const { showLabel: _showLabel, ...fieldPropsWithoutShowLabel } = fieldProps;
  const showLabel = _showLabel === undefined ? true : _showLabel;
  const baseStyle = {
    outline: "none",
    padding: "0.5rem 1rem 0.5rem 2.8rem",
    border: "1px solid #dcdce4",
    borderRadius: "0.375rem",
    width: "100%",
    height: "2.5rem",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    overflow: "hidden",
  };

  const dropdownStyle = {
    backgroundColor: "#ffffff",
  };

  const disabledStyle = {
    cursor: "not-allowed",
    opacity: 0.5,
    backgroundColor: "#ffffff",
  };

  const inputStyle = {
    ...baseStyle,
    ...(fieldProps.disabled ? disabledStyle : {}),
  };

  return (
    <div className="flex flex-row items-center space-x-2 w-full">
      <FormItem id="phone" className="flex w-full flex-col justify-start">
        {showLabel && (
          <AutoFormLabel
            label={fieldConfigItem?.label || label}
            isRequired={isRequired}
            className={fieldProps.labelclass}
          />
        )}
        <FormControl>
          <PhoneInput
            country="in"
            specialLabel=""
            onlyCountries={country.map((c) => c.toLowerCase())}
            inputProps={{
              placeholder: "(123)-456-7890",
            }}
            inputStyle={inputStyle}
            disabled={fieldProps.disabled}
            onChange={(val, data: CountryData) => {
                form.setValue("country_code", data.dialCode);
                form.setValue("phone", val.slice(data.dialCode.length));
                // fieldPropsWithoutShowLabel.onChange({
                //   country_code: data.dialCode,
                //   phone: val.slice(data.dialCode.length),
                // })
              console.log(form.getValues("country_code"), form.getValues("phone"));
            }}
            value={`${form.getValues("country_code")} ${form.getValues("phone")}`}
            countryCodeEditable={false}
            dropdownStyle={dropdownStyle}
            dropdownClass="bg-white rounded-sm"
            // disablecountry_code={true}
          />
        </FormControl>
        <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
        <FormMessage />
      </FormItem>
    </div>
  );
}
