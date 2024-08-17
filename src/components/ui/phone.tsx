import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";

export default function InputPhone({
  disabled,
  onChange,
  value,
}: {
  disabled: boolean;
  onChange: (e: any) => void;
  value: string;
}) {
  const baseStyle = {
    outline: "none",
    padding: "0.5rem 1rem",
    border: "1px solid #dcdce4",
    borderRadius: "0.375rem",
    width: "100%",
    height: "2.5rem",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  };

  const disabledStyle = {
    cursor: "not-allowed",
    opacity: 0.5,
    backgroundColor: "#ffffff",
  };

  const inputStyle = {
    ...baseStyle,
    ...(disabled ? disabledStyle : {}),
  };

  return (
    <div className="flex flex-row items-center space-x-2 w-full">
      <div id="phone" className="flex w-full flex-col justify-start">
        <PhoneInput
          country="us"
          specialLabel=""
          onlyCountries={["us"]}
          inputProps={{
            placeholder: "(123)-456-7890",
          }}
          inputStyle={inputStyle}
          disabled={disabled}
          countryCodeEditable={false}
          onChange={onChange}
          value={value}
        />
      </div>
    </div>
  );
}
