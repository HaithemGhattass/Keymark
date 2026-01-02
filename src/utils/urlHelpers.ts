export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function getFaviconUrl(url: string): string {
  return `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(
    url
  )}`;
}
