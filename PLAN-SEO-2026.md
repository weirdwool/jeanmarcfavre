# Plan SEO — jeanmarcfavre.com — 2026

## Contexte

Analyse SEO réalisée par un expert. Le site actuel est construit comme un portfolio (centré sur "Jean-Marc Favre") alors qu'il devrait être construit comme une machine à capter des recherches locales (centré sur les requêtes que tapent les prospects).

**Problèmes identifiés :**
- Le nom "Jean-Marc Favre" est un frein SEO — personne ne cherche ça
- La page Drone est trop généraliste (tout sur une seule page)
- L'ancienneté (pilote depuis 2012) n'est pas mise en avant
- Les références clients sont sous-exploitées
- Le blog est un journal d'activité, pas un outil SEO
- Aucune stratégie géographique (pas de pages par ville)
- Les images ne sont pas optimisées pour Google Images
- Le site dit "voici ce que je fais" au lieu de "voici tout ce qu'il faut savoir"

---

## État actuel du site

- **22 pages publiques** (accueil, à propos, photo, drone, vidéo, engagements, blog, contact, shop, collections, etc.)
- **1 seule page drone** qui couvre tout (immobilier, tourisme, events, collectivités...)
- **92 articles de blog** — style journal d'activité
- **Aucune page géographique** dédiée
- **Aucune étude de cas**
- **Aucune section FAQ / ressources**
- **SEO basique** (meta tags, OG, un schema LocalBusiness, sitemap)
- **Aucune landing page par service** (pas de "drone immobilier", "drone tourisme", etc.)

---

## Phase 1 — Fondations structurelles

### 1a. Architecture des sous-pages Drone

La page `/drone/` unique devient un hub qui renvoie vers ~15 sous-pages dédiées.

**Pages à créer :**

| Route | Type | Cible SEO |
|-------|------|-----------|
| `/drone/` | Hub / page pilier (à réécrire) | Drone professionnel Annecy |
| `/drone/annecy/` | Géo | Drone Annecy |
| `/drone/haute-savoie/` | Géo | Drone Haute-Savoie |
| `/drone/savoie/` | Géo | Drone Savoie |
| `/drone/alpes/` | Géo | Drone Alpes |
| `/drone/lac-annecy/` | Géo | Drone lac d'Annecy |
| `/drone/immobilier/` | Secteur | Drone immobilier Annecy |
| `/drone/tourisme/` | Secteur | Drone tourisme Haute-Savoie |
| `/drone/entreprises/` | Secteur | Drone entreprise Haute-Savoie |
| `/drone/collectivites/` | Secteur | Drone collectivités |
| `/drone/architecture/` | Secteur | Drone architecture |
| `/drone/industrie/` | Secteur | Drone industrie |
| `/drone/stations-de-ski/` | Secteur | Drone stations de ski |
| `/drone/hotellerie/` | Secteur | Drone hôtels |
| `/drone/evenementiel/` | Secteur | Drone événementiel |
| `/drone/promotion-immobiliere/` | Secteur | Drone promotion immobilière |

**Spécifications par page :**
- 1 000 à 2 000 mots de contenu unique
- Title SEO ciblé (ex: "Drone Immobilier Annecy | Prise de Vue Aérienne — Jean-Marc Favre")
- Meta description unique
- Réalisations spécifiques au secteur/lieu (images + vidéos)
- Liens internes vers les autres sous-pages drone + pages géo
- CTA contact
- Schema.org Service

### 1b. Réécrire la page d'accueil

**Objectif :** Passer de "Voici Jean-Marc Favre" à "Voici la solution pour vos images aériennes en Haute-Savoie"

**Structure proposée :**
1. Hero : accroche axée solution, pas nom
2. Bandeau crédibilité : "Depuis 2012 · +XXX missions · DGAC · France TV · Grand Annecy"
3. Services principaux (drone, photo, vidéo) avec liens vers pages dédiées
4. Réalisations récentes / études de cas
5. Témoignages clients
6. Zone géographique couverte (carte ou liste de villes)
7. CTA contact

