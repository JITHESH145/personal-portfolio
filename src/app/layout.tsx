import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { siteDescription, siteTitle, siteUrl } from "@/lib/site";
import "./globals.css";

// One family with a width axis: wide for display, normal for text.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: "Jithesh Shaju P",
  authors: [{ name: "Jithesh Shaju P", url: "https://github.com/JITHESH145" }],
  creator: "Jithesh Shaju P",
  keywords: [
    "Jithesh Shaju P",
    "Data Science",
    "Machine Learning",
    "Generative AI",
    "Computer Vision",
    "NLP",
    "Python",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: "Jithesh Shaju P",
    title: siteTitle,
    description: siteDescription,
    locale: "en_US",
    firstName: "Jithesh",
    lastName: "Shaju P",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080b12",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
