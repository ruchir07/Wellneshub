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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      academic_events: {
        Row: {
          completed: boolean
          created_at: string
          description: string | null
          due_date: string
          event_type: string
          id: string
          priority: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date: string
          event_type: string
          id?: string
          priority?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string
          event_type?: string
          id?: string
          priority?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      counselors: {
        Row: {
          availability_schedule: Json | null
          bio: string | null
          created_at: string
          email: string | null
          id: string
          institution_id: string | null
          is_active: boolean | null
          name: string
          phone: string | null
          specialization: string[] | null
          updated_at: string
        }
        Insert: {
          availability_schedule?: Json | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          name: string
          phone?: string | null
          specialization?: string[] | null
          updated_at?: string
        }
        Update: {
          availability_schedule?: Json | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          name?: string
          phone?: string | null
          specialization?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "counselors_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_comments: {
        Row: {
          anonymous: boolean
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
          votes: number
        }
        Insert: {
          anonymous?: boolean
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
          votes?: number
        }
        Update: {
          anonymous?: boolean
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
          votes?: number
        }
        Relationships: [
          {
            foreignKeyName: "forum_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          anonymous: boolean
          category: string
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
          votes: number
        }
        Insert: {
          anonymous?: boolean
          category?: string
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
          votes?: number
        }
        Update: {
          anonymous?: boolean
          category?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
          votes?: number
        }
        Relationships: []
      }
      institutions: {
        Row: {
          contact_email: string | null
          created_at: string
          domain: string | null
          emergency_number: string | null
          helpline_number: string | null
          id: string
          logo_url: string | null
          name: string
          primary_color: string | null
          secondary_color: string | null
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          domain?: string | null
          emergency_number?: string | null
          helpline_number?: string | null
          id?: string
          logo_url?: string | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          domain?: string | null
          emergency_number?: string | null
          helpline_number?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      mental_health_assessments: {
        Row: {
          assessment_type: string
          created_at: string
          flagged_for_intervention: boolean | null
          id: string
          recommendations: string | null
          responses: Json
          severity_level: string | null
          total_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_type?: string
          created_at?: string
          flagged_for_intervention?: boolean | null
          id?: string
          recommendations?: string | null
          responses?: Json
          severity_level?: string | null
          total_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_type?: string
          created_at?: string
          flagged_for_intervention?: boolean | null
          id?: string
          recommendations?: string | null
          responses?: Json
          severity_level?: string | null
          total_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          anonymous_username: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          anonymous_username?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          anonymous_username?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stress_assessments: {
        Row: {
          academic_event_id: string
          additional_concerns: string | null
          confidence_level: number
          created_at: string
          id: string
          stress_level: number
          user_id: string
        }
        Insert: {
          academic_event_id: string
          additional_concerns?: string | null
          confidence_level: number
          created_at?: string
          id?: string
          stress_level: number
          user_id: string
        }
        Update: {
          academic_event_id?: string
          additional_concerns?: string | null
          confidence_level?: number
          created_at?: string
          id?: string
          stress_level?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stress_assessments_academic_event_id_fkey"
            columns: ["academic_event_id"]
            isOneToOne: false
            referencedRelation: "academic_events"
            referencedColumns: ["id"]
          },
        ]
      }
      support_resources: {
        Row: {
          category: string[] | null
          created_at: string
          description: string | null
          id: string
          institution_id: string | null
          is_active: boolean | null
          priority: number | null
          resource_type: string
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          category?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          priority?: number | null
          resource_type: string
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          category?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          priority?: number | null
          resource_type?: string
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_resources_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_institutions: {
        Row: {
          created_at: string
          id: string
          institution_id: string | null
          is_active: boolean | null
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          institution_id?: string | null
          is_active?: boolean | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_institutions_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_anonymous_username: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_public_counselor_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          availability_schedule: Json
          bio: string
          id: string
          is_active: boolean
          name: string
          specialization: string[]
        }[]
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
