export type DayStatus = "Full Day" | "Half Day" | "Holiday";
export type PaymentMethod = "Cash" | "Bank Transfer";

export interface ArtisanDayRow {
  id: string;
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
  date: string;
  amount: number;
  client_name: string;
  payment_method: PaymentMethod;
  notes: string | null;
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
