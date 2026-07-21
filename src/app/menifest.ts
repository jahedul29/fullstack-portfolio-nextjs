import dataFetchingTags from "@/constants/dataFetchingTags";
import { getData } from "@/helpers/data-fetching/data-fetching";
import { MetadataRoute } from "next";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { data: ownerData, isLoading: isOwnerDataLoading } = await getData(
    "/owners/getOwner",
    10,
    [dataFetchingTags.owners]
  );

  return {
    name: `${ownerData?.name} | ${ownerData?.designation}`,
    short_name: ownerData?.name,
    description: ownerData?.aboutOwner?.split("\n")[0],
    start_url: "/home",
    display: "standalone",
    icons: [
      {
        src: ownerData?.photoUrl,
        sizes: "192x192",
        type: "image/jpg",
      },
      {
        src: ownerData?.photoUrl,
        sizes: "512x512",
        type: "image/jpg",
      },
    ],
    lang: "en",
  };
}
