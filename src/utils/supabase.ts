import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;

console.log(supabaseUrl);
export const supabase = createClient(supabaseUrl, supabaseKey);