### 1c. Page "Pourquoi nous choisir"

**Route :** `/pourquoi-nous-choisir/`

**Pas une biographie — une démonstration :**
- Pilote drone professionnel depuis 2012
- +XXX missions réalisées
- +XXX heures de vol
- Certifié DGAC, catégorie spécifique
- Assurance professionnelle
- 40 ans de photographie
- Ancien photographe sports extrêmes
- France TV, FR3, documentaires
- Direction artistique + storytelling
- Références : Grand Annecy, Teractem, Barrachin, etc.
- Logos clients

---

## Phase 2 — Infrastructure de contenu

### 2a. Études de cas / Réalisations

**Nouvelle collection de contenu + système de pages :**

```
/realisations/                   ← page index
/realisations/[slug]/            ← études de cas individuelles
```

**Structure de chaque étude :**
- Client / Projet
- Problématique
- Approche / Solution
- Images + Vidéo
- Résultat

**Études de cas prioritaires :**
- [ ] Grand Annecy
- [ ] France TV / FR3
- [ ] Teractem (suivi chantier)
- [ ] Stations de ski
- [ ] Patrimoine / châteaux
- [ ] Événements sportifs
- [ ] Immobilier / promoteurs
- [ ] Hôtellerie
- [ ] Collectivités

### 2b. Pages géographiques

**Pages à créer :**

| Route | Ville |
|-------|-------|
| `/annecy/` | Annecy |
| `/chamonix/` | Chamonix |
| `/megeve/` | Megève |
| `/evian/` | Évian |
| `/thonon/` | Thonon |
| `/la-clusaz/` | La Clusaz |
| `/le-grand-bornand/` | Le Grand-Bornand |
| `/morzine/` | Morzine |
| `/les-gets/` | Les Gets |
| `/avoriaz/` | Avoriaz |
| `/albertville/` | Albertville |
| `/chambery/` | Chambéry |

**Chaque page :**
- Contenu unique sur les projets réalisés dans la zone
- Images locales
- Liens vers services pertinents (drone, photo, vidéo)
- Schema.org avec geo

### 2c. Section Ressources / FAQ

**Route :** `/ressources/` (hub) + `/ressources/[slug]/` (articles)

**Articles prioritaires :**
- [ ] Comment organiser un tournage drone à Annecy ?
- [ ] Peut-on voler au-dessus du lac d'Annecy ?
- [ ] Quelle autorisation pour un drone en centre-ville ?
- [ ] Combien coûte une prestation drone ?
- [ ] Drone ou hélicoptère ?
- [ ] Les plus beaux lieux filmés par drone en Haute-Savoie
- [ ] Comment préparer un chantier pour un tournage aérien ?
- [ ] Quel drone choisir pour un film touristique ?
- [ ] Les règles de vol en montagne
- [ ] Les autorisations DGAC expliquées

**Format par article :**
- ~1 000-1 500 mots
- Titres explicites (H2, H3)
- Réponses directes aux questions
- Exemples concrets tirés de l'expérience
- Schema.org FAQPage

---

## Phase 3 — Optimisation SEO technique

### 3a. Images
- [ ] Renommer les fichiers images avec des noms descriptifs (ex: `drone-annecy-lac-coucher-soleil.jpg`)
- [ ] Ajouter des balises ALT détaillées sur toutes les images
- [ ] Ajouter des légendes quand pertinent
- [ ] Ajouter les coordonnées GPS quand pertinent
- [ ] Schema.org ImageObject

### 3b. Données structurées (Schema.org)
- [ ] FAQPage sur les pages ressources
- [ ] Service sur chaque page de service drone
- [ ] ImageGallery sur les galeries
- [ ] Person (page auteur détaillée pour autorité)
- [ ] BreadcrumbList sur toutes les pages
- [ ] LocalBusiness enrichi (ajouter areaServed détaillé)

### 3c. Maillage interne
- [ ] Chaque page drone renvoie vers les autres pages drone
- [ ] Chaque page géo renvoie vers les services et études de cas locales
- [ ] Les articles de blog renvoient vers les pages de services
- [ ] Les études de cas renvoient vers les pages géo et services
- [ ] Fil d'Ariane (breadcrumbs) sur toutes les pages

