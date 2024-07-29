import { format } from "date-fns";
import { useForm, useFormContext } from "react-hook-form";
import * as z from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { cn } from "@/utils/utils";
import { DEFAULT_ZOD_HANDLERS, INPUT_COMPONENTS } from "../config";
import resolveDependencies from "../dependencies";
import { Dependency, FieldConfig, FieldConfigItem } from "../types";
import {
  beautifyObjectName,
  getBaseSchema,
  getBaseType,
  zodToHtmlInputProps,
} from "../utils";
import AutoFormArray from "./array";
import AutoFormModal from "./modal";

function DefaultParent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export type SchemaType = z.ZodObject<any, any>;

export default function AutoFormObject<
  SchemaType extends z.ZodObject<any, any>
>({
  schema,
  form,
  fieldConfig,
  path = [],
  dependencies = [],
  innerClassName,
  edit = true,
  zodItemClass,
  labelClass,
}: {
  schema: SchemaType | z.ZodEffects<SchemaType>;
  form: ReturnType<typeof useForm>;
  fieldConfig?: FieldConfig<z.infer<SchemaType>>;
  path?: string[];
  dependencies?: Dependency<z.infer<SchemaType>>[];
  innerClassName?: string;
  edit?: boolean;
  zodItemClass?: string;
  labelClass?: string;
}) {
  const { watch } = useFormContext(); // Use useFormContext to access the watch function

  if (!schema) {
    return null;
  }
  const { shape } = getBaseSchema<SchemaType>(schema) || {};

  if (!shape) {
    return null;
  }

  const handleIfZodNumber = (item: z.ZodAny) => {
    const isZodNumber = (item as any)._def.typeName === "ZodNumber";
    const isInnerZodNumber =
      (item._def as any).innerType?._def?.typeName === "ZodNumber";

    if (isZodNumber) {
      (item as any)._def.coerce = true;
    } else if (isInnerZodNumber) {
      (item._def as any).innerType._def.coerce = true;
    }

    return item;
  };

  return (
    <Accordion
      type="multiple"
      className={cn("space-y-5 border-none", innerClassName)}
    >
      {Object.keys(shape).map((name) => {
        let item = shape[name] as z.ZodAny;
        item = handleIfZodNumber(item) as z.ZodAny;
        const zodBaseType = getBaseType(item);
        const itemName = item._def.description ?? beautifyObjectName(name);
        const key = [...path, name].join(".");
        const fieldConfigItem: FieldConfigItem = fieldConfig?.[name] ?? {};
        // TODO: Leverage more openapi fields to power fieldConfig here
        fieldConfigItem.label = fieldConfigItem.label;
        const {
          isHidden,
          isDisabled,
          isRequired: isRequiredByDependency,
          overrideOptions,
        } = resolveDependencies(dependencies, name, watch);
        if (isHidden) {
          return null;
        }

        if (
          zodBaseType === "ZodObject" &&
          fieldConfigItem.fieldType !== "modal"
        ) {
          return (
            <AccordionItem value={name} key={key} className="border-none mt-0">
              <AutoFormObject
                schema={item as unknown as z.ZodObject<any, any>}
                form={form}
                fieldConfig={
                  (fieldConfig?.[name] ?? {}) as FieldConfig<
                    z.infer<typeof item>
                  >
                }
                path={[...path, name]}
                innerClassName={zodItemClass}
                labelClass={labelClass}
              />
            </AccordionItem>
          );
        }
        if (
          zodBaseType === "ZodObject" &&
          fieldConfigItem.fieldType === "modal"
        ) {
          return (
            <AccordionItem value={name} key={key} className="border-none mt-0">
              {/* Bug: For modals the variable needs to be named without snake_case (haven't tested camelCase) i.e. company_address is invalid and address is valid */}
              <AutoFormModal
                name={name}
                item={item as unknown as z.ZodObject<any, any>}
                form={form}
                fieldConfig={fieldConfig}
                label={fieldConfigItem.label ?? itemName}
                path={[...path, name]}
                labelClass={labelClass}
                isPresent={fieldConfigItem.inputProps?.isPresent}
              />
            </AccordionItem>
          );
        }
        // if (zodBaseType === "ZodArray") {
        //   return (
        //     <AutoFormArray
        //       key={key}
        //       name={name}
        //       item={item as unknown as z.ZodArray<any>}
        //       form={form}
        //       fieldConfig={fieldConfig?.[name] ?? {}}
        //       path={[...path, name]}
        //     />
        //   );
        // }
        const zodInputProps = zodToHtmlInputProps(item);
        const isRequired =
          isRequiredByDependency ||
          zodInputProps.required ||
          fieldConfigItem.inputProps?.required ||
          false;

        if (overrideOptions) {
          item = z.enum(overrideOptions) as unknown as z.ZodAny;
        }

        return (
          <FormField
            control={form.control}
            name={key}
            key={key}
            render={({ field }) => {
              const inputType =
                fieldConfigItem.fieldType ??
                DEFAULT_ZOD_HANDLERS[zodBaseType] ??
                "fallback";

              const InputComponent =
                typeof inputType === "function"
                  ? inputType
                  : INPUT_COMPONENTS[inputType];

              const ParentElement =
                fieldConfigItem.renderParent ?? DefaultParent;

              const defaultValue = fieldConfigItem.inputProps?.defaultValue;
              const value = field.value ?? defaultValue ?? "";

              const fieldProps = {
                ...zodToHtmlInputProps(item),
                ...field,
                ...fieldConfigItem.inputProps,
                disabled: fieldConfigItem.inputProps?.disabled || isDisabled,
                ref: undefined,
                value: value,
                labelclass: labelClass,
              };

              if (InputComponent === undefined) {
                return <></>;
              }
              return (
                <ParentElement key={`${key}.parent`}>
                  {edit ? (
                    <>
                      <InputComponent
                        zodInputProps={zodInputProps}
                        field={field}
                        fieldConfigItem={fieldConfigItem}
                        label={itemName}
                        isRequired={isRequired}
                        zodItem={item}
                        fieldProps={fieldProps}
                        className={fieldProps.className}
                      />
                    </>
                  ) : (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className={labelClass}>{itemName}</FormLabel>
                      {zodBaseType === "ZodDate"
                        ? field.value
                          ? format(field.value, "PPP")
                          : "-"
                        : zodBaseType === "ZodBoolean"
                        ? field.value === true
                          ? "Yes"
                          : "No"
                        : field.value === "" || field.value === undefined
                        ? "-"
                        : field.value}
                    </FormItem>
                  )}
                </ParentElement>
              );
            }}
          />
        );
      })}
    </Accordion>
  );
}
