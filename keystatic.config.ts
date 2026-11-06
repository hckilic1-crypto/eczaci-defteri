import { createElement, useEffect } from 'react';
import {
  config,
  collection,
  fields,
  singleton
} from '@keystatic/core';

/**
 * Keystatic itself renders this brand mark. Mounting the editor tools here
 * ensures the enhancements are loaded inside its React admin UI, rather than
 * relying on an Astro HTML middleware that may not run for Keystatic routes.
 */
function EditorBrandMark() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const assets = [
      {id:'eczaci-admin-style-v7', tag:'link', href:'/editor-panel.css?v=7'},
      {id:'eczaci-analytics-style-v6', tag:'link', href:'/editor-analytics.css?v=9'},
      {id:'eczaci-admin-script-v7', tag:'script', src:'/editor-panel.js?v=7'},
      {id:'eczaci-analytics-script-v6', tag:'script', src:'/editor-analytics.js?v=9'},
      {id:'eczaci-image-library-style-v1', tag:'link', href:'/editor-image-library.css?v=1'},
      {id:'eczaci-image-library-script-v1', tag:'script', src:'/editor-image-library.js?v=1'}
    ];
    for (const asset of assets) {
      if (document.getElementById(asset.id)) continue;
      const element = document.createElement(asset.tag);
      element.id = asset.id;
      if (asset.tag === 'link') {
        element.rel = 'stylesheet';
        element.href = asset.href;
        document.head.appendChild(element);
      } else {
        element.src = asset.src;
        element.defer = true;
        document.body.appendChild(element);
      }
    }
  }, []);
  return createElement('img', { src: '/favicon.svg', width: 24, height: 24, alt: '' });
}

