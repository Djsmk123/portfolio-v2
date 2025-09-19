import { createClient } from "@supabase/supabase-js";
import { serverConfig,publicConfig } from "./config";

const supabaseUrl = serverConfig.supabaseUrl! 
const supabaseAnonKey = serverConfig.supabaseAnonKey!
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

type TableName<T extends string> = T extends `${infer Name}`
  ? (typeof publicConfig.isDev extends true ? `dev_${Name}` : Name)
  : never;

export interface Database {
  public: {
    Tables: {
      [K in keyof BaseTables as TableName<Extract<K, string>>]: BaseTables[K]
    }
  }
}

// Define base tables once (without prefix)
interface BaseTables {
  skills: {
    Row: {
      id: string;
      name: string;
      category: string;
      level: string;
      years_of_experience: number;
      color?: string;
      order: number;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      name: string;
      category: string;
      level: string;
      years_of_experience: number;
      color?: string;
      order?: number;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      name?: string;
      category?: string;
      level?: string;
      years_of_experience?: number;
      color?: string;
      order?: number;
      created_at?: string;
      updated_at?: string;
    };
  };
  projects: {
    Row: {
      id: string;
      name: string;
      description: string;
      tags: string[];
      images: string[];
      github?: string;
      website?: string;
      playstore?: string;
      appstore?: string;
      org_name?: string;
      org_logo?: string;
      org_url?: string;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      name: string;
      description: string;
      tags: string[];
      images: string[];
      github?: string;
      website?: string;
      playstore?: string;
      appstore?: string;
      org_name?: string;
      org_logo?: string;
      org_url?: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      name?: string;
      description?: string;
      tags?: string[];
      images?: string[];
      github?: string;
      website?: string;
      playstore?: string;
      appstore?: string;
      org_name?: string;
      org_logo?: string;
      org_url?: string;
      created_at?: string;
      updated_at?: string;
    };
  };
  experiences: {
    Row: {
      id: string;
      title: string;
      company: string;
      location: string;
      date: string;
      description: string;
      type: string;
      order: number;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      title: string;
      company: string;
      location: string;
      date: string;
      description: string;
      type: string;
      order?: number;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      title?: string;
      company?: string;
      location?: string;
      date?: string;
      description?: string;
      type?: string;
      order?: number;
      created_at?: string;
      updated_at?: string;
    };
  };
  social_links: {
    Row: {
      id: string;
      platform: string;
      url: string;
      label: string;
      icon: string;
      is_visible: boolean;
      order: number;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      platform: string;
      url: string;
      label: string;
      icon: string;
      is_visible?: boolean;
      order?: number;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      platform?: string;
      url?: string;
      label?: string;
      icon?: string;
      is_visible?: boolean;
      order?: number;
      created_at?: string;
      updated_at?: string;
    };
  };
  resumes: {
    Row: {
      id: string;
      name: string;
      url: string;
      size: number;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      name: string;
      url: string;
      size: number;
      is_active?: boolean;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      name?: string;
      url?: string;
      size?: number;
      is_active?: boolean;
      created_at?: string;
      updated_at?: string;
    };
  };
}

export const getTableName = <T extends keyof BaseTables & string> (name: T): string => {
  return (publicConfig.isDev ? `dev_${name}` : name)
}
