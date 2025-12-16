import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/admin", "/settings", "/audit-logs"],
    },
    sitemap: "https://invexia.app/sitemap.xml",
  }
}
