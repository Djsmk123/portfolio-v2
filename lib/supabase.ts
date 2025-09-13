import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          slug: string
          tags: string[]
          link: string
          image?: string
          featured_article?: boolean
          likes?: number
          featured_on_google_dev_library?: boolean
          source?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          slug: string
          tags: string[]
          link: string
          image?: string
          featured_article?: boolean
          likes?: number
          featured_on_google_dev_library?: boolean
          source?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          slug?: string
          tags?: string[]
          link?: string
          image?: string
          featured_article?: boolean
          likes?: number
          featured_on_google_dev_library?: boolean
          source?: string
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string
          level: string
          years_of_experience: number
          color?: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          level: string
          years_of_experience: number
          color?: string
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          level?: string
          years_of_experience?: number
          color?: string
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string
          tags: string[]
          images: string[]
          github?: string
          website?: string
          playstore?: string
          appstore?: string
          org_name?: string
          org_logo?: string
          org_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          tags: string[]
          images: string[]
          github?: string
          website?: string
          playstore?: string
          appstore?: string
          org_name?: string
          org_logo?: string
          org_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          tags?: string[]
          images?: string[]
          github?: string
          website?: string
          playstore?: string
          appstore?: string
          org_name?: string
          org_logo?: string
          org_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      experiences: {
        Row: {
          id: string
          title: string
          company: string
          location: string
          date: string
          description: string
          type: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          company: string
          location: string
          date: string
          description: string
          type: string
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          company?: string
          location?: string
          date?: string
          description?: string
          type?: string
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      social_links: {
        Row: {
          id: string
          platform: string
          url: string
          label: string
          icon: string
          is_visible: boolean
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          platform: string
          url: string
          label: string
          icon: string
          is_visible?: boolean
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform?: string
          url?: string
          label?: string
          icon?: string
          is_visible?: boolean
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          name: string
          url: string
          size: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          url: string
          size: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          url?: string
          size?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
