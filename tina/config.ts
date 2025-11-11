import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "main",
  clientId: "11270f41-ea51-4aa4-8952-89257bac03fa",
  token: "0260843eb5dc668215413a7bc6cf80c37cbb47fb",
  
  contentApiUrlOverride: "https://content.tinajs.io/1.0/content/11270f41-ea51-4aa4-8952-89257bac03fa/github/main",
  
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  
  media: {
    tina: {
      mediaRoot: "blog/blog-images",
      publicFolder: "public",
    },
  },
  
  schema: {
    collections: [
      {
        name: "blog",
        label: "Blog Posts",
        path: "src/content/blog",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Titre",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "pubDate",
            label: "Date de publication",
            required: true,
          },
          {
            type: "string",
            name: "location",
            label: "Lieu",
          },
          {
            type: "image",
            name: "main_image",
            label: "Image principale",
            required: true,
          },
          {
            type: "string",
            name: "gallery_url",
            label: "URL Galerie Lightroom",
          },
          {
            type: "string",
            name: "video_url",
            label: "URL Vidéo Vimeo",
          },
          {
            type: "object",
            name: "tags",
            label: "Tags",
            fields: [
              { type: "boolean", name: "video", label: "Vidéo" },
              { type: "boolean", name: "photo", label: "Photo" },
              { type: "boolean", name: "drone", label: "Drone" },
              { type: "boolean", name: "evenementiel", label: "Événementiel" },
              { type: "boolean", name: "studio", label: "Studio" },
              { type: "boolean", name: "immobilier", label: "Immobilier" },
              { type: "boolean", name: "industriel", label: "Industriel" },
              { type: "boolean", name: "tourisme", label: "Tourisme" },
              { type: "boolean", name: "voyage", label: "Voyage" },
              { type: "boolean", name: "paysage", label: "Paysage" },
              { type: "boolean", name: "sports", label: "Sports" },
              { type: "boolean", name: "associatif", label: "Associatif" },
              { type: "boolean", name: "divers", label: "Divers" },
              { type: "boolean", name: "culture", label: "Culture" },
              { type: "boolean", name: "gastronomie", label: "Gastronomie" },
              { type: "boolean", name: "musique", label: "Musique" },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Contenu",
            isBody: true,
          },
        ],
      },
    ],
  },
});
