import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { PROFILE, PROJECTS } from "@/lib/projects";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Derived from the single source of truth — nothing hardcoded twice.
const SITE = `https://${PROFILE.domain}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Plattnericus · Hub",
  description:
    "An interactive low-poly 3D island where every object is one of my projects — POKYH, self-hosted cloud, Proxmox, games and more.",
  authors: [{ name: "Plattnericus" }],
  keywords: ["Plattnericus", "portfolio", "projects", "three.js", "developer", "self-hosted"],
  openGraph: {
    title: "Plattnericus · Hub",
    description:
      "An interactive low-poly 3D island where every object is one of my projects.",
    url: SITE,
    siteName: "Plattnericus Hub",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Plattnericus Hub" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plattnericus · Hub",
    description: "An interactive low-poly 3D island portfolio.",
    images: ["/og.png"],
  },
  icons: { icon: "/pfp.jpg" },
};

export const viewport: Viewport = {
  themeColor: "#0a0e14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: PROFILE.name,
      alternateName: PROFILE.firstName,
      url: SITE,
      email: `mailto:${PROFILE.email}`,
      jobTitle: "Apprentice software developer",
      address: { "@type": "PostalAddress", addressRegion: PROFILE.location },
      sameAs: [PROFILE.github],
    },
    {
      "@type": "WebSite",
      name: "Plattnericus Hub",
      url: SITE,
      author: { "@type": "Person", name: PROFILE.name },
    },
    {
      "@type": "ItemList",
      name: "Projects by Plattnericus",
      itemListElement: PROJECTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        description: p.description,
        url: p.links[0].href,
      })),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
