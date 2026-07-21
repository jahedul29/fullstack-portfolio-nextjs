const DEFAULT_SITE_NAME = "Portfolio";

const DEFAULT_META_KEYWORDS = [
  "portfolio",
  "developer portfolio",
  "software engineer",
  "full stack developer",
  "web development",
];

export const getSiteUrl = (): string => {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return base.replace(/\/$/, "");
};

export const getSiteName = (): string =>
  process.env.NEXT_PUBLIC_SITE_NAME || DEFAULT_SITE_NAME;

export const getTwitterHandle = (): string | undefined =>
  process.env.NEXT_PUBLIC_TWITTER_HANDLE || undefined;

export type SiteVerification = {
  google?: string;
  yandex?: string;
  yahoo?: string;
};

export const getSiteVerification = (): SiteVerification => {
  const verification: SiteVerification = {};

  if (process.env.SITE_VERIFICATION_GOOGLE) {
    verification.google = process.env.SITE_VERIFICATION_GOOGLE;
  }
  if (process.env.SITE_VERIFICATION_YANDEX) {
    verification.yandex = process.env.SITE_VERIFICATION_YANDEX;
  }
  if (process.env.SITE_VERIFICATION_YAHOO) {
    verification.yahoo = process.env.SITE_VERIFICATION_YAHOO;
  }

  return verification;
};

export const defaultMetaKeywords = DEFAULT_META_KEYWORDS;

export const getMetaKeywords = (ownerKeywords?: string[]): string[] => {
  const merged = new Set([...DEFAULT_META_KEYWORDS, ...(ownerKeywords ?? [])]);
  return Array.from(merged);
};
