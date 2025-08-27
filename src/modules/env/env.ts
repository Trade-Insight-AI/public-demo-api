import { z } from 'zod';

export const envSchema = z.object({
  /// //////////////////////////
  //  Infrastructure
  /// //////////////////////////
  INFRA_PORT: z.coerce.number().optional().default(3333),
  INFRA_URL: z.string().url().default('http://localhost'),
  INFRA_API_VERSION: z.string().default('v1'),
  INFRA_ENVIRONMENT: z.preprocess(
    () => process.env.NODE_ENV, // always use process.env.NODE_ENV
    z.enum(['development', 'production']).default('development'),
  ),

  /// //////////////////////////
  //  Database
  /// //////////////////////////
  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_PORT: z.coerce.number().default(5432),
  DATABASE_USER: z.string().default('postgres'),
  DATABASE_PASSWORD: z.string().default('postgres'),
  DATABASE_DB_NAME: z.string().default('postgres'),
  DATABASE_IGNORE_MIGRATIONS: z.coerce.boolean().default(false),

  /// //////////////////////////
  //  Auth
  /// //////////////////////////
  AUTH_JWT_PRIVATE_KEY: z.string(),
  AUTH_JWT_PUBLIC_KEY: z.string(),
  AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN: z.string(),
  AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN: z.string(),

  /// //////////////////////////
  //  Utilities
  /// //////////////////////////
  UTILITIES_PAGINATION_LIMIT: z.coerce.number().default(100),

  /// //////////////////////////
  //  External APIS
  /// //////////////////////////
  // TIA Provider
  EXTERNAL_TIA_API: z.string().url(),
  EXTERNAL_TIA_CLIENT_ID: z.string(),
  EXTERNAL_TIA_CLIENT_SECRET: z.string(),

  // Discord
  EXTERNAL_DISCORD_WEBHOOK_URL: z.string().url(),
});

export type TEnvironment = z.infer<typeof envSchema>;
