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

    category: z.string(),

    publishedAt: z.coerce.date(),

    updatedAt: z.coerce.date().optional(),

    featured: z.boolean().default(false),

    draft: z.boolean().default(false),

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

    parent: z.string().optional()
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


export const collections = {
  posts,
  categories,
  settings
};