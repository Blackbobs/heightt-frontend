const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.heightt.app";

export const SITE_URL = configuredSiteUrl.replace(/\/$/, "");
export const SITE_NAME = "Heightt";
export const SITE_TITLE = "Heightt — Student Dues & Payment Management";
export const SITE_DESCRIPTION =
  "Heightt helps student organisations across Africa collect dues digitally, track payments, manage members, and keep reliable financial records.";

export const SOCIAL_IMAGE = {
  url: "/open-graph.png",
  width: 1200,
  height: 630,
  alt: "Heightt — Stop chasing student dues. Start managing them.",
} as const;
