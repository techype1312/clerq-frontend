import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldConfig } from "../types";
import { useEffect, useState } from "react";
import AutoFormObject from "./object";
import { z } from "zod";
import { useForm } from "react-hook-form";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import OnboardingApis from "@/actions/apis/OnboardingApis";
import { useUserContext } from "@/context/User";
import { Servers } from "../../../../../config";
import { Button } from "../../button";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";

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
  addressType?: string;
};

export default function AutoFormAddressModal({
  label,
  item,
  form,
  fieldConfig,
  zodItemClass,
  path = [],
  name,
  labelClass,
  isPresent = false,
  addressType,
}: AutoFormModalComponentProps) {
  const [saved, setSaved] = useState(false);
  const { refreshUser } = useUserContext();
  useEffect(() => {
    if (isPresent) {
      setSaved(true);
    }
  }, [isPresent]);
  const [value, setValue] = useState<any>(null);
  useEffect(() => {
    if (name === "address" && form.getValues("address_id"))
      setValue({
        label: form.getValues()?.address?.address_line_1,
        value: form.getValues()?.address?.address_line_1,
      });
    if (form.getValues("address.country") !== "US") {
      form.setValue("address.country", "US");
    }
  }, [form.getValues("address_id")]);

  const handlePlaceSelect = (value: any) => {
    setValue(value);
    if (!value) return;
    geocodeByAddress(value?.label)
      .then((results: any) => getLatLng(results[0]))
      .then(async ({ lat, lng }: { lat: any; lng: any }) => {
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
            form.setValue("address", {
              address_line_1: res.data.address_line_1,
              address_line_2: res.data.address_line_1,
              city: res.data.city,
              state: res.data.state,
              postal_code: res.data.postal_code,
              country: "US",
            });

            refreshUser();
            setValue({
              label: res.data.address_line_1.split(",")[0], //This should be removed once the API returns the correct address
              value: res.data.address_line_1.split(",")[0],
            });
          }
        }
        setSaved(true);
      });
  };

  const copyAddress = async () => {
    let res;
    if (addressType === "address") {
      console.log(form.getValues("mailing_address"), form.getValues());
      let body = form.getValues("mailing_address");
      delete body.id;
      body.country = "US";
      res = await OnboardingApis.updateAddress(
        form.getValues("address_id"),
        body
      );

      form.setValue("address", body);
      setValue({
        label: form.getValues()?.address?.address_line_1,
        value: form.getValues()?.address?.address_line_1,
      });
    } else if (addressType === "mailing_address") {
      let body = form.getValues("legal_address");
      delete body.id;
      res = await OnboardingApis.updateAddress(
        form.getValues("address_id"),
        body
      );
      body.country = "US";
      form.setValue("address", body);
      setValue({
        label: form.getValues()?.mailing_address?.address_line_1,
        value: form.getValues()?.mailing_address?.address_line_1,
      });
      console.log(res);
    }
  };

  return (
    <div className="flex flex-row items-center space-x-2 w-full">
      <FormItem className="flex w-full flex-col justify-start">
        <FormControl>
          <>
            <div className="flex flex-col justify-start w-full gap-2 mb-3">
              <FormLabel>Address line 1</FormLabel>
              <GooglePlacesAutocomplete
                apiKey={Servers.GoogleAPIkey}
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
                    "w-full !important:border-input rounded-md focus:outline-none focus:border-primary",
                }}
              />
            </div>
            <AutoFormObject
              schema={item as unknown as z.ZodObject<any, any>}
              form={form}
              fieldConfig={
                (fieldConfig?.[name] ?? {}) as FieldConfig<z.infer<typeof item>>
              }
              path={[name]}
              innerClassName={zodItemClass}
              labelClass={labelClass}
            />
            <Button
              onClick={copyAddress}
              variant={"ghost"}
              className="w-fit flex gap-1 text-label pl-0 hover:bg-white"
            >
              <SymbolIcon icon="content_copy" size={18} /> copy from{" "}
              {addressType === "address" ? "mailing address" : "legal address"}
            </Button>
          </>
        </FormControl>
        <FormMessage />
      </FormItem>
    </div>
  );
}
