export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      locked_savings: {
        Row: {
          amount: number
          can_use_as_collateral: boolean | null
          created_at: string | null
          id: string
          interest_rate: number | null
          is_active: boolean | null
          lock_date: string | null
          unlock_date: string
          user_id: string
        }
        Insert: {
          amount: number
          can_use_as_collateral?: boolean | null
          created_at?: string | null
          id?: string
          interest_rate?: number | null
          is_active?: boolean | null
          lock_date?: string | null
          unlock_date: string
          user_id: string
        }
        Update: {
          amount?: number
          can_use_as_collateral?: boolean | null
          created_at?: string | null
          id?: string
          interest_rate?: number | null
          is_active?: boolean | null
          lock_date?: string | null
          unlock_date?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          bvn: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          full_name: string
          id: string
          nin: string | null
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          bvn?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          full_name: string
          id: string
          nin?: string | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          bvn?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          full_name?: string
          id?: string
          nin?: string | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_credit_scores: {
        Row: {
          credit_mix_score: number | null
          credit_score: number
          credit_utilization_score: number | null
          factors_affecting_score: Json | null
          id: string
          length_of_credit_score: number | null
          new_credit_score: number | null
          payment_history_score: number | null
          score_date: string | null
          user_id: string
        }
        Insert: {
          credit_mix_score?: number | null
          credit_score?: number
          credit_utilization_score?: number | null
          factors_affecting_score?: Json | null
          id?: string
          length_of_credit_score?: number | null
          new_credit_score?: number | null
          payment_history_score?: number | null
          score_date?: string | null
          user_id: string
        }
        Update: {
          credit_mix_score?: number | null
          credit_score?: number
          credit_utilization_score?: number | null
          factors_affecting_score?: Json | null
          id?: string
          length_of_credit_score?: number | null
          new_credit_score?: number | null
          payment_history_score?: number | null
          score_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_debts: {
        Row: {
          created_at: string | null
          creditor_name: string
          current_balance: number
          debt_type: string
          due_date: string
          id: string
          interest_rate: number
          minimum_payment: number
          principal_amount: number
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          creditor_name: string
          current_balance: number
          debt_type: string
          due_date: string
          id?: string
          interest_rate: number
          minimum_payment: number
          principal_amount: number
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          creditor_name?: string
          current_balance?: number
          debt_type?: string
          due_date?: string
          id?: string
          interest_rate?: number
          minimum_payment?: number
          principal_amount?: number
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_loans: {
        Row: {
          collateral_amount: number | null
          collateral_savings_id: string | null
          created_at: string | null
          disbursement_date: string | null
          id: string
          interest_rate: number
          loan_amount: number
          loan_type: string
          monthly_payment: number
          next_payment_date: string | null
          remaining_balance: number
          status: string | null
          term_months: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          collateral_amount?: number | null
          collateral_savings_id?: string | null
          created_at?: string | null
          disbursement_date?: string | null
          id?: string
          interest_rate: number
          loan_amount: number
          loan_type: string
          monthly_payment: number
          next_payment_date?: string | null
          remaining_balance: number
          status?: string | null
          term_months: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          collateral_amount?: number | null
          collateral_savings_id?: string | null
          created_at?: string | null
          disbursement_date?: string | null
          id?: string
          interest_rate?: number
          loan_amount?: number
          loan_type?: string
          monthly_payment?: number
          next_payment_date?: string | null
          remaining_balance?: number
          status?: string | null
          term_months?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_loans_collateral_savings_id_fkey"
            columns: ["collateral_savings_id"]
            isOneToOne: false
            referencedRelation: "locked_savings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_portfolios: {
        Row: {
          cash_balance: number | null
          created_at: string | null
          id: string
          locked_savings: number | null
          total_investments: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cash_balance?: number | null
          created_at?: string | null
          id?: string
          locked_savings?: number | null
          total_investments?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cash_balance?: number | null
          created_at?: string | null
          id?: string
          locked_savings?: number | null
          total_investments?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_tax_records: {
        Row: {
          capital_gains_tax: number | null
          created_at: string | null
          filing_date: string | null
          id: string
          income_tax: number | null
          tax_status: string | null
          tax_year: number
          total_tax_paid: number | null
          updated_at: string | null
          user_id: string
          withholding_tax: number | null
        }
        Insert: {
          capital_gains_tax?: number | null
          created_at?: string | null
          filing_date?: string | null
          id?: string
          income_tax?: number | null
          tax_status?: string | null
          tax_year: number
          total_tax_paid?: number | null
          updated_at?: string | null
          user_id: string
          withholding_tax?: number | null
        }
        Update: {
          capital_gains_tax?: number | null
          created_at?: string | null
          filing_date?: string | null
          id?: string
          income_tax?: number | null
          tax_status?: string | null
          tax_year?: number
          total_tax_paid?: number | null
          updated_at?: string | null
          user_id?: string
          withholding_tax?: number | null
        }
        Relationships: []
      }
      user_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          quantity: number | null
          symbol: string | null
          tax_amount: number | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          quantity?: number | null
          symbol?: string | null
          tax_amount?: number | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          quantity?: number | null
          symbol?: string | null
          tax_amount?: number | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_capital_gains_tax: {
        Args: { gain_amount: number }
        Returns: number
      }
      update_credit_score: {
        Args: { user_uuid: string }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
