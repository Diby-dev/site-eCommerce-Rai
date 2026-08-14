import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  const { data: tshirts, error } = await supabase
    .from("tshirt")
    .select("id_tshirt");

  if (error || !tshirts) {
    console.error("Impossible de générer le sitemap des produits :", error);
    return [
      {
        url: siteUrl.toString(),
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }

  return [
    {
      url: siteUrl.toString(),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...tshirts.map((tshirt) => ({
      url: new URL(`/produits/${tshirt.id_tshirt}`, siteUrl).toString(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
