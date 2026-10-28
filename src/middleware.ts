import { defineMiddleware } from 'astro:middleware';

/**
 * Keystatic-only cosmetic enhancements. API, OAuth and public blog pages
 * are left untouched. Set ENABLE_EDITOR_ENHANCEMENTS=false to disable.
 */
export const onRequest = defineMiddleware(async ({ request, url }, next) => {
  if (
    process.env.ENABLE_EDITOR_ENHANCEMENTS === 'false' ||
    request.method !== 'GET' ||
    !(url.pathname === '/keystatic' || url.pathname.startsWith('/keystatic/'))
  ) return next();

  const response = await next();
  if (response.status !== 200 ||
      !(response.headers.get('content-type') || '').toLowerCase().includes('text/html')) {
    return response;
  }

  const html = await response.text();
  if (!/<\/head\s*>/i.test(html)) return new Response(html, response);

  const assets = '<link rel="stylesheet" href="/editor-panel.css">' +
    '<script defer src="/editor-panel.js"></script>';
  const headers = new Headers(response.headers);
  for (const key of ['content-length', 'content-encoding', 'etag', 'content-md5']) headers.delete(key);

  return new Response(html.replace(/<\/head\s*>/i, assets + '</head>'), {
    status: response.status, statusText: response.statusText, headers
  });
});