enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

const isServer = typeof window === 'undefined'

// Public runtime config (safe to expose in the browser)
export const publicConfig = {
  githubUsername: process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'djsmk123',
  devToUsername: process.env.NEXT_PUBLIC_DEV_TO_USERNAME || 'djsmk123',
  isDev: process.env.NODE_ENV === Environment.DEVELOPMENT,
  isTest: process.env.NODE_ENV === Environment.TEST,
  isProd: process.env.NODE_ENV === Environment.PRODUCTION,
}

// Server-only config (MUST NOT use NEXT_PUBLIC_)
export const serverConfig = {
  githubToken: process.env.GITHUB_TOKEN || '',
  bucket: process.env.SUPABASE_BUCKET || 'portfolio',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
}

// Validate required public env only at build/runtime on the server
if (isServer && (!serverConfig.supabaseUrl || !serverConfig.supabaseAnonKey)) {
  process.exit(1)
}