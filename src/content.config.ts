import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({
    base: './src/content/posts',
    pattern: '**/*.mdoc'
  }),

  schema: z.object({
    title: z.string(),

    excerpt: z.string(),

    coverImage: z.string().nullable().optional(),

    category: z.string(),

    publishedAt: z.coerce.date(),

    updatedAt: z.coerce.date().optional(),

    featured: z.boolean().default(false),

    draft: z.boolean().default(false),

    editorReviewed: z.boolean().default(false),

    readingTime: z.number().default(5),

    seoTitle: z.string().optional(),

    seoDescription: z.string().optional(),

    references: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url()
        })
      )
      .default([])
  })
});


const categories = defineCollection({
  loader: glob({
    base: './src/content/categories',
    pattern: '**/*.json'
  }),

  schema: z.object({
    name: z.string(),

    description: z.string().optional(),

    accent: z.string().default('#166534'),

    order: z.number().int().min(1).default(100),

    parent: z.string().optional()
  })
});


const imageSeo = defineCollection({
  loader: glob({ base: './src/content/image-seo', pattern: '**/*.json' }),
  schema: z.object({
    name: z.string(),
    sourcePath: z.string(),
    folder: z.string(),
    fileName: z.string(),
    alt: z.string(),
    seoTitle: z.string().optional().nullable(),
    description: z.string().optional().nullable()
  })
});

const settings = defineCollection({
  loader: glob({
    base: './src/content/settings',
    pattern: '**/*.json'
  }),

  schema: z.object({
    siteName: z.string(),

    tagline: z.string(),

    authorName: z.string(),

    authorBio: z.string(),

    footerNote: z.string(),

    contactEmail: z
      .string()
      .email()
      .default('iletisim@eczacidefteri.com')
  })
});



const glossary = defineCollection({
  loader: glob({
    base: './src/content/glossary',
    pattern: '**/*.json'
  }),
  schema: z.object({
    name: z.string(),
    definition: z.string(),
    explanation: z.string().optional().nullable(),
    category: z.string().default('Farmakoloji'),
    sourceLabel: z.string().optional().nullable(),
    sourceUrl: z.string().url().optional().nullable(),
    draft: z.boolean().default(false)
  })
});


/** Structured editorial references: all records are editable in Keystatic. */
const atlas = defineCollection({
  loader: glob({ base: './src/content/atlas', pattern: '**/*.json' }),
  schema: z.object({
    name: z.string(), category: z.enum(['Takviye', 'Dermokozmetik']),
    summary: z.string(), mechanism: z.string(), clinical: z.string(),
    evidence: z.string(), dose: z.string(), warnings: z.string(),
    interactions: z.string(), labelTip: z.string(),
    chemicalIdentity: z.string().optional(), molecularFormula: z.string().optional(),
    chemicalClass: z.string().optional(), sourceChemUrl: z.string().url().optional(),
    formulations: z.string().optional(), studiedPopulation: z.string().optional(),
    pharmacistChecklist: z.string().optional(), practicalLimits: z.string().optional(),
    sourceLabel: z.string(), sourceUrl: z.string().url(),
    glossarySlug: z.string().optional(), relatedArticleSlug: z.string().optional(),
    draft: z.boolean().default(false)
  })
});

const labelGuides = defineCollection({
  loader: glob({ base: './src/content/label-guides', pattern: '**/*.json' }),
  schema: z.object({
    title: z.string(), category: z.string(), summary: z.string(),
    label: z.string(), meaning: z.string(), example: z.string(),
    calculation: z.string().optional(), buyingChecklist: z.string().optional(),
    safetyNote: z.string().optional(),
    clinicalContext: z.string().optional(),
    evidenceLimit: z.string().optional(),
    readingSteps: z.array(z.object({ title: z.string(), explanation: z.string() })).default([]),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
    additionalSources: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    pitfall: z.string(), checklist: z.string(),
    sourceLabel: z.string(), sourceUrl: z.string().url(),
    relatedAtlasSlug: z.string().optional(), draft: z.boolean().default(false)
  })
});

export const collections = {
  posts,
  imageSeo,
  categories,
  settings,
  glossary,
  atlas,
  labelGuides
};