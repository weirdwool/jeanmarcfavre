import { defineConfig } from "tinacms";

// Tina Cloud configuration for authentication and publishing
export default defineConfig({
  branch: "main",
  
  // Tina Cloud credentials for authentication
  clientId: "11270f41-ea51-4aa4-8952-89257bac03fa",
  token: "0260843eb5dc668215413a7bc6cf80c37cbb47fb",
  
  build: {
    outputFolder: "admin",
    publicFolder: "public",
    skipCloudCheck: true,
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
        ui: {
          filename: {
            readonly: true,
            slugify: (values) => {
              // Auto-generate filename from date and title
              const date = values?.pubDate ? new Date(values.pubDate) : new Date();
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const title = values?.title
                ? values.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')
                : 'nouveau-post';
              return `${year}-${month}-${day}-${title}`;
            },
          },
        },
        defaultItem: {
          title: "",
          pubDate: new Date().toISOString(),
          location: "",
          main_image: "",
          gallery_url: "",
          video_url: "",
          tags: {
            video: false,
            photo: false,
            drone: false,
            v_nementiel: false,
            studio: false,
            immobilier: false,
            industriel: false,
            tourisme: false,
            voyage: false,
            paysage: false,
            sports: false,
            associatif: false,
            divers: false,
            culture: false,
            gastronomie: false,
            musique: false,
          },
          body: "",
        },
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
            description: "Exemple: /blog/blog-galeries/251028-Thonon-port/index.html",
          },
          {
            type: "string",
            name: "video_url",
            label: "URL Vidéo Vimeo",
            description: "Exemple: https://vimeo.com/123456789",
          },
          {
            type: "object",
            name: "tags",
            label: "Tags (Cochez les catégories qui s'appliquent)",
            fields: [
              { type: "boolean", name: "video", label: "Vidéo" },
              { type: "boolean", name: "photo", label: "Photo" },
              { type: "boolean", name: "drone", label: "Drone" },
              { 
                type: "boolean", 
                name: "v_nementiel",
                nameOverride: "événementiel",
                label: "Événementiel" 
              },
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
