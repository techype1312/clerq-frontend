"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import React from "react";
import {
  DeepPartial,
  DefaultValues,
  FormState,
  useForm,
  useFormState,
} from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormMessage } from "@/components/ui/form";
import { cn, formatFilterId } from "@/utils/utils";
import AutoFormObject from "./fields/object";
import { Dependency, FieldConfig } from "./types";
import {
  getDefaultValues,
  getObjectFormSchema,
  ZodObjectOrWrapped,
} from "./utils";

/** copied from react-hook-form as it is not exposed but should be */
type AsyncDefaultValues<TFieldValues> = (
  payload?: unknown
) => Promise<TFieldValues>;

export function AutoFormSubmit({
  children,
  className,
  disabled,
}: {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const formState = useFormState();
  return (
    <Button
      type="submit"
      disabled={disabled || formState.isSubmitting}
      className={cn("md:mx-0 px-20 md:px-10", className)}
    >
      {formState.isSubmitting ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        children ?? "Submit"
      )}
    </Button>
  );
}

function AutoForm<SchemaType extends ZodObjectOrWrapped>({
  formSchema,
  values: valuesProp,
  onValuesChange: onValuesChangeProp,
  onParsedValuesChange,
  onSubmit: onSubmitProp,
  fieldConfig,
  children,
  className,
  innerClassName,
  dependencies,
  edit = true,
  defaultValues: _defaultValues,
  withSubmitButton,
  zodItemClass,
  formAction,
  submitButtonText: submitButtonText = "Submit",
  isLoading,
  submitButtonClass,
  labelClass,
  zodItemClassWithoutName,
}: {
  formSchema: SchemaType;
  values?: Partial<z.infer<SchemaType>>;
  onValuesChange?: (values: Partial<z.infer<SchemaType>>) => void;
  onParsedValuesChange?: (values: Partial<z.infer<SchemaType>>) => void;
  onSubmit?: (values: z.infer<SchemaType>) => void;
  fieldConfig?: FieldConfig<z.infer<SchemaType>>;
  children?:
    | React.ReactNode
    | ((formState: FormState<z.infer<SchemaType>>) => React.ReactNode);
  className?: string;
  innerClassName?: string;
  dependencies?: Dependency<z.infer<SchemaType>>[];
  edit?: boolean;
  defaultValues?:
    | DefaultValues<z.infer<SchemaType>>
    | AsyncDefaultValues<DeepPartial<z.infer<SchemaType>>>;
  withSubmitButton?: boolean;
  zodItemClass?: string;
  formAction?: (formData: FormData) => Promise<void>;
  submitButtonText?: string;
  isLoading?: boolean;
  submitButtonClass?: string;
  labelClass?: string;
  zodItemClassWithoutName?: string;
}) {
  const objectFormSchema = getObjectFormSchema(formSchema);
  const defaultValues: DefaultValues<z.infer<typeof objectFormSchema>> | null =
    _defaultValues ?? getDefaultValues(objectFormSchema, fieldConfig);

  const form = useForm<z.infer<typeof objectFormSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? undefined,
    values: valuesProp,
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    const parsedValues = formSchema.safeParse(values);
    if (parsedValues.success) {
      return onSubmitProp?.(parsedValues.data);
    }
    return false;
  }

  const values = form.watch();
  const valueError = formSchema.safeParse(values);
  // valuesString is needed because form.watch() returns a new object every time
  const valuesString = JSON.stringify(values);
  const [showError, setShowError] = React.useState(false);


  React.useEffect(() => {
    onValuesChangeProp?.(values);
    const parsedValues = formSchema.safeParse(values);
    if (parsedValues.success) {
      onParsedValuesChange?.(parsedValues.data);
    }
  }, [valuesString]);

  const renderChildren =
    typeof children === "function"
      ? children(form.formState as FormState<z.infer<SchemaType>>)
      : children;

  if (form.formState.isLoading) {
    return null;
  }

  return (
    <div className="w-full">
      <Form {...form}>
        {formAction ? (
          <form className={cn("space-y-2", className)}>
            <AutoFormObject
              schema={objectFormSchema}
              form={form}
              dependencies={dependencies}
              fieldConfig={fieldConfig}
              innerClassName={innerClassName}
              edit={edit}
              zodItemClass={zodItemClass}
              labelClass={labelClass}
              zodItemClassWithoutName={zodItemClassWithoutName}
            />
            {renderChildren}
            {formAction && (
              <button
                className={cn(
                  "border py-3 rounded-full background-text-primary text-white w-fit px-12",
                  submitButtonClass
                )}
                formAction={formAction}
              >
                {isLoading ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  submitButtonText
                )}
              </button>
            )}
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              console.log("submitting");
              e.preventDefault();
              setShowError(true);
              form.handleSubmit(onSubmit)(e);
            }}
            className={cn("space-y-2", className)}
          >
            <AutoFormObject
              schema={objectFormSchema}
              form={form}
              dependencies={dependencies}
              fieldConfig={fieldConfig}
              innerClassName={innerClassName}
              edit={edit}
              zodItemClass={zodItemClass}
              labelClass={labelClass}
            />
            {renderChildren}
            {withSubmitButton && <AutoFormSubmit />}
            {showError && valueError.error?.issues.map((issue) => (
              <div key={issue.path.join(".") ?? issue.message}>
                <FormMessage>
                  <div className="flex flex-col gap-2">
                    <p>{formatFilterId(issue.path.join(" -> ") ?? issue.code)}</p>
                    {issue.message}
                  </div>
                </FormMessage>
              </div>
            ))}
          </form>
        )}
      </Form>
    </div>
  );
}

export default AutoForm;


//Need a better way of showing errors, maybe customize the form message component to only show messages for certain conditions