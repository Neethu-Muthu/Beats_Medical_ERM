import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string;
          name: string;
          mobile: string;
          role: 'CEO' | 'Director' | 'Employee';
          department: string;
          designation: string;
          member_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          mobile: string;
          role: 'CEO' | 'Director' | 'Employee';
          department: string;
          designation: string;
          member_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          mobile?: string;
          role?: 'CEO' | 'Director' | 'Employee';
          department?: string;
          designation?: string;
          member_id?: string;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          assigned_to: string;
          assigned_by: string;
          due_date: string;
          status: 'pending' | 'in-progress' | 'completed';
          priority: 'low' | 'medium' | 'high';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          assigned_to: string;
          assigned_by: string;
          due_date: string;
          status?: 'pending' | 'in-progress' | 'completed';
          priority?: 'low' | 'medium' | 'high';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          assigned_to?: string;
          assigned_by?: string;
          due_date?: string;
          status?: 'pending' | 'in-progress' | 'completed';
          priority?: 'low' | 'medium' | 'high';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};