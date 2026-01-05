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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
      emails: {
        Row: {
          created_at: string
          email: string
          email_confirmed_at: string | null
          id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          email_confirmed_at?: string | null
          id?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          email_confirmed_at?: string | null
          id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emails_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: number
          is_favorite: boolean
          post_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_favorite?: boolean
          post_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          is_favorite?: boolean
          post_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: number
          marketing_emails: boolean
          security_emails: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          marketing_emails?: boolean
          security_emails?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          marketing_emails?: boolean
          security_emails?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          id: number
          post_id: number
          tag_id: number
          user_id: string
        }
        Insert: {
          id?: number
          post_id: number
          tag_id: number
          user_id: string
        }
        Update: {
          id?: number
          post_id?: number
          tag_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      postmeta: {
        Row: {
          id: number
          meta_key: string
          meta_value: string | null
          post_id: number
        }
        Insert: {
          id?: number
          meta_key: string
          meta_value?: string | null
          post_id: number
        }
        Update: {
          id?: number
          meta_key?: string
          meta_value?: string | null
          post_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "postmeta_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          banned_until: string | null
          content: string | null
          created_at: string
          date: string | null
          deleted_at: string | null
          description: string | null
          id: number
          is_ban: boolean
          keywords: string | null
          password: string | null
          permalink: string | null
          slug: string | null
          status: string
          thumbnail_url: string | null
          title: string | null
          type: string
          updated_at: string
          user_id: string
          title_content: string | null
          title_description: string | null
          title_description_content: string | null
          title_description_keywords: string | null
          title_keywords: string | null
        }
        Insert: {
          banned_until?: string | null
          content?: string | null
          created_at?: string
          date?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: number
          is_ban?: boolean
          keywords?: string | null
          password?: string | null
          permalink?: string | null
          slug?: string | null
          status?: string
          thumbnail_url?: string | null
          title?: string | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          banned_until?: string | null
          content?: string | null
          created_at?: string
          date?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: number
          is_ban?: boolean
          keywords?: string | null
          password?: string | null
          permalink?: string | null
          slug?: string | null
          status?: string
          thumbnail_url?: string | null
          title?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          id: number
          permission: string
          role: string
        }
        Insert: {
          id?: number
          permission: string
          role: string
        }
        Update: {
          id?: number
          permission?: string
          role?: string
        }
        Relationships: []
      }
      statistics: {
        Row: {
          browser: Json | null
          created_at: string
          id: number
          ip: unknown
          location: string | null
          path: string | null
          query: string | null
          referrer: string | null
          title: string | null
          user_agent: string | null
          user_id: string | null
          visitor_id: string
        }
        Insert: {
          browser?: Json | null
          created_at?: string
          id?: number
          ip?: unknown
          location?: string | null
          path?: string | null
          query?: string | null
          referrer?: string | null
          title?: string | null
          user_agent?: string | null
          user_id?: string | null
          visitor_id: string
        }
        Update: {
          browser?: Json | null
          created_at?: string
          id?: number
          ip?: unknown
          location?: string | null
          path?: string | null
          query?: string | null
          referrer?: string | null
          title?: string | null
          user_agent?: string | null
          user_id?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "statistics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tagmeta: {
        Row: {
          id: number
          meta_key: string
          meta_value: string | null
          tag_id: number
        }
        Insert: {
          id?: number
          meta_key: string
          meta_value?: string | null
          tag_id: number
        }
        Update: {
          id?: number
          meta_key?: string
          meta_value?: string | null
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tagmeta_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string | null
          slug: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
          slug?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
          slug?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      usermeta: {
        Row: {
          id: number
          meta_key: string
          meta_value: string | null
          user_id: string
        }
        Insert: {
          id?: number
          meta_key: string
          meta_value?: string | null
          user_id: string
        }
        Update: {
          id?: number
          meta_key?: string
          meta_value?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usermeta_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          age: number | null
          avatar_url: string | null
          banned_until: string | null
          bio: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          has_set_password: boolean
          id: string
          is_ban: boolean
          last_name: string | null
          plan: string
          plan_changed_at: string | null
          role: string
          role_changed_at: string | null
          updated_at: string
          username: string
          username_changed_at: string | null
          website: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          banned_until?: string | null
          bio?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          has_set_password?: boolean
          id: string
          is_ban?: boolean
          last_name?: string | null
          plan?: string
          plan_changed_at?: string | null
          role?: string
          role_changed_at?: string | null
          updated_at?: string
          username: string
          username_changed_at?: string | null
          website?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          banned_until?: string | null
          bio?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          has_set_password?: boolean
          id?: string
          is_ban?: boolean
          last_name?: string | null
          plan?: string
          plan_changed_at?: string | null
          role?: string
          role_changed_at?: string | null
          updated_at?: string
          username?: string
          username_changed_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string
          id: number
          is_dislike: number
          is_like: number
          post_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_dislike?: number
          is_like?: number
          post_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          is_dislike?: number
          is_like?: number
          post_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_user_data: { Args: never; Returns: undefined }
      count_posts: {
        Args: { posttype?: string; q?: string; userid: string }
        Returns: {
          count: number
          status: string
        }[]
      }
      create_new_posts: { Args: { data: Json[] }; Returns: undefined }
      create_new_user: {
        Args: { metadata?: Json; password?: string; useremail: string }
        Returns: string
      }
      daily_delete_old_cron_job_run_details: { Args: never; Returns: undefined }
      delete_user: { Args: { useremail: string }; Returns: undefined }
      generate_password: { Args: never; Returns: string }
      generate_post_slug: {
        Args: { postslug: string; userid: string }
        Returns: string
      }
      generate_tag_slug: {
        Args: { tagslug: string; userid: string }
        Returns: string
      }
      generate_username: { Args: { email: string }; Returns: string }
      get_adjacent_post_id: {
        Args: {
          postid: number
          poststatus?: string
          posttype?: string
          userid: string
        }
        Returns: {
          next_id: number
          previous_id: number
        }[]
      }
      get_post_rank_by_views: {
        Args: {
          ascending?: boolean
          head?: boolean
          order_by?: string
          page?: number
          per_page?: number
          q?: string
          username: string
        }
        Returns: {
          path: string
          title: string
          views: number
        }[]
      }
      get_users: {
        Args: { userplan?: string; userrole?: string }
        Returns: {
          age: number | null
          avatar_url: string | null
          banned_until: string | null
          bio: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          has_set_password: boolean
          id: string
          is_ban: boolean
          last_name: string | null
          plan: string
          plan_changed_at: string | null
          role: string
          role_changed_at: string | null
          updated_at: string
          username: string
          username_changed_at: string | null
          website: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "users"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_vote: {
        Args: { postid: number }
        Returns: {
          dislike_count: number
          id: number
          like_count: number
        }[]
      }
      hourly_publish_future_posts: { Args: never; Returns: undefined }
      set_favorite: {
        Args: { isfavorite: boolean; postid: number; userid: string }
        Returns: undefined
      }
      set_post_meta: {
        Args: { metakey: string; metavalue?: string; postid: number }
        Returns: undefined
      }
      set_post_tags: {
        Args: { postid: number; userid: string }
        Returns: undefined
      }
      set_post_views: { Args: { postid: number }; Returns: undefined }
      set_statistics: { Args: { data: Json }; Returns: undefined }
      set_tag: {
        Args: {
          tagdescription?: string
          tagname: string
          tagslug: string
          userid: string
        }
        Returns: {
          created_at: string
          description: string | null
          id: number
          name: string | null
          slug: string | null
          updated_at: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "tags"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      set_tag_meta: {
        Args: { metakey: string; metavalue?: string; tagid: number }
        Returns: undefined
      }
      set_user_meta: {
        Args: { metakey: string; metavalue?: string; userid: number }
        Returns: undefined
      }
      set_user_plan: {
        Args: { useremail?: string; userid?: string; userplan: string }
        Returns: undefined
      }
      set_user_role: {
        Args: { useremail?: string; userid?: string; userrole: string }
        Returns: undefined
      }
      title_content: {
        Args: { "": Database["public"]["Tables"]["posts"]["Row"] }
        Returns: {
          error: true
        } & "the function public.title_content with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
      }
      title_description: {
        Args: { "": Database["public"]["Tables"]["posts"]["Row"] }
        Returns: {
          error: true
        } & "the function public.title_description with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
      }
      title_description_content: {
        Args: { "": Database["public"]["Tables"]["posts"]["Row"] }
        Returns: {
          error: true
        } & "the function public.title_description_content with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
      }
      title_description_keywords: {
        Args: { "": Database["public"]["Tables"]["posts"]["Row"] }
        Returns: {
          error: true
        } & "the function public.title_description_keywords with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
      }
      title_keywords: {
        Args: { "": Database["public"]["Tables"]["posts"]["Row"] }
        Returns: {
          error: true
        } & "the function public.title_keywords with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
      }
      truncate_posts: { Args: never; Returns: undefined }
      truncate_statistics: { Args: never; Returns: undefined }
      verify_user_password: {
        Args: { password: string; userid: string }
        Returns: boolean
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
