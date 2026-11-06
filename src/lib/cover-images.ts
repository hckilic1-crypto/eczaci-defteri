import variants from '../generated/cover-variants.json';
import seoManifest from '../generated/image-seo.json';

/** Source covers remain the fallback in development, for unsupported formats and missing files. */
type CoverVariant = { width: number; url: string };
const manifest = variants as Record<string, CoverVariant[]>;

export function responsiveCover(source: string | null | undefined, kind: 'card' | 'article' = 'card') {
  if (!source) return { src: undefined, srcset: undefined, sizes: undefined };
  const seo = (seoManifest as Record<string, {src:string; alt:string; title:string; variants: CoverVariant[]}>)[source];
  if (seo) {
    const availableSeo = seo.variants ?? [];
    const width = kind === 'card' ? 480 : 1200;
    const chosen = availableSeo.find(item => item.width >= width) ?? availableSeo[availableSeo.length - 1];
    return {
      src: chosen?.url ?? seo.src,
      srcset: availableSeo.length ? availableSeo.map(item => `${item.url} ${item.width}w`).join(', ') : undefined,
      sizes: kind === 'card' ? '(max-width: 600px) calc(100vw - 40px), (max-width: 1000px) 50vw, 360px' : '(max-width: 1200px) calc(100vw - 40px), 1140px'
    };
  }
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

/** Editorial ALT and title metadata, keyed by original source path. */
export function imageSeoMetadata(source: string | null | undefined) {
  const seo = source ? (seoManifest as Record<string, {src:string; alt:string; title:string}>)[source] : undefined;
  return { alt: seo?.alt || '', title: seo?.title || undefined, url: seo?.src || source || undefined };
}
