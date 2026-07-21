import dataFetchingTags from "@/constants/dataFetchingTags";
import { getData } from "@/helpers/data-fetching/data-fetching";
import Providers from "@/lib/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const { data: ownerData, isLoading: isOwnerDataLoading } = await getData(
    "/owners/getOwner",
    10,
    [dataFetchingTags.owners]
  );

  return {
    title: `${ownerData?.name} | ${ownerData?.designation}`,
    description: ownerData?.aboutOwner?.split("\n")[0],
    icons: {
      icon: ownerData?.photoUrl,
      apple: ownerData?.photoUrl,
      shortcut: ownerData?.photoUrl,
    },
    metadataBase: new URL("https://www.jahedulhoque.com"),
    // metadataBase:
    //   typeof window !== "undefined" ? new URL(window.location.href) : undefined,
    openGraph: {
      type: "website",
      url: typeof window !== "undefined" ? window.location.href : "",
      title: `${ownerData?.name} | ${ownerData?.designation}`,
      description: ownerData?.aboutOwner?.split("\n")[0],
      siteName: ownerData?.name,
      images: [{ url: ownerData?.photoUrl }],
      locale: "en_US",
    },
    keywords: ownerData?.metaKeywords,
    twitter: {
      card: ownerData?.name,
      title: `${ownerData?.name} | ${ownerData?.designation}`,
      description: ownerData?.aboutOwner?.split("\n")[0],
      images: [{ url: ownerData?.photoUrl }],
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
    verification: {
      google: "google",
      yandex: "yandex",
      yahoo: "yahoo",
      other: {
        me: ["my-email", "my-link"],
      },
    },
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
