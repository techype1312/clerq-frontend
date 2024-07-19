// import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
// import AutoFormLabel from "./auto-form/common/label";
// import AutoFormTooltip from "./auto-form/common/label";
// import { AutoFormInputComponentProps } from "./auto-form/types";
// import { DayPicker } from "react-day-picker";

// export default function AutoFormDate({
//   label,
//   isRequired,
//   field,
//   fieldConfigItem,
//   fieldProps,
//   titleDisabled,
// }: AutoFormInputComponentProps & { titleDisabled?: unknown }) {
//   return (
//     <FormItem className="flex flex-col gap-2">
//       <AutoFormLabel
//         label={fieldConfigItem?.label || label}
//         isRequired={isRequired}
//       />
//       <FormControl>
//         {/* <DatePicker
//           date={field.value}
//           setDate={field.onChange}
//           disabled={titleDisabled}
//           {...fieldProps}
//         /> */}

//         <DayPicker
//           mode="single"
//           selected={field.value}
//           onSelect={field.onChange}
//           {...fieldProps}
//         />
//       </FormControl>
//       <AutoFormTooltip fieldConfigItem={fieldConfigItem} />

//       <FormMessage />
//     </FormItem>
//   );
// }
