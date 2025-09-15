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
    const message = 'Supabase URL or anon key is not set'
    // Avoid crashing the browser; only exit on the server side
    if (typeof window === 'undefined') {
        //fatal error on server
        // eslint-disable-next-line no-console
        console.error(message)
        process.exit(1)
    } else {
        // eslint-disable-next-line no-console
        console.error(message)
    }
}