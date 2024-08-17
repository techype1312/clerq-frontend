import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import { AutoFormInputComponentProps } from "../types";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function AutoFormPhone({
  label,
  isRequired,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) {
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
            country="us"
            specialLabel=""
            onlyCountries={["us"]}
            inputProps={{
              placeholder: "(123)-456-7890",
            }}
            inputStyle={inputStyle}
            disabled={fieldProps.disabled}
            onChange={(e) => {
              fieldPropsWithoutShowLabel.onChange(e);
            }}
            value={fieldPropsWithoutShowLabel.value}
            dropdownStyle={dropdownStyle}
            dropdownClass="bg-white rounded-sm"
          />
        </FormControl>
        <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
        <FormMessage />
      </FormItem>
    </div>
  );
}
