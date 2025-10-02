export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      accessories: {
        Row: {
          active: boolean
          breeder_id: string
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          breeder_id: string
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          breeder_id?: string
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accessories_breeder_id_fkey"
            columns: ["breeder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      buyer_requests: {
        Row: {
          breed: string
          city: string | null
          county: string | null
          created_at: string
          description: string | null
          id: string
          latitude: number | null
          longitude: number | null
          max_price: number | null
          species: string
          state: string | null
          status: string
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          breed: string
          city?: string | null
          county?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          max_price?: number | null
          species: string
          state?: string | null
          status?: string
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          breed?: string
          city?: string | null
          county?: string | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          max_price?: number | null
          species?: string
          state?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buyer_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      care_packages: {
        Row: {
          active: boolean
          base_price: number
          breeder_id: string
          created_at: string
          description: string | null
          id: string
          items: Json
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          base_price?: number
          breeder_id: string
          created_at?: string
          description?: string | null
          id?: string
          items?: Json
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          base_price?: number
          breeder_id?: string
          created_at?: string
          description?: string | null
          id?: string
          items?: Json
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_packages_breeder_id_fkey"
            columns: ["breeder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          age_months: number | null
          available: boolean | null
          breed: string
          city: string | null
          county: string | null
          created_at: string
          description: string | null
          gender: string
          id: string
          image_url: string | null
          latitude: number | null
          listing_type: string
          longitude: number | null
          name: string
          owner_id: string
          price: number | null
          size: string | null
          species: string
          state: string | null
          updated_at: string
          vaccinated: boolean | null
          zip_code: string | null
        }
        Insert: {
          age_months?: number | null
          available?: boolean | null
          breed: string
          city?: string | null
          county?: string | null
          created_at?: string
          description?: string | null
          gender: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          listing_type: string
          longitude?: number | null
          name: string
          owner_id: string
          price?: number | null
          size?: string | null
          species: string
          state?: string | null
          updated_at?: string
          vaccinated?: boolean | null
          zip_code?: string | null
        }
        Update: {
          age_months?: number | null
          available?: boolean | null
          breed?: string
          city?: string | null
          county?: string | null
          created_at?: string
          description?: string | null
          gender?: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          listing_type?: string
          longitude?: number | null
          name?: string
          owner_id?: string
          price?: number | null
          size?: string | null
          species?: string
          state?: string | null
          updated_at?: string
          vaccinated?: boolean | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          county: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          latitude: number | null
          longitude: number | null
          state: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          city?: string | null
          county?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          latitude?: number | null
          longitude?: number | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          city?: string | null
          county?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      sales: {
        Row: {
          breeder_earnings: number
          breeder_id: string
          buyer_id: string
          created_at: string
          funds_available_date: string
          id: string
          payout_date: string | null
          payout_status: string
          pet_id: string
          platform_fee: number
          sale_date: string
          sale_price: number
          updated_at: string
        }
        Insert: {
          breeder_earnings?: number
          breeder_id: string
          buyer_id: string
          created_at?: string
          funds_available_date?: string
          id?: string
          payout_date?: string | null
          payout_status?: string
          pet_id: string
          platform_fee?: number
          sale_date?: string
          sale_price: number
          updated_at?: string
        }
        Update: {
          breeder_earnings?: number
          breeder_id?: string
          buyer_id?: string
          created_at?: string
          funds_available_date?: string
          id?: string
          payout_date?: string | null
          payout_status?: string
          pet_id?: string
          platform_fee?: number
          sale_date?: string
          sale_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          started_at: string
          status: string
          subscription_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          started_at?: string
          status?: string
          subscription_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          started_at?: string
          status?: string
          subscription_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
