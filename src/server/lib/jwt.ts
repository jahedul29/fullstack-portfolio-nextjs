// Ported near-verbatim from the old Express server:
// fullstack-portfolio-server/src/helpers/jwtHelpers.ts
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const createToken = (payload: object, secret: Secret, expiresIn: string): string => {
  // @types/jsonwebtoken narrows `expiresIn` to a `ms`-style literal union;
  // env-driven values (e.g. "1d") are only known as `string` at compile
  // time, so the options object is cast to keep this a plain runtime string
  // pass-through, matching the old server's behavior.
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
