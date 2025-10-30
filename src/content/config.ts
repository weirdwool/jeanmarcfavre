// src/content/config.ts
// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// Define a schema for specific boolean tags.
const tagSchema = z.object({
  associatif: z.boolean().optional(),
  culture: z.boolean().optional(),
  divers: z.boolean().optional(),
  drone: z.boolean().optional(),
  événementiel: z.boolean().optional(),
  gastronomie: z.boolean().optional(),
  immobilier: z.boolean().optional(),
  industriel: z.boolean().optional(),
  musique: z.boolean().optional(),
  paysage: z.boolean().optional(),
  sports: z.boolean().optional(),
  studio: z.boolean().optional(),
  tourisme: z.boolean().optional(),
  video: z.boolean().optional(),
  voyage: z.boolean().optional(),
});

// 2. Define a schema for your 'blog' collection
const blogCollection = defineCollection({
  type: 'content', // 'content' for Markdown/MDX
  schema: z.object({
    title: z.string(), // Blog post must have a title
    pubDate: z.coerce.date(), // Publication date, using coerce for flexible parsing
    location: z.string().optional(), // Added location field for blog posts
    main_image: z.string().optional(), // Your specific field for main image
    gallery_url: z.string().or(z.literal('')).optional(), // Your specific field for gallery URL
    video_url: z.string().url().or(z.literal('')).optional(), // Your specific field for video URL
    tags: tagSchema.optional(), // Your specific tag schema
  }),
});

// 3. Define a schema for your 'engagements' collection
const engagementsCollection = defineCollection({
  type: 'content', // 'content' for Markdown/MDX
  schema: z.object({
    title: z.string(), // Engagement must have a title
    subtitle: z.string().optional(), // Your specific subtitle field
    description: z.string(), // Your specific description field (made required as per your old schema)
    main_image: z.string(), 
    secondary_image: z.string().optional(),
    gallery_url: z.string().or(z.literal('')).optional(),
    link_text: z.string(),
    link_url: z.string(),
  }),
});

// 4. Export a single `collections` object to register your collections
export const collections = {
  blog: blogCollection,
  engagements: engagementsCollection,
};