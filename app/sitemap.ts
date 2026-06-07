import type { MetadataRoute } from "next";
import { PROFILE } from "@/lib/projects";

export const dynamic = "force-static";

const SITE = `https://${PROFILE.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/#projects`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/#portfolio`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
