export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://griffindow.com/sitemap.xml",
  } as const;
}

export const dynamic = "force-static";


