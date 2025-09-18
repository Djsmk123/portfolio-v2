import { profileStatsType } from "@/app/data/type"

enum Environment {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    TEST = 'test',
}

export const config = {
    supbaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supbaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    isDev: process.env.NODE_ENV === Environment.DEVELOPMENT,
    isTest: process.env.NODE_ENV === Environment.TEST,
    isProd: process.env.NODE_ENV === Environment.PRODUCTION,
    bucket: process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'portfolio',
    githubUsername: process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'djsmk123',
    devToUsername: process.env.NEXT_PUBLIC_DEV_TO_USERNAME || 'djsmk123',
    githubToken: process.env.NEXT_PUBLIC_GITHUB_TOKEN || '',
}

if (!config.supbaseUrl || !config.supbaseAnonKey) { 
    // Avoid crashing the browser; only exit on the server side
    if (typeof window === 'undefined') {
        process.exit(1)
    }
}