import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Servers } from "../../../../../config";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { Loader2Icon } from "lucide-react";
import { ErrorProps } from "@/types/general";
import isObject from "lodash/isObject";
import AddressApis from "@/actions/data/address.data";

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
  const [value, setValue] = useState<any>(null);
  const [update, setUpdate] = useState<boolean>(false);
  const [disableUpdate, setDisableUpdate] = useState<boolean>(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
    setDisableUpdate(true);
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

  const handleOnSelectAddressSuccess = (
    addressType: "address" | "mailing_address",
    res: any
  ) => {
    setLoading(false);
    form.setValue(`${addressType}_id`, res.id);
    form.setValue(addressType, res);
    setDisableUpdate(false);
    return res;
  };

  const handleOnSelectAddress = async (
    addressType: "address" | "mailing_address",
    data: any
  ) => {
    if (loading) return false;
    setLoading(true);
    setServerError("");
    setDisableUpdate(true);
    if (!form.getValues(`${addressType}_id`)) {
      return AddressApis.createAddress(data).then(
        (res) => handleOnSelectAddressSuccess(addressType, res),
        onError
      );
    } else {
      return AddressApis.updateAddress(
        form.getValues(`${addressType}_id`),
        data
      ).then((res) => handleOnSelectAddressSuccess(addressType, res), onError);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getValues("address_id")]);

  useEffect(() => {
    if (name === "mailing_address" && form.getValues("mailing_address_id"))
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getValues("mailing_address_id")]);

  useEffect(() => {
    if (update) {
      setUpdate(false);
      if (name === "address") {
        handleUpdateAddress(form.getValues("address_id"), form.getValues(name));
      } else {
        handleUpdateAddress(
          form.getValues("mailing_address_id"),
          form.getValues(name)
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  const handlePlaceSelect = (value: any) => {
    setValue(value);
    if (!value) return;
    geocodeByAddress(value?.label)
      .then((results: any) => getLatLng(results[0]))
      .then(async ({ lat, lng }: { lat: any; lng: any }) => {
        if (name === "address") {
          form.setValue("lat", lat);
          form.setValue("long", lng);
          handleOnSelectAddress("address", {
            latitude: lat,
            longitude: lng,
          });
        } else if (name === "mailing_address") {
          form.setValue("lat1", lat);
          form.setValue("long1", lng);
          handleOnSelectAddress("mailing_address", {
            latitude: lat,
            longitude: lng,
          });
        }
        setSaved(true);
      });
  };

  const copyAddress = async () => {
    if (name === "address") {
      const body = {
        ...form.getValues("mailing_address"),
        longitude: form.getValues("long1"),
        latitude: form.getValues("lat1"),
      };
      form.setValue("address", body);
      form.setValue("long", body.longitude);
      form.setValue("lat", body.latitude);
      handleOnSelectAddress("address", body);
    } else if (name === "mailing_address") {
      const body = {
        ...form.getValues("address"),
        longitude: form.getValues("long"),
        latitude: form.getValues("lat"),
      };
      form.setValue("mailing_address", body);
      form.setValue("long1", body.longitude);
      form.setValue("lat1", body.latitude);
      handleOnSelectAddress("mailing_address", body);
    }
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
                >
                  {saved ? "Edit" : ""}
                </Button>
              </DialogTrigger>
            </div>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add {label}</DialogTitle>
              </DialogHeader>
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
                  (fieldConfig?.[name] ?? {}) as FieldConfig<
                    z.infer<typeof item>
                  >
                }
                path={[name]}
                innerClassName={zodItemClass}
                labelClass={labelClass}
              />
              {(name !== "address"
                ? form.getValues("address_id")
                : form.getValues("mailing_address_id")) && (
                <Button
                  onClick={copyAddress}
                  variant={"ghost"}
                  className="w-fit flex gap-1 text-label pl-0 hover:bg-white"
                >
                  <SymbolIcon icon="content_copy" size={18} /> copy from{" "}
                  {name === "address" ? "mailing address" : "legal address"}
                </Button>
              )}
              <DialogFooter className="mr-auto my-2 h-12 flex gap-2">
                {disableUpdate ? (
                  <span className="background-primary px-10 rounded-full h-12 text-white flex items-center justify-center">
                    <Loader2Icon className="animate-spin" />
                  </span>
                ) : (
                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        setUpdate(true);
                      }}
                      type="button"
                      className="background-primary px-10 rounded-full h-12"
                    >
                      {saved ? "Save changes" : "Add"}
                    </Button>
                  </DialogClose>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </FormControl>
        <FormMessage />
      </FormItem>
    </div>
  );
}
