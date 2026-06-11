import { createClient } from "@supabase/supabase-js";
import type { ArtisanDayRow, ArtisanPaymentRow } from "@/lib/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ArtisanDaysTable = {
  Row: ArtisanDayRow;
  Insert: Omit<ArtisanDayRow, "id"> & { id?: string };
};

export type ArtisanPaymentsTable = {
  Row: ArtisanPaymentRow;
  Insert: Omit<ArtisanPaymentRow, "id"> & { id?: string };
};
