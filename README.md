# Eczacı Defteri — Astro + Keystatic

## Kurulum
```bash
npm install
npm run dev
```
Site: http://localhost:4321
Admin: http://localhost:4321/keystatic

## Yönetim
Keystatic panelinden:
- Yazılar
- Kategoriler
- Site Ayarları

yönetilebilir. İçerikler Git uyumlu dosyalar olarak `src/content` altında tutulur.

## Production build
```bash
npm run build
```
Bu komut güvenlik ve statik dağıtım kolaylığı için production build sırasında yerel Keystatic rotalarını kapatır. Canlı siteden admin kullanmak istersen Keystatic GitHub storage + uygun Astro server adapter kurulmalıdır.

## Önemli
Bu paket hukuki danışmanlık değildir. Yayına almadan önce KVKK/çerez, iletişim, ticari işbirliği ve sağlık içerikleri bakımından sitenin gerçek kullanım modeline göre hukuk kontrolü yap.
