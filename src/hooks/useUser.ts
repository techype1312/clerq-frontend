import { supabase } from "@/utils/supabase/client";
import { UserMetadata } from "@supabase/supabase-js";

//This will insert the user data into the other_user_info table
export const insertUserData = async (data: any) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  data.user_id = user?.user?.id;
  data.first_name = data.name.first_name;
  data.last_name = data.name.last_name;
  delete data.name;
  delete data.address;
  data.phone = data.phone.toString();
  data.date_of_birth = new Date(data.date_of_birth).toISOString();
  const { data: insertedData, error } = await supabase
    .from("other_user_info")
    .insert(data);
  if (error) {
    console.log(error);
    return null;
  } else {
    return insertedData;
  }
};


//This will get the user data from the other_user_info table
export async function getUserData() {
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  const { data, error } = await supabase
    .from("other_user_info")
    .select("*")
    .eq("user_id", user?.user?.id);
  if (error) {
    console.error("Error getting items:", error);
    return null;
  } else {
    return data;
  }
}

//This will update the user data in the other_user_info table
export async function updateOtherUserData(data: any) {
  const { data: user } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  const { data: updatedData, error } = await supabase
    .from("other_user_info")
    .update(data)
    .eq("user_id", user?.user?.id);
  if (error) {
    console.log(error);
    return null;
  } else {
    return updatedData;
  }
}

//This will update the user data in the user table
export async function updateUserData(newMetaData: UserMetadata) {
    const { data: user } = await supabase.auth.updateUser({
        data: newMetaData
    });
    if (!user) {
        return null;
    }
    return user;
}