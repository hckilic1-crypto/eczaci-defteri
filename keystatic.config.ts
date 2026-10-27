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
      name: 'Eczacı Defteri'
    }
  },

  collections: {
    posts: collection({
      label: 'Yazılar',

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
          label: 'Güncelleme tarihi'
        }),

        featured: fields.checkbox({
          label: 'Öne çıkan yazı',
          defaultValue: false
        }),

        draft: fields.checkbox({
          label: 'Taslak',
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

    categories: collection({
      label: 'Kategoriler',

      slugField: 'name',

      path: 'src/content/categories/*',

      format: {
        data: 'json'
      },

      columns: [
        'name',
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