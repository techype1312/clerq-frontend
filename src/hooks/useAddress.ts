import { supabase } from "@/utils/supabase/client";
import { getUserData, updateOtherUserData } from "./useUser";
import { getCompanyData, updateCompanyData } from "./useCompany";

export const insertAddressData = async (data: any, company: boolean) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  const { data: insertedData, error } = await supabase.from("address").insert(data).select("id");
  if(company){
    updateCompanyData({ address_id: insertedData && insertedData[0]?.id });
  } else{
    updateOtherUserData({ address_id: insertedData && insertedData[0]?.id });
  }
  if (error) {
    console.log(error);
    return null;
  } else {
    return insertedData;
  }
};

export async function getCompanyAddressData() {
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  const companyData = await getCompanyData();
  const { data, error } = await supabase
    .from("address")
    .select("*")
    .eq("id", companyData && companyData[0]?.address_id);
  if (error) {
    console.error("Error getting items:", error);
    return null;
  } else {
    return data;
  }
}

export async function getUserAddressData() {
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  const userData = await getUserData();
  const { data, error } = await supabase
    .from("address")
    .select("*")
    .eq("id", userData && userData[0]?.address_id);
  if (error) {
    console.error("Error getting items:", error);
    return null;
  } else {
    return data;
  }
}

export async function updateAddressData(data: any) {
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  const userData = await getUserData();
  const { data: updatedData, error } = await supabase
    .from("address")
    .update(data)
    .eq("id", userData && userData[0]?.address_id);
  if (error) {
    console.log(error);
    return null;
  } else {
    return updatedData;
  }
}
