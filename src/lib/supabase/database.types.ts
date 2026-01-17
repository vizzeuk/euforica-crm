export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          tax_id: string | null
          full_name: string
          email: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tax_id?: string | null
          full_name: string
          email?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tax_id?: string | null
          full_name?: string
          email?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          client_id: string
          description: string | null
          quantity: number
          unit_price: number | null
          total_amount: number | null
          order_date: string
          deadline_date: string
          status: 'pending' | 'in_batch' | 'in_production' | 'completed' | 'delivered' | 'cancelled'
          batch_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          description?: string | null
          quantity: number
          unit_price?: number | null
          total_amount?: number | null
          order_date?: string
          deadline_date: string
          status?: 'pending' | 'in_batch' | 'in_production' | 'completed' | 'delivered' | 'cancelled'
          batch_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          description?: string | null
          quantity?: number
          unit_price?: number | null
          total_amount?: number | null
          order_date?: string
          deadline_date?: string
          status?: 'pending' | 'in_batch' | 'in_production' | 'completed' | 'delivered' | 'cancelled'
          batch_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      production_batches: {
        Row: {
          id: string
          batch_number: string
          target_capacity: number
          actual_quantity: number
          efficiency_percentage: number | null
          planned_date: string | null
          started_at: string | null
          completed_at: string | null
          status: 'planning' | 'ready' | 'in_progress' | 'completed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          batch_number: string
          target_capacity: number
          actual_quantity?: number
          efficiency_percentage?: number | null
          planned_date?: string | null
          started_at?: string | null
          completed_at?: string | null
          status?: 'planning' | 'ready' | 'in_progress' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          batch_number?: string
          target_capacity?: number
          actual_quantity?: number
          efficiency_percentage?: number | null
          planned_date?: string | null
          started_at?: string | null
          completed_at?: string | null
          status?: 'planning' | 'ready' | 'in_progress' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      system_settings: {
        Row: {
          key: string
          value: string
          description: string | null
          updated_at: string
        }
        Insert: {
          key: string
          value: string
          description?: string | null
          updated_at?: string
        }
        Update: {
          key?: string
          value?: string
          description?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      client_statistics: {
        Row: {
          id: string
          full_name: string
          tax_id: string | null
          phone: string | null
          total_orders: number
          total_spent: number
          last_order_date: string | null
          total_units_delivered: number
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
