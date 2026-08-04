import Script from 'next/script';

const cloudflareWebAnalyticsToken = process.env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN?.trim();

export default function CloudflareWebAnalytics() {
  if (process.env.NODE_ENV !== 'production' || !cloudflareWebAnalyticsToken) {
    return null;
  }

  return (
    <Script
      id="cloudflare-web-analytics"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token: cloudflareWebAnalyticsToken })}
    />
  );
}
