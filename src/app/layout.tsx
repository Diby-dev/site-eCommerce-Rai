import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  applicationName: "E-Shirt-R",
  title: {
    default: "E-Shirt-R | T-shirts tendance",
    template: "%s | E-Shirt-R",
  },
  description:
    "Découvrez les t-shirts tendance d'E-Shirt-R : des modèles de qualité, disponibles dans plusieurs couleurs et tailles.",
  keywords: ["t-shirt", "t-shirts", "mode", "vêtements", "E-Shirt-R"],
  authors: [{ name: "E-Shirt-R" }],
  creator: "E-Shirt-R",
  publisher: "E-Shirt-R",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "E-Shirt-R",
    title: "E-Shirt-R | T-shirts tendance",
    description:
      "Découvrez nos t-shirts tendance et trouvez le modèle qui vous ressemble.",
    url: "/",
    images: [{ url: "/logo.png", alt: "Logo E-Shirt-R" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Shirt-R | T-shirts tendance",
    description:
      "Découvrez nos t-shirts tendance et trouvez le modèle qui vous ressemble.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
