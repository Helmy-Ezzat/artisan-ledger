export type DayStatus = "Full Day" | "Half Day" | "Holiday";
export type PaymentMethod = "Cash" | "Bank Transfer";

export interface ArtisanDayRow {
  id: string;
  user_id: string;
  date: string;
  daily_rate: number;
  status: DayStatus;
  profession_type: string;
  client_name: string;
  location: string | null;
  notes: string | null;
}

export interface ArtisanPaymentRow {
  id: string;
  user_id: string;
  date: string;
  amount: number;
  client_name: string;
  payment_method: PaymentMethod;
  notes: string | null;
}

export interface ArchivedClientRow {
  id: string;
  user_id: string;
  client_name: string;
  archived_at: string;
  final_payment_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      artisan_days: {
        Row: ArtisanDayRow;
        Insert: Omit<ArtisanDayRow, "id"> & { id?: string };
        Update: Partial<ArtisanDayRow>;
        Relationships: [];
      };
      artisan_payments: {
        Row: ArtisanPaymentRow;
        Insert: Omit<ArtisanPaymentRow, "id"> & { id?: string };
        Update: Partial<ArtisanPaymentRow>;
        Relationships: [];
      };
      archived_clients: {
        Row: ArchivedClientRow;
        Insert: Omit<ArchivedClientRow, "id" | "created_at" | "archived_at"> & { 
          id?: string;
          created_at?: string;
          archived_at?: string;
        };
        Update: Partial<ArchivedClientRow>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
