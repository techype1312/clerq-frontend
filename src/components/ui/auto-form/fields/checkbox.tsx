import {Checkbox} from '@/components/ui/checkbox'
import {FormControl, FormItem, FormMessage} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../select'
import AutoFormLabel from '../common/label'
import AutoFormTooltip from '../common/tooltip'
import {AutoFormInputComponentProps} from '../types'

export default function AutoFormCheckbox({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  return (
    <FormItem className="flex flex-col">
      <AutoFormLabel
        label={fieldConfigItem?.label || label}
        isRequired={isRequired}
      />
      <FormControl>
        <Select
          onValueChange={(value) =>
            field.onChange(value === 'Yes' ? true : false)
          }
          defaultValue={field.value}
          {...fieldProps}>
          <SelectTrigger className={fieldProps.className}>
            <SelectValue placeholder={fieldConfigItem.inputProps?.placeholder}>
              {field.value ? 'Yes' : 'No'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'Yes'} key={'Yes'}>
              Yes
            </SelectItem>
            <SelectItem value={'No'} key={'No'}>
              No
            </SelectItem>
          </SelectContent>
        </Select>
      </FormControl>
      <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
      <FormMessage />
    </FormItem>
  )
}
// <div>
//   <FormItem>
//     <div className="mb-3 flex items-center gap-3">
//       <FormControl>
//         <Checkbox
//           checked={field.value}
//           onCheckedChange={field.onChange}
//           {...fieldProps}
//         />
//       </FormControl>
//       <AutoFormLabel
//         label={fieldConfigItem?.label || label}
//         isRequired={isRequired}
//       />
//     </div>
//   </FormItem>
//   <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
// </div>