export default config({
  storage: {
    kind: 'github',
repo: 'hckilic1-crypto/eczaci-defteri'  },

  ui: {
    brand: {
      name: 'Eczacı Defteri',
      mark: () => createElement(EditorBrandMark)
    },
    navigation: {
      'İçerik Yönetimi': ['posts', 'categories', 'glossary'],
      'Referans Kütüphanesi': ['atlas', 'labelGuides'],
      'Site Yönetimi': ['imageSeo', 'site']
    }
  },

  collections: {
    posts: collection({
      label: 'Yazılar',

      // Liste görünümü: mevcut taslak alanı üzerinden yayında/taslak ayrımı.
      // İşaretli = Taslak, işaretsiz = Yayında. Yayınlama mantığı değişmez.
      columns: ['title', 'editorReviewed', 'draft', 'category', 'publishedAt'],

      slugField: 'title',

      path: 'src/content/posts/*',

      format: {
        contentField: 'content'
      },

      entryLayout: 'content',

      schema: {
        title: fields.slug({
          name: {
            label: 'Başlık',
            validation: {
              isRequired: true
            }
          }
        }),

        excerpt: fields.text({
          label: 'Kısa açıklama',
          multiline: true,
          validation: {
            isRequired: true
          }
        }),

        coverImage: fields.image({
          label: 'Kapak görseli (isteğe bağlı)',
          description: 'Yazı detayında ve sosyal medya önizlemesinde kullanılır. Ana sayfa kartlarının tasarımı değişmez.',
          directory: 'public/images/posts',
          publicPath: '/images/posts/'
        }),

        category: fields.relationship({
          label: 'Kategori',
          collection: 'categories',
          validation: {
            isRequired: true
          }
        }),

        publishedAt: fields.date({
          label: 'Yayın tarihi',
          validation: {
            isRequired: true
          }
        }),

        updatedAt: fields.date({
          label: 'Son güncelleme'
        }),

        featured: fields.checkbox({
          label: 'Öne çıkan yazı',
          defaultValue: false
        }),

        draft: fields.checkbox({
          label: 'Taslak mı?',
          description: 'İşaretliyse yazı sitede yayınlanmaz. İşaretli değilse yayınlanır.',
          defaultValue: false
        }),

        editorReviewed: fields.checkbox({
          label: 'Editör kontrol etti',
          description: 'İçerik, kaynakça, dozlar ve güvenlilik kontrolünden geçtiyse işaretle. Yayın durumunu etkilemez. Yeni ve mevcut yazılar varsayılan olarak kontrol bekler.',
          defaultValue: false
        }),

        readingTime: fields.integer({
          label: 'Okuma süresi (dk)',
          defaultValue: 5,
          validation: {
            min: 1
          }
        }),

        seoTitle: fields.text({
          label: 'SEO başlığı'
        }),

        seoDescription: fields.text({
          label: 'SEO açıklaması',
          multiline: true
        }),

        references: fields.array(
          fields.object({
            label: fields.text({
              label: 'Kaynak adı'
            }),

            url: fields.url({
              label: 'Bağlantı'
            })
          }),
          {
            label: 'Kaynakça',

            itemLabel: (props) =>
              props.fields.label.value ||
              'Kaynak'
          }
        ),

        content: fields.markdoc({
          label: 'İçerik',

          options: {
            image: {
              directory: 'public/uploads',
              publicPath: '/uploads/'
            }
          }
        })
      }
    }),

    imageSeo: collection({
      label: 'Görsel SEO Yönetimi',
      slugField: 'name',
      path: 'src/content/image-seo/*',
      format: { data: 'json' },
      columns: ['sourcePath', 'folder', 'fileName', 'alt'],
      schema: {
        name: fields.slug({ name: { label: 'Kayıt adı', validation: { isRequired: true } } }),
        sourcePath: fields.text({
          label: 'Mevcut görsel yolu',
          description: 'Örnek: /images/posts/yazi-adi/coverImage.webp veya /uploads/resim.png',
          validation: { isRequired: true }
        }),
        folder: fields.text({
          label: 'Yeni SEO klasörü',
          description: 'Örnek: serotonin-sendromu. Görseller /images/seo/ altında yayınlanır.',
          validation: { isRequired: true }
        }),
        fileName: fields.text({
          label: 'Yeni SEO dosya adı (uzantısız)',
          description: 'Örnek: 5-htp-safran-antidepresan-etkilesimi. Uzantı otomatik korunur.',
          validation: { isRequired: true }
        }),
        alt: fields.text({
          label: 'Alternatif metin (ALT)',
          description: 'Görseli gerçekten tarif eden kısa, anlamlı metin.',
          multiline: true,
          validation: { isRequired: true }
        }),
        seoTitle: fields.text({ label: 'Görsel başlığı (title)' }),
        description: fields.text({ label: 'Görsel açıklaması', multiline: true })
      }
    }),

    glossary: collection({
      label: 'Eczacılık Sözlüğü',
      slugField: 'name',
      path: 'src/content/glossary/*',
      format: { data: 'json' },
      columns: ['category', 'draft'],
      schema: {
        name: fields.slug({
          name: {
            label: 'Terim',
            validation: { isRequired: true }
          }
        }),
        category: fields.select({
          label: 'Konu alanı',
          options: [
            { label: 'Farmakoloji', value: 'Farmakoloji' },
            { label: 'Farmasötik Teknoloji', value: 'Farmasötik Teknoloji' },
            { label: 'Klinik Araştırmalar', value: 'Klinik Araştırmalar' },
            { label: 'Mikrobiyota', value: 'Mikrobiyota' },
            { label: 'Dermokozmetik', value: 'Dermokozmetik' },
            { label: 'Takviye Edici Gıdalar', value: 'Takviye Edici Gıdalar' },
            { label: 'Beslenme ve Metabolizma', value: 'Beslenme ve Metabolizma' },
            { label: 'Farmakognozi', value: 'Farmakognozi' },
            { label: 'İlaç Güvenliği', value: 'İlaç Güvenliği' },
            { label: 'Laboratuvar ve Tanı', value: 'Laboratuvar ve Tanı' }
          ],
          defaultValue: 'Farmakoloji'
        }),
        definition: fields.text({
          label: 'Kısa ve net tanım',
          multiline: true,
          validation: { isRequired: true }
        }),
        explanation: fields.text({
          label: 'Eczacının notu (isteğe bağlı)',
          multiline: true,
          description: 'Kavramı açıklayan kısa örnek veya kritik ayrım.'
        }),
        sourceLabel: fields.text({
          label: 'Bilimsel kaynak adı (isteğe bağlı)'
        }),
        sourceUrl: fields.url({
          label: 'Kaynak bağlantısı (isteğe bağlı)'
        }),
        draft: fields.checkbox({
          label: 'Taslak mı?',
          description: 'İşaretli terim sözlükte görünmez.',
          defaultValue: false
        })
      }
    }),


    atlas: collection({
      label: 'Bileşen Atlası',
      slugField: 'name', path: 'src/content/atlas/*',
      format: { data: 'json' }, columns: ['category', 'draft'],
      schema: {
        name: fields.slug({ name: { label: 'Bileşen', validation: { isRequired: true } } }),
        category: fields.select({ label: 'Alan', options: [
          { label: 'Takviye', value: 'Takviye' }, { label: 'Dermokozmetik', value: 'Dermokozmetik' }
        ], defaultValue: 'Takviye' }),
        summary: fields.text({ label: 'Özet', multiline: true, validation: { isRequired: true } }),
        mechanism: fields.text({ label: 'Mekanizma / nedir?', multiline: true }),
        clinical: fields.text({ label: 'Klinik kullanım ve kanıtın sınırı', multiline: true }),
        evidence: fields.text({ label: 'Kanıt düzeyine ilişkin not', multiline: true }),
        dose: fields.text({ label: 'Çalışma dozu / kullanım bağlamı', multiline: true }),
        warnings: fields.text({ label: 'Kontrendikasyon ve uyarılar', multiline: true }),
        interactions: fields.text({ label: 'Olası ilaç etkileşimleri', multiline: true }),
        labelTip: fields.text({ label: 'Etiket okuma ipucu', multiline: true }),
        chemicalIdentity: fields.text({ label: 'Kimyasal kimlik ve yapı açıklaması', multiline: true }),
        molecularFormula: fields.text({ label: 'Molekül formülü (karışım ise açıklama)' }),
        chemicalClass: fields.text({ label: 'Kimyasal sınıf' }),
        sourceChemUrl: fields.url({ label: 'Kimyasal yapı veri tabanı URL' }),
        formulations: fields.text({ label: 'Form ve biyoyararlanım farkları', multiline: true }),
        studiedPopulation: fields.text({ label: 'Hangi gruplarda çalışılmış?', multiline: true }),
        pharmacistChecklist: fields.text({ label: 'Eczacı için değerlendirme listesi', multiline: true }),
        practicalLimits: fields.text({ label: 'Çalışma sınırlılıkları ve yanlış genellemeler', multiline: true }),
        sourceLabel: fields.text({ label: 'Kaynak adı' }),
        sourceUrl: fields.url({ label: 'Kaynak URL' }),
        glossarySlug: fields.relationship({ label: 'Sözlük terimi', collection: 'glossary' }),
        relatedArticleSlug: fields.relationship({ label: 'İlgili blog yazısı', collection: 'posts' }),
        draft: fields.checkbox({ label: 'Taslak', defaultValue: false })
      }
    }),
    labelGuides: collection({
      label: 'Etiket Okuma Rehberi',
      slugField: 'title', path: 'src/content/label-guides/*',
      format: { data: 'json' }, columns: ['category','draft'],
      schema: {
        title: fields.slug({ name: { label: 'Başlık', validation: { isRequired: true } } }),
        category: fields.text({ label: 'Konu alanı' }),
        summary: fields.text({ label: 'Özet', multiline: true }),
        label: fields.text({ label: 'Etiketteki ifade' }),
        meaning: fields.text({ label: 'Anlamı', multiline: true }),
        example: fields.text({ label: 'Sayısal veya pratik örnek', multiline: true }),
        pitfall: fields.text({ label: 'Sık yapılan hata', multiline: true }),
        checklist: fields.text({ label: 'Kontrol noktası', multiline: true }),
        calculation: fields.text({ label: 'Adım adım hesap veya gerçek etiket örneği', multiline: true }),
        buyingChecklist: fields.text({ label: 'Kontrol listesi / seçim soruları', multiline: true }),
        safetyNote: fields.text({ label: 'Güvenlilik ve ilaç etkileşimi uyarıları', multiline: true }),
        clinicalContext: fields.text({ label: 'Klinik bağlam ve ürün seçimi', multiline: true }),
        readingSteps: fields.array(fields.object({
          title: fields.text({ label: 'Kontrol adımı' }),
          explanation: fields.text({ label: 'Ayrıntılı açıklama', multiline: true })
        }), { label: 'Etiketi adım adım okuma', itemLabel: props => props.fields.title.value || 'Adım' }),
        evidenceLimit: fields.text({ label: 'Kanıtın sınırları ve yanlış çıkarımlar', multiline: true }),
        faqs: fields.array(fields.object({
          question: fields.text({ label: 'Soru' }),
          answer: fields.text({ label: 'Bilimsel yanıt', multiline: true })
        }), { label: 'Sık sorulan sorular', itemLabel: props => props.fields.question.value || 'Soru' }),
        additionalSources: fields.array(fields.object({
          label: fields.text({ label: 'Kaynağın adı' }),
          url: fields.url({ label: 'Kaynak URL' })
        }), { label: 'Ek bilimsel kaynaklar', itemLabel: props => props.fields.label.value || 'Kaynak' }),
        sourceLabel: fields.text({ label: 'Kaynak' }),
        sourceUrl: fields.url({ label: 'Kaynak URL' }),
        relatedAtlasSlug: fields.relationship({ label: 'İlgili bileşen', collection: 'atlas' }),
        draft: fields.checkbox({ label: 'Taslak', defaultValue: false })
      }
    }),
    categories: collection({
      label: 'Kategoriler',

      slugField: 'name',

      path: 'src/content/categories/*',

      format: {
        data: 'json'
      },

      columns: [
        'name',
        'order',
        'parent'
      ],

      schema: {
        name: fields.slug({
          name: {
            label: 'Kategori adı',

            validation: {
              isRequired: true
            }
          }
        }),

        description: fields.text({
          label: 'Açıklama',
          multiline: true
        }),

        order: fields.integer({
          label: 'Sıra numarası',
          description: 'Küçük sayı önce görünür. Örneğin 1, 2, 3. Ana kategoriler ve alt kategoriler ayrı ayrı sıralanır.',
          defaultValue: 100,
          validation: { min: 1 }
        }),

        parent: fields.relationship({
          label: 'Üst kategori',

          description:
            'Alt kategori olacaksa üst kategoriyi seç. Ana kategori olacaksa boş bırak.',

          collection: 'categories'
        }),

        accent: fields.text({
          label: 'Vurgu rengi',
          defaultValue: '#166534'
        })
      }
    })
  },

  singletons: {
    site: singleton({
      label: 'Site Ayarları',

      path: 'src/content/settings/site',

      format: {
        data: 'json'
      },

      schema: {
        siteName: fields.text({
          label: 'Site adı',
          defaultValue: 'Eczacı Defteri'
        }),

        tagline: fields.text({
          label: 'Slogan',

          defaultValue:
            'Takviye, dermokozmetik ve eczacılık pratiği üzerine kaynak odaklı içerikler.'
        }),

        authorName: fields.text({
          label: 'Yazar adı',
          defaultValue: 'Eczacı H.K.'
        }),

        authorBio: fields.text({
          label: 'Yazar künyesi',
          multiline: true,

          defaultValue:
            'Eczacı H.K. tarafından hazırlanan, kaynak odaklı bilgilendirme içerikleri.'
        }),

        contactEmail: fields.text({
          label: 'İletişim e-postası',

          defaultValue:
            'iletisim@eczacidefteri.com'
        }),

        footerNote: fields.text({
          label: 'Alt bilgi',
          multiline: true,

          defaultValue:
            'Bu sitedeki içerikler genel bilgilendirme amaçlıdır; kişisel tanı ve tedavi önerisi yerine geçmez.'
        })
      }
    })
  }
});