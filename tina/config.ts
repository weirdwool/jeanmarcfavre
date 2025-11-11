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
            label: "Tags (Cochez les catégories appropriées)",
            description: "Sélectionnez tous les tags qui correspondent à votre article",
            fields: [
              { 
                type: "boolean", 
                name: "video", 
                label: "📹 Vidéo",
                description: "Contient une vidéo"
              },
              { 
                type: "boolean", 
                name: "photo", 
                label: "📷 Photo",
                description: "Reportage photo"
              },
              { 
                type: "boolean", 
                name: "drone", 
                label: "🚁 Drone",
                description: "Prise de vue aérienne"
              },
              { 
                type: "boolean", 
                name: "evenementiel", 
                label: "🎉 Événementiel",
                description: "Événement, fête, spectacle"
              },
              { 
                type: "boolean", 
                name: "studio", 
                label: "🎬 Studio",
                description: "Prise de vue en studio"
              },
              { 
                type: "boolean", 
                name: "immobilier", 
                label: "🏠 Immobilier",
                description: "Architecture, bâtiment"
              },
              { 
                type: "boolean", 
                name: "industriel", 
                label: "🏭 Industriel",
                description: "Site industriel, usine"
              },
              { 
                type: "boolean", 
                name: "tourisme", 
                label: "🗺️ Tourisme",
                description: "Destination touristique"
              },
              { 
                type: "boolean", 
                name: "voyage", 
                label: "✈️ Voyage",
                description: "Voyage, déplacement"
              },
              { 
                type: "boolean", 
                name: "paysage", 
                label: "🏔️ Paysage",
                description: "Nature, montagne, lac"
              },
              { 
                type: "boolean", 
                name: "sports", 
                label: "⚽ Sports",
                description: "Activité sportive"
              },
              { 
                type: "boolean", 
                name: "associatif", 
                label: "🤝 Associatif",
                description: "Association, bénévolat"
              },
              { 
                type: "boolean", 
                name: "divers", 
                label: "📦 Divers",
                description: "Autre catégorie"
              },
              { 
                type: "boolean", 
                name: "culture", 
                label: "🎭 Culture",
                description: "Culturel, art, théâtre"
              },
              { 
                type: "boolean", 
                name: "gastronomie", 
                label: "🍽️ Gastronomie",
                description: "Cuisine, restaurant"
              },
              { 
                type: "boolean", 
                name: "musique", 
                label: "🎵 Musique",
                description: "Concert, musique"
              },
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
