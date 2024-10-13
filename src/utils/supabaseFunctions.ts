import { supabase } from "./supabase";

export const addMotivation = async (value: string) => {
  const { data } = await supabase
    .from("motivation_bodymake")
    .insert([{ value }]);
  if (data !== null) {
    return data[0];
  }
};
