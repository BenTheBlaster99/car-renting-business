import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error("La variable NEXT_PUBLIC_SUPABASE_URL manque dans .env");
}

if (!supabaseKey) {
  throw new Error("La variable NEXT_PUBLIC_SUPABASE_ANON_KEY manque dans .env");
}

export const supabase = createClient(supabaseUrl, supabaseKey);