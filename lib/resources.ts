export type ResourceKind = 'youtube' | 'video' | 'dropbox' | 'supabase' | 'embed' | 'link';
export type ResourceInfo = { kind: ResourceKind; url: string; embedUrl?: string; label: string; downloadable: boolean };

export function detectResource(raw: string): ResourceInfo {
  const parsed = new URL(raw);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Only http and https links are supported.');
  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  if (host === 'youtu.be' || host.endsWith('youtube.com')) {
    const id = host === 'youtu.be' ? parsed.pathname.slice(1) : parsed.searchParams.get('v') || parsed.pathname.split('/').filter(Boolean).pop() || '';
    if (id && /^[\w-]+$/.test(id)) return { kind: 'youtube', url: raw, embedUrl: `https://www.youtube-nocookie.com/embed/${id}`, label: 'YouTube video', downloadable: false };
  }
  if (host.endsWith('dropbox.com')) {
    const preview = new URL(raw); preview.searchParams.set('raw', '1');
    return { kind: 'dropbox', url: raw, embedUrl: preview.toString(), label: 'Dropbox file', downloadable: true };
  }
  if (/\.(mp4|webm|ogg|m4v|mov)(\?.*)?$/i.test(parsed.pathname + parsed.search)) return { kind: 'video', url: raw, label: 'Video file', downloadable: true };
  if (host.endsWith('supabase.co') || host.endsWith('supabase.in')) return { kind: 'supabase', url: raw, label: 'Supabase resource', downloadable: true };
  return { kind: 'link', url: raw, label: 'External resource', downloadable: true };
}

export function safeResource(raw: string): ResourceInfo | null {
  try { return detectResource(raw); } catch { return null; }
}
