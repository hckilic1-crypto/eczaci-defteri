import { createElement } from 'react';
import {
  config,
  collection,
  fields,
  singleton
} from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
repo: 'hckilic1-crypto/eczaci-defteri'  },

  ui: {
    brand: {
      name: 'Eczacı Defteri | Editör',
      mark: () => createElement('img', {
        src: '/favicon.svg', width: 24, height: 24, alt: ''
      })
    },
    navigation: {
      'İçerik Merkezi': ['posts', 'categories'],
      'Site Yönetimi': ['site']
    }
  },

  collections: {
    posts: collection({
      label: 'Yazılar',

      // Başlık zaten ilk sütunda görünür. Yayın durumunu yazıya girmeden göster.
      columns: ['status', 'category', 'publishedAt', 'featured', 'reviewed'],

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
          label: 'Son düzenleme tarihi'
        }),

        featured: fields.checkbox({
          label: 'Öne çıkan (ana sayfa)',
          defaultValue: false
        }),

        status: fields.select({
          label: 'Yayın durumu',
          description: 'Yayında: sitede görünür. Taslak ve Kontrol bekliyor: sitede görünmez.',
          options: [
            { label: 'Taslak', value: 'draft' },
            { label: 'Kontrol bekliyor', value: 'review' },
            { label: 'Yayında', value: 'published' }
          ],
          defaultValue: 'draft'
        }),

        readingTime: fields.integer({
          label: 'Tahmini okuma süresi (dk)',
          defaultValue: 5,
          validation: {
            min: 1
          }
        }),

        reviewed: fields.checkbox({
          label: 'Editoryal kontrol tamamlandı',
          description: 'Kaynaklar, yazım, görseller ve SEO alanları son kez incelendiyse işaretle. Yayın durumunu değiştirmez.',
          defaultValue: false
        }),

        editorNotes: fields.text({
          label: 'Editör notları (sitede gösterilmez)',
          description: 'Revizyon isteklerini ve yapılacakları not alabilirsin.',
          multiline: true
        }),

        seoTitle: fields.text({
          label: 'SEO başlığı (arama sonuçları)'
        }),

        seoDescription: fields.text({
          label: 'SEO açıklaması (arama sonuçları)',
          description: 'Arama sonuçlarında görünebilen kısa, doğal bir özet yaz.'
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