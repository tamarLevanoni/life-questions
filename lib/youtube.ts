function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1);
    return parsed.searchParams.get('v');
  } catch {
    return null;
  }
}

export function getYouTubeEmbedUrl(url: string, autoplay = false): string {
  const videoId = extractVideoId(url);
  if (videoId) {
    const params = `controls=0&rel=0&cc_load_policy=0&modestbranding=1&enablejsapi=1${autoplay ? '&autoplay=1' : ''}`;
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
  }
  return url;
}

export function getYouTubeThumbnail(url: string): string | null {
  const videoId = extractVideoId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
