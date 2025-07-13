export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      companies: {
        Row: {
          company_id: string
          created_at: string
          name: string
        }
        Insert: {
          company_id?: string
          created_at?: string
          name: string
        }
        Update: {
          company_id?: string
          created_at?: string
          name?: string
        }
        Relationships: []
      }
      deliveries: {
        Row: {
          assigned_at: string | null
          eta: string | null
          order_id: string
          rider_id: string | null
          status: Database["public"]["Enums"]["OrderStatus"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          eta?: string | null
          order_id: string
          rider_id?: string | null
          status?: Database["public"]["Enums"]["OrderStatus"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          eta?: string | null
          order_id?: string
          rider_id?: string | null
          status?: Database["public"]["Enums"]["OrderStatus"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "Deliveries_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "Deliveries_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          description: string
          dropoff: Json | null
          extras: Json | null
          order_id: string
          order_type: Database["public"]["Enums"]["OrderType"]
          pickup: Json | null
          price: number | null
          ref_number: number
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          dropoff?: Json | null
          extras?: Json | null
          order_id?: string
          order_type: Database["public"]["Enums"]["OrderType"]
          pickup?: Json | null
          price?: number | null
          ref_number?: number
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string
          dropoff?: Json | null
          extras?: Json | null
          order_id?: string
          order_type?: Database["public"]["Enums"]["OrderType"]
          pickup?: Json | null
          price?: number | null
          ref_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Orders_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          metadata: Json | null
          profile_id: string
          role: Database["public"]["Enums"]["UserRole"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          metadata?: Json | null
          profile_id?: string
          role: Database["public"]["Enums"]["UserRole"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          metadata?: Json | null
          profile_id?: string
          role?: Database["public"]["Enums"]["UserRole"]
          user_id?: string | null
        }
        Relationships: []
      }
      riders: {
        Row: {
          company_id: string | null
          created_at: string
          is_available: boolean
          location: unknown | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          is_available?: boolean
          location?: unknown | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          is_available?: boolean
          location?: unknown | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Riders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "Riders_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fn_find_nearest_riders: {
        Args: {
          user_lat: number
          user_lng: number
          max_distance?: number
          filter_company_id?: string
        }
        Returns: {
          rider_id: string
          metadata: Json
          distance: number
          is_available: boolean
        }[]
      }
    }
    Enums: {
      OrderStatus:
        | "pending"
        | "accepted"
        | "processing"
        | "completed"
        | "cancelled"
      OrderType: "delivery" | "food" | "errands" | "grocery"
      UserRole: "customer" | "rider" | "company"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      OrderStatus: [
        "pending",
        "accepted",
        "processing",
        "completed",
        "cancelled",
      ],
      OrderType: ["delivery", "food", "errands", "grocery"],
      UserRole: ["customer", "rider", "company"],
    },
  },
} as const