### 3d. Meta & Titres
- [ ] Revoir tous les `<title>` pour cibler des requêtes précises
- [ ] Réécrire toutes les meta descriptions (uniques, avec CTA)
- [ ] Vérifier les canonical URLs
- [ ] Ajouter hreflang si version anglaise envisagée

---

## Phase 4 — Blog SEO (contenu continu)

### Transformation du blog
Le blog passe de "journal d'activité" à "outil SEO" :
- Garder les articles existants (ils montrent l'activité)
- Ajouter des articles répondant aux questions des prospects
- 1 article/semaine minimum
- Chaque article cible une requête précise
- Liens internes vers les pages de services

### Articles SEO prioritaires
- [ ] Comment organiser un tournage drone à Annecy ?
- [ ] Les plus beaux lieux filmés par drone en Haute-Savoie
- [ ] Drone immobilier : pourquoi c'est devenu indispensable
- [ ] Les contraintes de vol autour du lac d'Annecy
- [ ] Drone et tourisme : valoriser une destination par les airs
- [ ] Les meilleurs horaires pour filmer en montagne
- [ ] Hiver vs été : comment adapter un tournage drone en montagne
- [ ] Pourquoi faire appel à un pilote drone professionnel certifié

---

## Phase 5 — Visibilité IA (ChatGPT, Claude, Gemini, Perplexity)

### Actions pour être cité par les IA
- [ ] Contenus structurés avec titres explicites et réponses directes
- [ ] Page auteur détaillée et crédible
- [ ] Études de cas riches avec contexte
- [ ] Données structurées complètes (schema.org)
- [ ] Informations de contact complètes et cohérentes
- [ ] FAQ exhaustive sur la réglementation, les usages et les prestations

---

## Phase 6 — Autorité externe (liens entrants)

### Sources de liens à explorer
- [ ] Offices de tourisme (Annecy, Haute-Savoie, etc.)
- [ ] Collectivités partenaires
- [ ] Partenaires professionnels
- [ ] Magazines spécialisés
- [ ] Blogs photo/drone
- [ ] Fédérations professionnelles
- [ ] Écoles / formations
- [ ] Fabricants (DJI, Canon, Profoto)

---

## Objectifs chiffrés — Juillet 2027

- [ ] 30 à 40 pages de services ciblées
- [ ] 50 à 80 articles de fond
- [ ] 20 à 30 études de cas
- [ ] 300 à 500 photos optimisées (ALT, noms, légendes)
- [ ] 30 vidéos intégrées avec transcription ou résumé
- [ ] Section FAQ complète

---

## Rythme mensuel recommandé

- 2 nouvelles pages de services
- 4 articles de blog
- 1 étude de cas
- 1 galerie photo optimisée
- 1 vidéo

---

## Décisions techniques à prendre

- [ ] Créer les sous-pages drone en dur (.astro) ou via une content collection (markdown) ?
- [ ] Même question pour les pages géographiques
- [ ] Même question pour les études de cas → probablement collection markdown
- [ ] Même question pour les ressources/FAQ → probablement collection markdown
- [ ] Faut-il écrire le contenu complet dès le départ ou mettre des placeholders ?
- [ ] Faut-il changer le nom de domaine ou garder jeanmarcfavre.com ?
- [ ] Version anglaise envisagée ?

---

## Ordre de priorité (impact SEO)

1. **Créer 15-20 pages drone ciblant chacune une requête précise**
2. **Réécrire la page d'accueil**
3. **Créer la page "pourquoi nous choisir"**
4. **Mettre en place l'infrastructure études de cas**
5. **Créer les pages géographiques**
6. **Mettre en place la section ressources/FAQ**
7. **Optimiser images (noms, ALT, légendes)**
8. **Renforcer le maillage interne**
9. **Enrichir les données structurées**
10. **Produire du contenu régulier (blog + études de cas)**
