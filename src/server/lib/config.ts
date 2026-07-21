
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
