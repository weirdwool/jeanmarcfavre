# Jean-Marc Favre - Site Web Photographe

Site web professionnel pour Jean-Marc Favre, photographe et vidéaste.

## 📝 CMS

Ce projet utilise **TinaCMS** pour gérer les articles de blog.

**📖 Guide complet : [TINA_CMS_GUIDE.md](./TINA_CMS_GUIDE.md)**

Pour accéder à l'interface d'administration :
- **Développement** : http://localhost:4321/admin/index.html
- **Production** : https://jeanmarcfavre.com/admin/index.html

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts TinaCMS + Astro dev server at `localhost:4321`      |
| `npm run build`           | Build TinaCMS admin + production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
