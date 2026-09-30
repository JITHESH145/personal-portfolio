// Set NEXT_PUBLIC_SITE_URL to the production origin before deploying so the
// canonical URL, Open Graph image, robots.txt and sitemap point at it.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const siteTitle =
  "Jithesh Shaju P — Data Science & Machine Learning Specialist";

export const siteDescription =
  "Personal portfolio of Jithesh Shaju P, a Data Science and Machine Learning specialist working across AI, Generative AI, Computer Vision, NLP, and intelligent data-driven applications.";
