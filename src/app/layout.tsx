import dataFetchingTags from "@/constants/dataFetchingTags";
import { getData } from "@/helpers/data-fetching/data-fetching";
import {
  getMetaKeywords,
  getSiteName,
  getSiteUrl,
  getSiteVerification,
  getTwitterHandle,
} from "@/helpers/config/siteConfig";
import Providers from "@/lib/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const { data: ownerData } = await getData(
    "/owners/getOwner",
    10,
    [dataFetchingTags.owners]
  );

  const siteName = getSiteName();
  const title = ownerData ? `${ownerData.name} | ${ownerData.designation}` : siteName;
  const description = ownerData?.aboutOwner?.split("\n")[0] || siteName;
  const twitterHandle = getTwitterHandle();
  const verification = getSiteVerification();

  return {
    title,
    description,
    icons: ownerData?.photoUrl
      ? {
          icon: ownerData.photoUrl,
          apple: ownerData.photoUrl,
          shortcut: ownerData.photoUrl,
        }
      : undefined,
    metadataBase: new URL(getSiteUrl()),
    openGraph: {
      type: "website",
      url: "/",
      title,
      description,
      siteName: ownerData?.name || siteName,
      images: ownerData?.photoUrl ? [{ url: ownerData.photoUrl }] : [],
      locale: "en_US",
    },
    keywords: getMetaKeywords(ownerData?.metaKeywords),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ownerData?.photoUrl ? [{ url: ownerData.photoUrl }] : [],
      ...(twitterHandle ? { site: twitterHandle, creator: twitterHandle } : {}),
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: false,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </Providers>
  );
}
