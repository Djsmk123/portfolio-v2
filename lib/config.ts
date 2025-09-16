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
}

if (!config.supbaseUrl || !config.supbaseAnonKey) { 
    // Avoid crashing the browser; only exit on the server side
    if (typeof window === 'undefined') {
        process.exit(1)
    }
}