// src/lib/tracking.ts
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") || "http://localhost:3000";

/**
 * 1×1 transparent gif (for opens)
 */
export function trackingPixelUrl(deliveryId: string) {
  return `${APP_URL}/o/${deliveryId}.gif`;
}

/**
 * Replace hrefs in HTML so clicks go through our redirect logger
 * -> /r?d=<deliveryId>&u=<encodedTarget>
 * NOTE: this is intentionally simple; it catches http(s) anchors.
 */
export function rewriteLinksWithTracking(html: string, deliveryId: string) {
  return html.replace(
    /href="(https?:\/\/[^"]+)"/g,
    (_m, url) => `href="${APP_URL}/r?d=${encodeURIComponent(deliveryId)}&u=${encodeURIComponent(url)}"`
  );
}

/**
 * Append an open pixel at the very end of the HTML body.
 */
export function appendOpenPixel(html: string, deliveryId: string) {
  const pixel = `<img src="${trackingPixelUrl(
    deliveryId
  )}" width="1" height="1" alt="" style="display:none;"/>`;
  // naive injection — ok for MVP
  if (html.includes("</body>")) return html.replace("</body>", `${pixel}</body>`);
  return html + pixel;
}

/**
 * Convenience: full tracking transform (rewrite links + add pixel)
 */
export function withTracking(html: string, deliveryId: string) {
  return appendOpenPixel(rewriteLinksWithTracking(html, deliveryId), deliveryId);
}
