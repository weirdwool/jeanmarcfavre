# Guide TinaCMS pour Jean-Marc

## 🚀 Pour ajouter un article (SIMPLE!)

**Tu n'as RIEN à installer ou à lancer !**

Simplement :
1. Va sur **https://jeanmarcfavre.com/admin/index.html**
2. Clique sur "Login" et connecte-toi avec GitHub
3. Ajoute ton article
4. Clique sur "Save"
5. C'est fait ! 🎉

Le site se mettra à jour automatiquement dans quelques minutes.

---

## 📝 Guide détaillé

### 1. **Accéder à l'admin**
   - Va sur : **https://jeanmarcfavre.com/admin/index.html**
   - (Aucun logiciel à installer, ça marche directement dans le navigateur)

### 2. **Se connecter**
   - Clique sur "Login" 
   - Connecte-toi avec ton compte GitHub (celui qui a accès au projet)
   - TinaCMS utilise GitHub pour sauvegarder tes articles

### 3. **Créer un nouvel article**
   - Cliquez sur "Blog Posts" dans le menu
   - Cliquez sur le bouton "Create New"
   - Remplissez les champs :
     - **Titre** : Le titre de votre article (obligatoire)
     - **Date de publication** : La date de l'article (obligatoire)
     - **Lieu** : Le lieu de la prise de vue (optionnel)
     - **Image principale** : L'image de couverture (obligatoire)
     - **URL Galerie Lightroom** : Lien vers la galerie complète (optionnel)
     - **URL Vidéo Vimeo** : Lien vers une vidéo Vimeo (optionnel)
     - **Tags** : Cochez les catégories appropriées
     - **Contenu** : Le texte de votre article

### 4. **Publier**
   - Cliquez sur "Save" en haut à droite
   - TinaCMS va automatiquement créer un commit sur GitHub
   - Le site se mettra à jour automatiquement après quelques minutes

---

## 👨‍💻 Pour les développeurs seulement

### Développement local
```bash
npm run dev
```
Ensuite accéder à : `http://localhost:4321/admin/index.html`

### Construction du site
```bash
npm run build
```
Cette commande :
1. Construit l'interface admin TinaCMS
2. Génère le site Astro statique dans le dossier `dist`

### Déploiement
Une fois le site construit, déployez le contenu du dossier `dist` sur votre hébergeur.
L'admin sera accessible à `https://jeanmarcfavre.com/admin/index.html`

---

## ⚙️ Configuration

La configuration TinaCMS se trouve dans `/tina/config.ts`

**Important** : Les identifiants Tina Cloud sont déjà configurés. Ne les modifiez pas sans raison.

---

## 🆘 Problèmes courants

### "Failed loading TinaCMS assets"
- Vérifiez que `npm run dev` est bien lancé
- Vérifiez que vous accédez bien à `/admin/index.html` (avec le `.html`)
- Videz le cache de votre navigateur

### Impossible de se connecter
- Vérifiez que vous avez accès au repository GitHub `weirdwool/jeanmarcfavre`
- Vérifiez votre connexion internet

### Les changements n'apparaissent pas
- Attendez quelques minutes après la sauvegarde
- Vérifiez que le commit a bien été créé sur GitHub
- Redéployez le site si nécessaire

---

## 📁 Structure des fichiers

- **Articles de blog** : `/src/content/blog/`
  - Format : `YYYY-MM-DD-titre-de-l-article.md`
- **Images** : `/public/blog/blog-images/`
- **Galeries** : `/public/blog/blog-galeries/`

---

## 🔗 Liens utiles

- [Documentation TinaCMS](https://tina.io/docs/)
- [Dashboard Tina Cloud](https://app.tina.io/)
- Repository GitHub : https://github.com/weirdwool/jeanmarcfavre

