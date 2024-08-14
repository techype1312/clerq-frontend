import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import AutoFormLabel from "../common/label";
import { FieldConfig } from "../types";
import { Button } from "../../button";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AutoFormObject from "./object";
import { z } from "zod";
import { useForm } from "react-hook-form";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import OnboardingApis from "@/actions/apis/OnboardingApis";
import AuthApis from "@/actions/apis/AuthApis";

type AutoFormModalComponentProps = {
  label: string;
  item: z.ZodObject<any, any>;
  form: ReturnType<typeof useForm>;
  fieldConfig?: FieldConfig<z.infer<z.ZodObject<any, any>>>;
  zodItemClass?: string;
  path: string[];
  name: string;
  labelClass?: string;
  isPresent?: boolean;
};

export default function AutoFormModal({
  label,
  item,
  form,
  fieldConfig,
  zodItemClass,
  path = [],
  name,
  labelClass,
  isPresent = false,
}: AutoFormModalComponentProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isPresent) {
      setSaved(true);
    }
  }, [isPresent]);
  const [value, setValue] = useState<any>(null);
  const [update, setUpdate] = useState<boolean>(false);
  const [loadedValue, setLoadedValue] = useState<boolean>(false);

  useEffect(() => {
    if (name === "address" && form.getValues("address_id"))
      setValue({
        label:
          form.getValues()?.address?.address_line_1 +
          "," +
          form.getValues()?.address?.address_line_2 +
          "," +
          form.getValues()?.address?.city +
          "," +
          form.getValues()?.address?.state +
          "," +
          form.getValues()?.address?.postal_code,
        value:
          form.getValues()?.address?.address_line_1 +
          "," +
          form.getValues()?.address?.address_line_2 +
          "," +
          form.getValues()?.address?.city +
          "," +
          form.getValues()?.address?.state +
          "," +
          form.getValues()?.address?.postal_code,
      });
  }, [form.getValues("address_id"), form.getValues("address")]);

  useEffect(() => {
    if (
      name === "mailing_address" &&
      form.getValues("mailing_address_id") &&
      form.getValues("mailing_address_id") !== form.getValues("address_id")
    )
      setValue({
        label:
          form.getValues()?.mailing_address?.address_line_1 +
          "," +
          form.getValues()?.mailing_address?.address_line_2 +
          "," +
          form.getValues()?.mailing_address?.city +
          "," +
          form.getValues()?.mailing_address?.state +
          "," +
          form.getValues()?.mailing_address?.postal_code,
        value:
          form.getValues()?.mailing_address?.address_line_1 +
          "," +
          form.getValues()?.mailing_address?.address_line_2 +
          "," +
          form.getValues()?.mailing_address?.city +
          "," +
          form.getValues()?.mailing_address?.state +
          "," +
          form.getValues()?.mailing_address?.postal_code,
      });
  }, [form.getValues("mailing_address_id")]);

  useEffect(() => {
    if (update) {
      setUpdate(false);
      if (name === "address") {
        const updateAddress = async () => {
          const res = await OnboardingApis.updateAddress(
            form.getValues("address_id"),
            form.getValues(name)
          );
        };
        updateAddress();
      } else {
        const updateAddress = async () => {
          const res = await OnboardingApis.updateAddress(
            form.getValues("mailing_address_id"),
            form.getValues(name)
          );
        };
        updateAddress();
      }
    }
  }, [update]);

  const handlePlaceSelect = (value: any) => {
    setValue(value);
    if (!value) return;
    geocodeByAddress(value?.label)
      .then((results: any) => getLatLng(results[0]))
      .then(async ({ lat, lng }: { lat: any, lng: any}) => {
        if (name === "address") {
          form.setValue("lat", lat);
          form.setValue("lng", lng);
          let res;
          if (!form.getValues("address_id")) {
            res = await OnboardingApis.createAddress({
              latitude: lat,
              longitude: lng,
            });
          } else {
            const body = {
              latitude: lat,
              longitude: lng,
            };
            res = await OnboardingApis.updateAddress(
              form.getValues("address_id"),
              body
            );
          }
          if (res && res.data && (res.status === 201 || res.status === 200)) {
            form.setValue("address_id", res.data.id);
            if (form.getValues("is_mailing_address_same")) {
              form.setValue("mailing_address_id", res.data.id);
            }
            form.setValue("address", {
              address_line_1: res.data.address_line_1,
              address_line_2: res.data.address_line_1,
              city: res.data.city,
              state: res.data.state,
              postal_code: res.data.postal_code,
            });
          }
        } else if (
          name === "mailing_address" &&
          !form.getValues("is_mailing_address_same")
        ) {
          form.setValue("lat1", lat);
          form.setValue("lng1", lng);
          let res;
          if (!form.getValues("mailing_address_id")) {
            res = await OnboardingApis.createAddress({
              latitude: lat,
              longitude: lng,
            });
          } else {
            const body = {
              latitude: lat,
              longitude: lng,
            };
            res = await OnboardingApis.updateAddress(
              form.getValues("mailing_address_id"),
              body
            );
          }
          if (res && res.data && (res.status === 201 || res.status === 200)) {
            form.setValue("mailing_address_id", res.data.id);
            form.setValue("mailing_address", {
              address_line_1: res.data.address_line_1,
              address_line_2: res.data.address_line_1,
              city: res.data.city,
              state: res.data.state,
              postal_code: res.data.postal_code,
            });
          }
        }
        setSaved(true);
      });
  };

  return (
    <div className="flex flex-row items-center space-x-2 w-full">
      <FormItem className="flex w-full flex-col justify-start">
        <FormControl>
          <Dialog>
            <AutoFormLabel
              label={label}
              isRequired={true}
              className={labelClass}
            />
            <div className="flex gap-4">
              <div className="w-full">
                <GooglePlacesAutocomplete
                  apiKey="AIzaSyDOQ7N0NgZt8OFcioja-gHnX5hKjk-Su_8"
                  onLoadFailed={(error: any) => {
                    console.error("Could not load Google API", error);
                  }}
                  autocompletionRequest={{
                    bounds: [
                      { lat: 50, lng: 50 },
                      { lat: 100, lng: 100 },
                    ],
                    componentRestrictions: {
                      country: ["us"],
                    },
                  }}
                  apiOptions={{ language: "en", region: "us" }}
                  selectProps={{
                    value,
                    onChange: handlePlaceSelect,
                    className:
                      "w-full border !important:border-input rounded-md focus:outline-none focus:border-primary",
                  }}
                />
              </div>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  className={`${
                    saved ? "" : "hidden"
                  } background-muted text-background-primary hover:!background-muted `}
                  variant={"ghost"}
                  // onClick={() => {
                  //   setUpdate(!update);
                  // }}
                >
                  {saved ? "Edit" : ""}
                </Button>
              </DialogTrigger>
            </div>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add {label}</DialogTitle>
              </DialogHeader>
              <AutoFormObject
                schema={item as unknown as z.ZodObject<any, any>}
                form={form}
                fieldConfig={
                  (fieldConfig?.[name] ?? {}) as FieldConfig<
                    z.infer<typeof item>
                  >
                }
                path={[name]}
                innerClassName={zodItemClass}
                labelClass={labelClass}
              />
              <DialogFooter className="mr-auto my-2 h-12 flex gap-2">
                <DialogClose asChild>
                  <Button
                    onClick={() => {
                      // setSaved(true);
                      setUpdate(true);
                    }}
                    type="button"
                    className="background-primary px-10 rounded-full h-12"
                  >
                    {saved ? "Save changes" : "Add"}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* <Button
              onClick={() => setIsOpen(true)}
              className="background-muted text-background-primary hover:!background-muted "
              variant={"ghost"}
            >
              Add {fieldConfigItem?.label || label}
            </Button> */}
        </FormControl>
        <FormMessage />
      </FormItem>
    </div>
  );
}
