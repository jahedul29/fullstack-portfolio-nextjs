import dataFetchingTags from "@/constants/dataFetchingTags";
import { getSiteName } from "@/helpers/config/siteConfig";
import { getData } from "@/helpers/data-fetching/data-fetching";
import { MetadataRoute } from "next";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { data: ownerData } = await getData(
    "/owners/getOwner",
    10,
    [dataFetchingTags.owners]
  );

  const siteName = getSiteName();
  const name = ownerData ? `${ownerData.name} | ${ownerData.designation}` : siteName;
  const shortName = ownerData?.name || siteName;
  const description = ownerData?.aboutOwner?.split("\n")[0] || siteName;

  return {
    name,
    short_name: shortName,
    description,
    start_url: "/",
    display: "standalone",
    icons: ownerData?.photoUrl
      ? [
          {
            src: ownerData.photoUrl,
            sizes: "192x192",
            type: "image/jpg",
          },
          {
            src: ownerData.photoUrl,
            sizes: "512x512",
            type: "image/jpg",
          },
        ]
      : [],
    lang: "en",
  };
}
