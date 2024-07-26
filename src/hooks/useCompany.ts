import { supabase } from "@/utils/supabase/client";
import { insertAddressData } from "./useAddress";

export const insertCompanyData = async (data: any, address: any) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  data.user_id = user?.user?.id;
  delete data.address;
  const { data: insertedData, error } = await supabase
    .from("company_info")
    .insert(data).select("id");
  if (error) {
    console.log(error);
    return null;
  } else {
    insertAddressData(address, true)
    return insertedData;
  }
};

export async function getCompanyData() {
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  const { data, error } = await supabase
    .from("company_info")
    .select("*")
    .eq("user_id", user?.user?.id);
  if (error) {
    console.error("Error getting items:", error);
    return null;
  } else {
    return data;
  }
}

export async function updateCompanyData(data: any) {
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  data.user_id = user?.user?.id;
  delete data.address;
  const { data: updatedData, error } = await supabase
    .from("company_info")
    .update(data)
    .eq("user_id", user?.user?.id);
  if (error) {
    console.log(error);
    return null;
  } else {
    return updatedData;
  }
}
