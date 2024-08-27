import { DEFAULT_COUNTRY_CODE, enabledCountries } from "@/utils/constants";
import PhoneInput from "react-phone-input-2";

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
          country={DEFAULT_COUNTRY_CODE.toLowerCase()}
          specialLabel=""
          onlyCountries={enabledCountries.map((c) => c.toLowerCase())}
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
