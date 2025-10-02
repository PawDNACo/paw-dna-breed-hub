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
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accessories_breeder_id_fkey"
            columns: ["breeder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accessories_breeder_id_fkey"
            columns: ["breeder_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_session_log: {
        Row: {
          action: string
          admin_user_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          session_id: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          session_id?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          session_id?: string | null
        }
        Relationships: []
      }
      banking_change_requests: {
        Row: {
          approved_date: string | null
          created_at: string | null
          id: string
          request_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          verification_request_id: string | null
        }
        Insert: {
          approved_date?: string | null
          created_at?: string | null
          id?: string
          request_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          verification_request_id?: string | null
        }
        Update: {
          approved_date?: string | null
          created_at?: string | null
          id?: string
          request_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          verification_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "banking_change_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "banking_change_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "banking_change_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "banking_change_requests_verification_request_id_fkey"
            columns: ["verification_request_id"]
            isOneToOne: false
            referencedRelation: "verification_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      breed_pricing: {
        Row: {
          breed_name: string
          created_at: string | null
          id: string
          is_special_breed: boolean | null
          min_price: number
          updated_at: string | null
        }
        Insert: {
          breed_name: string
          created_at?: string | null
          id?: string
          is_special_breed?: boolean | null
          min_price?: number
          updated_at?: string | null
        }
        Update: {
          breed_name?: string
          created_at?: string | null
          id?: string
          is_special_breed?: boolean | null
          min_price?: number
          updated_at?: string | null
        }
        Relationships: []
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
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buyer_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buyer_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
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
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_packages_breeder_id_fkey"
            columns: ["breeder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_packages_breeder_id_fkey"
            columns: ["breeder_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          approved_at: string | null
          breeder_id: string
          buyer_id: string
          created_at: string | null
          id: string
          pet_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          breeder_id: string
          buyer_id: string
          created_at?: string | null
          id?: string
          pet_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          breeder_id?: string
          buyer_id?: string
          created_at?: string | null
          id?: string
          pet_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_breeder_id_fkey"
            columns: ["breeder_id"]
            isOneToOne: false
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_breeder_id_fkey"
            columns: ["breeder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_breeder_id_fkey"
            columns: ["breeder_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      email_access_log: {
        Row: {
          access_type: string
          accessed_at: string | null
          accessed_by: string | null
          id: string
          ip_address: unknown | null
          profile_id: string | null
          user_agent: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          accessed_by?: string | null
          id?: string
          ip_address?: unknown | null
          profile_id?: string | null
          user_agent?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          accessed_by?: string | null
          id?: string
          ip_address?: unknown | null
          profile_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_access_log_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_access_log_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_access_log_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      frozen_funds: {
        Row: {
          amount: number
          created_at: string | null
          frozen_at: string | null
          id: string
          release_date: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string | null
          frozen_at?: string | null
          id?: string
          release_date?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          frozen_at?: string | null
          id?: string
          release_date?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "frozen_funds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "frozen_funds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "frozen_funds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      identity_verification_sessions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          stripe_session_id: string
          user_id: string
          verification_token: string
          verification_type: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          stripe_session_id: string
          user_id: string
          verification_token: string
          verification_type: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          stripe_session_id?: string
          user_id?: string
          verification_token?: string
          verification_type?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message_content: string
          pet_id: string | null
          recipient_id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_content: string
          pet_id?: string | null
          recipient_id: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_content?: string
          pet_id?: string | null
          recipient_id?: string
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_images: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          is_parent_image: boolean | null
          pet_id: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_parent_image?: boolean | null
          pet_id: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_parent_image?: boolean | null
          pet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_images_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          age_months: number | null
          available: boolean | null
          birth_date: string | null
          breed: string
          breeder_earnings_percentage: number | null
          city: string | null
          county: string | null
          created_at: string
          delivery_method: string | null
          description: string | null
          expected_date: string | null
          gender: string
          id: string
          image_url: string | null
          is_special_breed: boolean | null
          latitude: number | null
          listing_fee_amount: number | null
          listing_fee_paid: boolean | null
          listing_type: string
          longitude: number | null
          name: string
          owner_id: string
          parent_images: Json | null
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
          birth_date?: string | null
          breed: string
          breeder_earnings_percentage?: number | null
          city?: string | null
          county?: string | null
          created_at?: string
          delivery_method?: string | null
          description?: string | null
          expected_date?: string | null
          gender: string
          id?: string
          image_url?: string | null
          is_special_breed?: boolean | null
          latitude?: number | null
          listing_fee_amount?: number | null
          listing_fee_paid?: boolean | null
          listing_type: string
          longitude?: number | null
          name: string
          owner_id: string
          parent_images?: Json | null
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
          birth_date?: string | null
          breed?: string
          breeder_earnings_percentage?: number | null
          city?: string | null
          county?: string | null
          created_at?: string
          delivery_method?: string | null
          description?: string | null
          expected_date?: string | null
          gender?: string
          id?: string
          image_url?: string | null
          is_special_breed?: boolean | null
          latitude?: number | null
          listing_fee_amount?: number | null
          listing_fee_paid?: boolean | null
          listing_type?: string
          longitude?: number | null
          name?: string
          owner_id?: string
          parent_images?: Json | null
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
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_access_logs: {
        Row: {
          access_type: string
          accessed_at: string | null
          accessed_profile_id: string
          accessor_id: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          accessed_profile_id: string
          accessor_id: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          accessed_profile_id?: string
          accessor_id?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_access_logs_accessed_profile_id_fkey"
            columns: ["accessed_profile_id"]
            isOneToOne: false
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_access_logs_accessed_profile_id_fkey"
            columns: ["accessed_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_access_logs_accessed_profile_id_fkey"
            columns: ["accessed_profile_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"] | null
          city: string | null
          county: string | null
          created_at: string
          frozen_at: string | null
          frozen_reason: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          latitude: number | null
          longitude: number | null
          social_provider: string | null
          state: string | null
          two_factor_enabled: boolean | null
          updated_at: string
          username: string | null
          verification_completed_at: string | null
          verification_status: string | null
          verification_type: string | null
          zip_code: string | null
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          city?: string | null
          county?: string | null
          created_at?: string
          frozen_at?: string | null
          frozen_reason?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          social_provider?: string | null
          state?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          username?: string | null
          verification_completed_at?: string | null
          verification_status?: string | null
          verification_type?: string | null
          zip_code?: string | null
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          city?: string | null
          county?: string | null
          created_at?: string
          frozen_at?: string | null
          frozen_reason?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          social_provider?: string | null
          state?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          username?: string | null
          verification_completed_at?: string | null
          verification_status?: string | null
          verification_type?: string | null
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
      sales_access_log: {
        Row: {
          access_type: string
          accessed_at: string | null
          id: string
          ip_address: unknown | null
          sale_id: string | null
          user_id: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          id?: string
          ip_address?: unknown | null
          sale_id?: string | null
          user_id?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          id?: string
          ip_address?: unknown | null
          sale_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_access_log_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "my_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_access_log_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
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
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      two_factor_audit_log: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          action_taken: string | null
          created_at: string | null
          id: string
          report_details: string | null
          report_reason: string
          reported_user_id: string
          reporter_user_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          id?: string
          report_details?: string | null
          report_reason: string
          reported_user_id: string
          reporter_user_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          id?: string
          report_details?: string | null
          report_reason?: string
          reported_user_id?: string
          reporter_user_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reporter_user_id_fkey"
            columns: ["reporter_user_id"]
            isOneToOne: false
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reporter_user_id_fkey"
            columns: ["reporter_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reporter_user_id_fkey"
            columns: ["reporter_user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verification_requests: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          request_type: Database["public"]["Enums"]["verification_type"]
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          request_type: Database["public"]["Enums"]["verification_type"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          request_type?: Database["public"]["Enums"]["verification_type"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "conversation_partner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      conversation_partner_profiles: {
        Row: {
          city: string | null
          full_name: string | null
          id: string | null
          is_verified: boolean | null
          state: string | null
          verification_status: string | null
        }
        Insert: {
          city?: string | null
          full_name?: string | null
          id?: string | null
          is_verified?: boolean | null
          state?: string | null
          verification_status?: string | null
        }
        Update: {
          city?: string | null
          full_name?: string | null
          id?: string | null
          is_verified?: boolean | null
          state?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      my_transactions: {
        Row: {
          breed: string | null
          breeder_earnings: number | null
          funds_available_date: string | null
          id: string | null
          other_party_id: string | null
          payout_date: string | null
          payout_status: string | null
          pet_name: string | null
          platform_fee: number | null
          sale_date: string | null
          sale_price: number | null
          species: string | null
          transaction_type: string | null
        }
        Relationships: []
      }
      public_profiles: {
        Row: {
          city: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
          is_verified: boolean | null
          state: string | null
          verification_status: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          is_verified?: boolean | null
          state?: string | null
          verification_status?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          is_verified?: boolean | null
          state?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_admin_by_email: {
        Args: { _email: string }
        Returns: undefined
      }
      calculate_breeder_earnings_percentage: {
        Args: { sale_price: number }
        Returns: number
      }
      calculate_distance: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      can_access_transaction: {
        Args: { _sale_id: string; _user_id: string }
        Returns: boolean
      }
      check_banking_change_limit: {
        Args: { _user_id: string }
        Returns: boolean
      }
      get_approximate_distance: {
        Args: { _user1_id: string; _user2_id: string }
        Returns: number
      }
      get_email_from_username: {
        Args: { _username: string }
        Returns: string
      }
      get_my_email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_partner_location: {
        Args: { _partner_id: string }
        Returns: {
          city: string
          state: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_pet_owner: {
        Args: { _pet_id: string; _user_id: string }
        Returns: boolean
      }
      username_exists: {
        Args: { _username: string }
        Returns: boolean
      }
      users_have_active_conversation: {
        Args: { _user1_id: string; _user2_id: string }
        Returns: boolean
      }
      users_have_active_transaction: {
        Args: { _user1_id: string; _user2_id: string }
        Returns: boolean
      }
    }
    Enums: {
      account_status:
        | "active"
        | "frozen"
        | "pending_verification"
        | "permanently_deleted"
      app_role: "admin" | "breeder" | "buyer"
      verification_type:
        | "account_recovery"
        | "banking_change"
        | "report_investigation"
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
    Enums: {
      account_status: [
        "active",
        "frozen",
        "pending_verification",
        "permanently_deleted",
      ],
      app_role: ["admin", "breeder", "buyer"],
      verification_type: [
        "account_recovery",
        "banking_change",
        "report_investigation",
      ],
    },
  },
} as const
