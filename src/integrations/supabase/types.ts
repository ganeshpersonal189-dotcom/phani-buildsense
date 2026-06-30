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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_items: {
        Row: {
          audit_id: string
          id: string
          label: string
          note: string | null
          status: string
        }
        Insert: {
          audit_id: string
          id?: string
          label: string
          note?: string | null
          status?: string
        }
        Update: {
          audit_id?: string
          id?: string
          label?: string
          note?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_items_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
        ]
      }
      audits: {
        Row: {
          category: string
          created_at: string
          id: string
          notes: string | null
          project_id: string | null
          score: number | null
          title: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          notes?: string | null
          project_id?: string | null
          score?: number | null
          title: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          notes?: string | null
          project_id?: string | null
          score?: number | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audits_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      crack_scans: {
        Row: {
          crack_type: string | null
          created_at: string
          depth_mm: number | null
          diagnosis: string | null
          id: string
          image_url: string | null
          length_mm: number | null
          project_id: string | null
          raw_ai: Json | null
          repair_solution: string | null
          severity: string | null
          user_id: string
          width_mm: number | null
        }
        Insert: {
          crack_type?: string | null
          created_at?: string
          depth_mm?: number | null
          diagnosis?: string | null
          id?: string
          image_url?: string | null
          length_mm?: number | null
          project_id?: string | null
          raw_ai?: Json | null
          repair_solution?: string | null
          severity?: string | null
          user_id: string
          width_mm?: number | null
        }
        Update: {
          crack_type?: string | null
          created_at?: string
          depth_mm?: number | null
          diagnosis?: string | null
          id?: string
          image_url?: string | null
          length_mm?: number | null
          project_id?: string | null
          raw_ai?: Json | null
          repair_solution?: string | null
          severity?: string | null
          user_id?: string
          width_mm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crack_scans_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_logs: {
        Row: {
          created_at: string
          id: string
          labor_cost: number
          log_date: string
          material_cost: number
          other_cost: number
          photo_urls: string[] | null
          project_id: string
          user_id: string
          work_summary: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          labor_cost?: number
          log_date?: string
          material_cost?: number
          other_cost?: number
          photo_urls?: string[] | null
          project_id: string
          user_id: string
          work_summary?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          labor_cost?: number
          log_date?: string
          material_cost?: number
          other_cost?: number
          photo_urls?: string[] | null
          project_id?: string
          user_id?: string
          work_summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      groundwater_surveys: {
        Row: {
          created_at: string
          estimated_depth_m: number | null
          id: string
          lat: number
          lng: number
          notes: string | null
          probability: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          estimated_depth_m?: number | null
          id?: string
          lat: number
          lng: number
          notes?: string | null
          probability?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          estimated_depth_m?: number | null
          id?: string
          lat?: number
          lng?: number
          notes?: string | null
          probability?: number | null
          user_id?: string
        }
        Relationships: []
      }
      laborers: {
        Row: {
          available: boolean
          city: string | null
          created_at: string
          daily_rate: number
          experience_years: number | null
          full_name: string
          id: string
          phone: string | null
          rating: number | null
          skill: string
          updated_at: string
          user_id: string
        }
        Insert: {
          available?: boolean
          city?: string | null
          created_at?: string
          daily_rate: number
          experience_years?: number | null
          full_name: string
          id?: string
          phone?: string | null
          rating?: number | null
          skill: string
          updated_at?: string
          user_id: string
        }
        Update: {
          available?: boolean
          city?: string | null
          created_at?: string
          daily_rate?: number
          experience_years?: number | null
          full_name?: string
          id?: string
          phone?: string | null
          rating?: number | null
          skill?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      material_listings: {
        Row: {
          brand: string | null
          city: string | null
          created_at: string
          delivery_days: number | null
          id: string
          in_stock: boolean
          material_type: string
          min_order: number
          rating: number | null
          supplier_id: string
          supplier_name: string | null
          unit: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          brand?: string | null
          city?: string | null
          created_at?: string
          delivery_days?: number | null
          id?: string
          in_stock?: boolean
          material_type: string
          min_order?: number
          rating?: number | null
          supplier_id: string
          supplier_name?: string | null
          unit?: string
          unit_price: number
          updated_at?: string
        }
        Update: {
          brand?: string | null
          city?: string | null
          created_at?: string
          delivery_days?: number | null
          id?: string
          in_stock?: boolean
          material_type?: string
          min_order?: number
          rating?: number | null
          supplier_id?: string
          supplier_name?: string | null
          unit?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          address: string | null
          budget: number | null
          contractor_id: string
          created_at: string
          id: string
          lat: number | null
          lng: number | null
          name: string
          owner_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          budget?: number | null
          contractor_id: string
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          owner_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          budget?: number | null
          contractor_id?: string
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          owner_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "contractor" | "owner" | "laborer" | "supplier" | "admin"
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
      app_role: ["contractor", "owner", "laborer", "supplier", "admin"],
    },
  },
} as const
