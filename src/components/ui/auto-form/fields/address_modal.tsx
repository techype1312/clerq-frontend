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
import { useUserContext } from "@/context/User";
import { Servers } from "../../../../../config";
import { Button } from "../../button";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { ErrorProps } from "@/types/general";
import isObject from "lodash/isObject";
import AddressApis from "@/actions/data/address.data";
import { DEFAULT_COUNTRY_CODE, enabledCountries } from "@/utils/constants";

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
  const [value, setValue] = useState<any>(null);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onUpdateAddressSuccess = (res: any) => {
    setLoading(false);
    return res;
  };

  const handleUpdateAddress = async (addressId: string, address: any) => {
    if (loading) return false;
    setLoading(true);
    setServerError("");
    return AddressApis.updateAddress(addressId, address).then(
      onUpdateAddressSuccess,
      onError
    );
  };

  const handleOnSelectAddressSuccess = (res: any) => {
    setLoading(false);
    form.setValue("address_id", res.id);
    form.setValue("address", {
      address_line_1: res.address_line_1,
      address_line_2: res.address_line_1,
      city: res.city,
      state: res.state,
      postal_code: res.postal_code,
      country: DEFAULT_COUNTRY_CODE,
    });

    refreshUser();
    setValue({
      label: res.address_line_1.split(",")[0], //This should be removed once the API returns the correct address
      value: res.address_line_1.split(",")[0],
    });
    return res;
  };

  const handleOnSelectAddress = async (data: {
    latitude: number;
    longitude: number;
  }) => {
    if (loading) return false;
    setLoading(true);
    setServerError("");
    if (!form.getValues("address_id")) {
      return AddressApis.createAddress(data).then(
        handleOnSelectAddressSuccess,
        onError
      );
    } else {
      return AddressApis.updateAddress(form.getValues("address_id"), data).then(
        handleOnSelectAddressSuccess,
        onError
      );
    }
  };

  useEffect(() => {
    if (isPresent) {
      setSaved(true);
    }
  }, [isPresent]);

  useEffect(() => {
    if (name === "address" && form.getValues("address_id"))
      setValue({
        label: form.getValues()?.address?.address_line_1,
        value: form.getValues()?.address?.address_line_1,
      });
    if (form.getValues("address.country") !== DEFAULT_COUNTRY_CODE) {
      form.setValue("address.country", DEFAULT_COUNTRY_CODE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          handleOnSelectAddress({ latitude: lat, longitude: lng });
        }
        setSaved(true);
      });
  };

  const copyAddress = async () => {
    if (addressType === "address") {
      let body = form.getValues("mailing_address");
      delete body.id;
      body.country = DEFAULT_COUNTRY_CODE;
      handleUpdateAddress(form.getValues("address_id"), body);

      form.setValue("address", body);
      setValue({
        label: form.getValues()?.address?.address_line_1,
        value: form.getValues()?.address?.address_line_1,
      });
    } else if (addressType === "mailing_address") {
      let body = form.getValues("legal_address");
      delete body.id;
      handleUpdateAddress(form.getValues("address_id"), body);
      body.country = DEFAULT_COUNTRY_CODE;
      form.setValue("address", body);
      setValue({
        label: form.getValues()?.mailing_address?.address_line_1,
        value: form.getValues()?.mailing_address?.address_line_1,
      });
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
                    country: enabledCountries.map((c) => c.toLowerCase()),
                  },
                }}
                apiOptions={{ language: "en", region: DEFAULT_COUNTRY_CODE.toLowerCase() }}
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
