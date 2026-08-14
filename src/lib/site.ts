/**
 * URL publique de référence du site. À renseigner dans Vercel avec, par exemple,
 * NEXT_PUBLIC_SITE_URL=https://www.votre-domaine.com (sans slash final).
 */
export function getSiteUrl(): URL | undefined {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (!configuredUrl) return undefined;

  try {
    return new URL(
      configuredUrl.startsWith("http")
        ? configuredUrl
        : `https://${configuredUrl}`
    );
  } catch {
    return undefined;
  }
}
