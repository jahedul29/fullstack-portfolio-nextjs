// Typed env accessor. Values are read lazily (via getters) so a missing
// required var only throws when that specific value is actually used —
// safe to import this module anywhere (including at cold start) without
// every env var being present yet.

type JwtConfig = {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
};

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

type AppConfig = {
  env: string;
  port: string;
  databaseUrl: string;
  bcryptSaltRounds: string;
  jwt: JwtConfig;
  cloudinary: CloudinaryConfig;
};

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const config: AppConfig = {
  get env() {
    return process.env.NODE_ENV ?? "development";
  },
  get port() {
    return process.env.PORT ?? "3000";
  },
  get databaseUrl() {
    return requireEnv("DATABASE_URL");
  },
  get bcryptSaltRounds() {
    return process.env.BCRYPT_SALT_ROUNDS ?? "12";
  },
  get jwt() {
    return {
      get secret() {
        return requireEnv("JWT_SECRET");
      },
      get expiresIn() {
        return requireEnv("JWT_EXPIRES_IN");
      },
      get refreshSecret() {
        return requireEnv("JWT_REFRESH_SECRET");
      },
      get refreshExpiresIn() {
        return requireEnv("JWT_REFRESH_EXPIRES_IN");
      },
    };
  },
  // Signed Cloudinary uploads (admin panel image fields). Cloud name/key are
  // public (NEXT_PUBLIC_*, also read directly by the client widget) so they
  // fall back to "" instead of throwing; only the secret is required-at-use,
  // since it's only ever touched server-side when actually signing a request.
  get cloudinary() {
    return {
      get cloudName() {
        return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
      },
      get apiKey() {
        return process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ?? "";
      },
      get apiSecret() {
        return requireEnv("CLOUDINARY_API_SECRET");
      },
    };
  },
};
