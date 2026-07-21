// Ported from the old Express server:
// fullstack-portfolio-server/src/app/modules/auth/auth.interface.ts
export type ILoginUser = {
  email: string;
  password: string;
};

export type ILoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};
