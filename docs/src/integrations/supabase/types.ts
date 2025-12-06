export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      mezan_workflows: {
        Row: {
          created_at: string;
          description: string | null;
          execution_count: number | null;
          id: string;
          last_executed_at: string | null;
          name: string;
          status: string | null;
          success_rate: number | null;
          updated_at: string;
          user_id: string;
          workflow_definition: Json;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          execution_count?: number | null;
          id?: string;
          last_executed_at?: string | null;
          name: string;
          status?: string | null;
          success_rate?: number | null;
          updated_at?: string;
          user_id: string;
          workflow_definition?: Json;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          execution_count?: number | null;
          id?: string;
          last_executed_at?: string | null;
          name?: string;
          status?: string | null;
          success_rate?: number | null;
          updated_at?: string;
          user_id?: string;
          workflow_definition?: Json;
        };
        Relationships: [];
      };
      optilibria_runs: {
        Row: {
          algorithm: string;
          best_score: number | null;
          completed_at: string | null;
          config: Json | null;
          created_at: string;
          id: string;
          iterations: number | null;
          problem_name: string;
          results: Json | null;
          started_at: string | null;
          status: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          algorithm: string;
          best_score?: number | null;
          completed_at?: string | null;
          config?: Json | null;
          created_at?: string;
          id?: string;
          iterations?: number | null;
          problem_name: string;
          results?: Json | null;
          started_at?: string | null;
          status?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          algorithm?: string;
          best_score?: number | null;
          completed_at?: string | null;
          config?: Json | null;
          created_at?: string;
          id?: string;
          iterations?: number | null;
          problem_name?: string;
          results?: Json | null;
          started_at?: string | null;
          status?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_features: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_enabled: boolean | null;
          name: string;
          order_index: number | null;
          project_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_enabled?: boolean | null;
          name: string;
          order_index?: number | null;
          project_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_enabled?: boolean | null;
          name?: string;
          order_index?: number | null;
          project_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_features_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      project_tech_stack: {
        Row: {
          category: string;
          created_at: string;
          id: string;
          project_id: string;
          technology: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          id?: string;
          project_id: string;
          technology: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          id?: string;
          project_id?: string;
          technology?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_tech_stack_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      projects: {
        Row: {
          category: Database['public']['Enums']['project_category'];
          created_at: string;
          description: string | null;
          id: string;
          is_public: boolean | null;
          name: string;
          owner_id: string | null;
          slug: string;
          status: Database['public']['Enums']['project_status'] | null;
          tagline: string | null;
          updated_at: string;
          version: string | null;
        };
        Insert: {
          category: Database['public']['Enums']['project_category'];
          created_at?: string;
          description?: string | null;
          id?: string;
          is_public?: boolean | null;
          name: string;
          owner_id?: string | null;
          slug: string;
          status?: Database['public']['Enums']['project_status'] | null;
          tagline?: string | null;
          updated_at?: string;
          version?: string | null;
        };
        Update: {
          category?: Database['public']['Enums']['project_category'];
          created_at?: string;
          description?: string | null;
          id?: string;
          is_public?: boolean | null;
          name?: string;
          owner_id?: string | null;
          slug?: string;
          status?: Database['public']['Enums']['project_status'] | null;
          tagline?: string | null;
          updated_at?: string;
          version?: string | null;
        };
        Relationships: [];
      };
      qmlab_experiments: {
        Row: {
          created_at: string;
          id: string;
          measurement_results: Json | null;
          name: string;
          particle_count: number | null;
          quantum_system: string;
          status: string | null;
          updated_at: string;
          user_id: string;
          wave_function_data: Json | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          measurement_results?: Json | null;
          name: string;
          particle_count?: number | null;
          quantum_system: string;
          status?: string | null;
          updated_at?: string;
          user_id: string;
          wave_function_data?: Json | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          measurement_results?: Json | null;
          name?: string;
          particle_count?: number | null;
          quantum_system?: string;
          status?: string | null;
          updated_at?: string;
          user_id?: string;
          wave_function_data?: Json | null;
        };
        Relationships: [];
      };
      simcore_simulations: {
        Row: {
          completed_at: string | null;
          config: Json | null;
          created_at: string;
          id: string;
          name: string;
          progress: number | null;
          results: Json | null;
          simulation_type: string;
          started_at: string | null;
          status: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          config?: Json | null;
          created_at?: string;
          id?: string;
          name: string;
          progress?: number | null;
          results?: Json | null;
          simulation_type: string;
          started_at?: string | null;
          status?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          config?: Json | null;
          created_at?: string;
          id?: string;
          name?: string;
          progress?: number | null;
          results?: Json | null;
          simulation_type?: string;
          started_at?: string | null;
          status?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      soc_teams: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      soc_user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database['public']['Enums']['soc_role'];
          team_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role?: Database['public']['Enums']['soc_role'];
          team_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database['public']['Enums']['soc_role'];
          team_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'soc_user_roles_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'soc_teams';
            referencedColumns: ['id'];
          },
        ];
      };
      talai_experiments: {
        Row: {
          completed_at: string | null;
          created_at: string;
          hyperparameters: Json | null;
          id: string;
          metrics: Json | null;
          model_type: string | null;
          name: string;
          progress: number | null;
          started_at: string | null;
          status: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          hyperparameters?: Json | null;
          id?: string;
          metrics?: Json | null;
          model_type?: string | null;
          name: string;
          progress?: number | null;
          started_at?: string | null;
          status?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          hyperparameters?: Json | null;
          id?: string;
          metrics?: Json | null;
          model_type?: string | null;
          name?: string;
          progress?: number | null;
          started_at?: string | null;
          status?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_project_preferences: {
        Row: {
          created_at: string;
          custom_settings: Json | null;
          id: string;
          last_visited_at: string | null;
          notifications_enabled: boolean | null;
          project_id: string;
          sidebar_collapsed: boolean | null;
          theme_variant: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          custom_settings?: Json | null;
          id?: string;
          last_visited_at?: string | null;
          notifications_enabled?: boolean | null;
          project_id: string;
          sidebar_collapsed?: boolean | null;
          theme_variant?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          custom_settings?: Json | null;
          id?: string;
          last_visited_at?: string | null;
          notifications_enabled?: boolean | null;
          project_id?: string;
          sidebar_collapsed?: boolean | null;
          theme_variant?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_project_preferences_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_team_id: { Args: { _user_id: string }; Returns: string };
      has_soc_role: {
        Args: {
          _role: Database['public']['Enums']['soc_role'];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      project_category:
        | 'scientific-computing'
        | 'enterprise-automation'
        | 'ai-research'
        | 'optimization'
        | 'quantum-mechanics'
        | 'portfolio';
      project_status: 'active' | 'development' | 'beta' | 'deprecated' | 'archived';
      soc_role: 'viewer' | 'analyst' | 'admin' | 'owner';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      project_category: [
        'scientific-computing',
        'enterprise-automation',
        'ai-research',
        'optimization',
        'quantum-mechanics',
        'portfolio',
      ],
      project_status: ['active', 'development', 'beta', 'deprecated', 'archived'],
      soc_role: ['viewer', 'analyst', 'admin', 'owner'],
    },
  },
} as const;
