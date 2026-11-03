import variants from '../generated/cover-variants.json';

/** Source covers remain the fallback in development, for unsupported formats and missing files. */
type CoverVariant = { width: number; url: string };
const manifest = variants as Record<string, CoverVariant[]>;

export function responsiveCover(source: string | null | undefined, kind: 'card' | 'article' = 'card') {
  if (!source) return { src: undefined, srcset: undefined, sizes: undefined };
  const available = manifest[source] ?? [];
  if (!available.length) return { src: source, srcset: undefined, sizes: undefined };
  const preferredWidth = kind === 'card' ? 480 : 1200;
  const preferred = available.find(item => item.width >= preferredWidth) ?? available[available.length - 1];
  return {
    src: preferred.url,
    srcset: available.map(item => `${item.url} ${item.width}w`).join(', '),
    sizes: kind === 'card'
      ? '(max-width: 600px) calc(100vw - 40px), (max-width: 1000px) 50vw, 360px'
      : '(max-width: 1200px) calc(100vw - 40px), 1140px'
  };
}
