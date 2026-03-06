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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          job_posting_id: string
          message: string | null
          status: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          job_posting_id: string
          message?: string | null
          status?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          job_posting_id?: string
          message?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_posting_id_fkey"
            columns: ["job_posting_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_favorites: {
        Row: {
          candidate_id: string
          created_at: string
          employer_id: string
          id: string
          status: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          employer_id: string
          id?: string
          status?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          employer_id?: string
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_favorites_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_favorites_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_techniques: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      catalog_zones: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      employer_candidate_requests: {
        Row: {
          candidate_id: string
          created_at: string
          employer_id: string
          id: string
          specialty: string | null
          status: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          employer_id: string
          id?: string
          specialty?: string | null
          status?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          employer_id?: string
          id?: string
          specialty?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "employer_candidate_requests_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employer_candidate_requests_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          contract_type: string | null
          created_at: string
          description: string | null
          employer_id: string
          id: string
          is_active: boolean | null
          location: string | null
          requirements: string | null
          salary_range: string | null
          specialty: string | null
          title: string
          updated_at: string
        }
        Insert: {
          contract_type?: string | null
          created_at?: string
          description?: string | null
          employer_id: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          requirements?: string | null
          salary_range?: string | null
          specialty?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          contract_type?: string | null
          created_at?: string
          description?: string | null
          employer_id?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          requirements?: string | null
          salary_range?: string | null
          specialty?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company_description: string | null
          company_logo_url: string | null
          company_name: string | null
          created_at: string
          experience_years: number | null
          full_name: string
          id: string
          is_active: boolean | null
          is_litsea_graduate: boolean | null
          location: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          specialties: string[] | null
          updated_at: string
          user_id: string
          website: string | null
          whatsapp: string | null
          zones: string[] | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company_description?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          created_at?: string
          experience_years?: number | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          is_litsea_graduate?: boolean | null
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          specialties?: string[] | null
          updated_at?: string
          user_id: string
          website?: string | null
          whatsapp?: string | null
          zones?: string[] | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company_description?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          created_at?: string
          experience_years?: number | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          is_litsea_graduate?: boolean | null
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          specialties?: string[] | null
          updated_at?: string
          user_id?: string
          website?: string | null
          whatsapp?: string | null
          zones?: string[] | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_admin_role: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      user_role: "candidate" | "employer" | "admin"
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
      user_role: ["candidate", "employer", "admin"],
    },
  },
} as const
