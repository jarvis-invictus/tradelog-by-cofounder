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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          mt5_account_id: string | null
          plan_tier: 'free' | 'pro'
          razorpay_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          mt5_account_id?: string | null
          plan_tier?: 'free' | 'pro'
          razorpay_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          mt5_account_id?: string | null
          plan_tier?: 'free' | 'pro'
          razorpay_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          user_id: string
          pair: string
          side: 'buy' | 'sell'
          lot_size: number
          entry_price: number
          exit_price: number | null
          stop_loss: number | null
          take_profit: number | null
          pnl_inr: number | null
          pnl_pips: number | null
          session: 'asian' | 'london' | 'new_york' | 'overlap' | null
          opened_at: string
          closed_at: string | null
          mt5_trade_id: string | null
          status: 'open' | 'closed'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pair: string
          side: 'buy' | 'sell'
          lot_size: number
          entry_price: number
          exit_price?: number | null
          stop_loss?: number | null
          take_profit?: number | null
          pnl_inr?: number | null
          pnl_pips?: number | null
          session?: 'asian' | 'london' | 'new_york' | 'overlap' | null
          opened_at: string
          closed_at?: string | null
          mt5_trade_id?: string | null
          status?: 'open' | 'closed'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pair?: string
          side?: 'buy' | 'sell'
          lot_size?: number
          entry_price?: number
          exit_price?: number | null
          stop_loss?: number | null
          take_profit?: number | null
          pnl_inr?: number | null
          pnl_pips?: number | null
          session?: 'asian' | 'london' | 'new_york' | 'overlap' | null
          opened_at?: string
          closed_at?: string | null
          mt5_trade_id?: string | null
          status?: 'open' | 'closed'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rules: {
        Row: {
          id: string
          user_id: string
          type: 'max_trades_per_day' | 'max_daily_loss_inr' | 'min_risk_reward' | 'no_trading_after_loss' | 'max_lot_size' | 'allowed_pairs' | 'allowed_sessions'
          label: string
          threshold: Json
          enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'max_trades_per_day' | 'max_daily_loss_inr' | 'min_risk_reward' | 'no_trading_after_loss' | 'max_lot_size' | 'allowed_pairs' | 'allowed_sessions'
          label: string
          threshold: Json
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'max_trades_per_day' | 'max_daily_loss_inr' | 'min_risk_reward' | 'no_trading_after_loss' | 'max_lot_size' | 'allowed_pairs' | 'allowed_sessions'
          label?: string
          threshold?: Json
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      rule_violations: {
        Row: {
          id: string
          user_id: string
          rule_id: string
          trade_id: string | null
          override_reason: string | null
          overridden: boolean
          occurred_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          rule_id: string
          trade_id?: string | null
          override_reason?: string | null
          overridden?: boolean
          occurred_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          rule_id?: string
          trade_id?: string | null
          override_reason?: string | null
          overridden?: boolean
          occurred_at?: string
          created_at?: string
        }
      }
      journals: {
        Row: {
          id: string
          user_id: string
          trade_id: string | null
          content: string
          sentiment: 'positive' | 'negative' | 'neutral' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trade_id?: string | null
          content: string
          sentiment?: 'positive' | 'negative' | 'neutral' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trade_id?: string | null
          content?: string
          sentiment?: 'positive' | 'negative' | 'neutral' | null
          created_at?: string
          updated_at?: string
        }
      }
      insights: {
        Row: {
          id: string
          user_id: string
          trade_id: string | null
          type: 'post_trade' | 'weekly' | 'behavioral'
          content: string
          patterns: Json | null
          generated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trade_id?: string | null
          type: 'post_trade' | 'weekly' | 'behavioral'
          content: string
          patterns?: Json | null
          generated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trade_id?: string | null
          type?: 'post_trade' | 'weekly' | 'behavioral'
          content?: string
          patterns?: Json | null
          generated_at?: string
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          razorpay_subscription_id: string | null
          razorpay_plan_id: string | null
          status: 'active' | 'cancelled' | 'expired' | 'pending'
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          razorpay_subscription_id?: string | null
          razorpay_plan_id?: string | null
          status?: 'active' | 'cancelled' | 'expired' | 'pending'
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          razorpay_subscription_id?: string | null
          razorpay_plan_id?: string | null
          status?: 'active' | 'cancelled' | 'expired' | 'pending'
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
