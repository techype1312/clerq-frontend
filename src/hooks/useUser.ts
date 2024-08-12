import { supabase } from "@/utils/supabase/client";
import { UserMetadata } from "@supabase/supabase-js";
import { insertAddressData } from "./useAddress";
import AuthApis from "@/actions/apis/AuthApis";

//This will insert the user data into the other_user_info table
export const insertUserData = async (data: any, address: any) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  data.user_id = user?.user?.id;
  data.first_name = data.name.first_name;
  data.last_name = data.name.last_name;
  delete data.name;
  delete data.address;
  delete data.company;
  data.phone = data.phone.toString();
  data.date_of_birth = new Date(data.date_of_birth).toISOString();
  const { data: insertedData, error } = await supabase
    .from("other_user_info")
    .insert(data)
    .select("id");
  if (error) {
    console.log(error);
    return null;
  } else {
    insertAddressData(address, false);
    return insertedData;
  }
};

//This will get the user data from the other_user_info table
export async function getUserData() {
  const { data: user, error } = await AuthApis.profile();
  if (!user) {
    return null;
  }
  if (error) {
    console.error("Error getting items:", error);
    return null;
  } else {
    return user;
  }
}

//This will update the user data in the other_user_info table
export async function updateOtherUserData(data: any) {
  data.firstName = data?.name?.first_name;
  data.lastName = data?.name?.last_name;
  delete data.name;
  delete data.address;
  delete data.company;
  const res = await AuthApis.updateUser(data);
  return res;
}

//This will update the user data in the user table
export async function updateUserData(newMetaData: UserMetadata) {
  const { data: user } = await supabase.auth.updateUser({
    data: newMetaData,
  });
  if (!user) {
    return null;
  }
  return user;
}
