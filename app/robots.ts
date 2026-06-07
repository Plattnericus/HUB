import type { MetadataRoute } from "next";
import { PROFILE } from "@/lib/projects";

export const dynamic = "force-static";

const SITE = `https://${PROFILE.domain}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
