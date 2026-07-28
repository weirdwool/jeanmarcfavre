export type DroneSector = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  heroImage: string;
  heroAlt: string;
  intro: string;
  body: string[];
  bullets: string[];
  related: { href: string; label: string }[];
};

export const droneSectors: DroneSector[] = [
  {
    slug: 'immobilier',
    title: 'Drone Immobilier Annecy | Vues Aériennes Biens & Promoteurs',
    description: 'Prises de vue aériennes par drone pour l’immobilier à Annecy et en Haute-Savoie. Villas, appartements, terrains, promoteurs. Pilote certifié DGAC.',
    h1: 'Drone immobilier',
    heroImage: '/images/parallax/131024-besancon-1-1200x800.jpg',
    heroAlt: 'Vue aérienne drone d’un site immobilier',
    intro: 'Valorisez un bien, un programme ou un terrain avec des images aériennes nettes et réglementaires — à Annecy et en Haute-Savoie.',
    body: [
      'L’immobilier se vend aussi par le ciel : situation, environnement, accès, volumétrie du bâti. Le drone apporte des angles impossibles depuis le sol, utiles aux agences, promoteurs et propriétaires.',
      'Missions typiques : photos et vidéos 4K de biens à vendre ou louer, follow-up de chantiers pour promoteurs, vues de situation pour plaquette commerciale, comparatifs avant/après.',
      'Chaque vol respecte la réglementation DGAC (scénarios adaptés, catégorie spécifique lorsque nécessaire). Basé à Annecy, intervention rapide sur le bassin annecien et tout le 74.',
    ],
    bullets: [
      'Vues aériennes de villas, résidences et terrains',
      'Suivi de chantier et promotion immobilière',
      'Montage vidéo court pour annonces et sites web',
      'Livraison photo haute résolution + plans aériens',
    ],
    related: [
      { href: '/drone/entreprises/', label: 'Drone entreprises' },
      { href: '/drone/collectivites/', label: 'Drone collectivités' },
      { href: '/annecy/', label: 'Studio à Annecy' },
    ],
  },
  {
    slug: 'tourisme',
    title: 'Drone Tourisme Haute-Savoie | Films & Photos Destinations',
    description: 'Drone pour le tourisme en Haute-Savoie : offices de tourisme, hébergeurs, sites patrimoniaux. Images aériennes du lac d’Annecy aux massifs.',
    h1: 'Drone tourisme',
    heroImage: '/images/collections/region/061128-annecy-1-2000x1083.jpg',
    heroAlt: 'Vue aérienne touristique du lac d’Annecy',
    intro: 'Des images qui donnent envie de venir : lac, montagnes, villages et sites emblématiques filmés et photographiés depuis les airs.',
    body: [
      'Les destinations de Haute-Savoie se différencient par le paysage. Le drone capture l’échelle du territoire — lac d’Annecy, massifs, vallées — pour campagnes OT, sites web et réseaux sociaux.',
      'Prestations : films promotionnels, photos banques d’images, couvertures de saisons (été / hiver), mise en valeur de sites naturels ou patrimoniaux.',
      'Connaissance du terrain local (météo alpine, zones de vol, angles sur le lac et les sommets) pour des tournages efficaces et conformes.',
    ],
    bullets: [
      'Films et photos pour OT et destinations',
      'Contenus saisonniers lac & montagne',
      'Hébergements et sites touristiques',
      'Livraison adaptée web, print et social',
    ],
    related: [
      { href: '/drone/hotellerie/', label: 'Drone hôtellerie' },
      { href: '/drone/stations-de-ski/', label: 'Drone stations de ski' },
      { href: '/haute-savoie/', label: 'Haute-Savoie' },
    ],
  },
  {
    slug: 'collectivites',
    title: 'Drone Collectivités Annecy | Communication & Suivi Territorial',
    description: 'Prises de vue drone pour collectivités en Haute-Savoie : communication institutionnelle, événements, suivi urbain. Partenaire Grand Annecy et acteurs publics.',
    h1: 'Drone collectivités',
    heroImage: '/images/collections/region/200809-Glieres-monument-3.jpg',
    heroAlt: 'Prise de vue aérienne patrimoine et territoire Haute-Savoie',
    intro: 'Images aériennes pour la communication publique, le suivi de projets et la valorisation du territoire — avec un pilote habitué aux contraintes institutionnelles.',
    body: [
      'Les collectivités ont besoin d’images claires, réutilisables et produites dans le respect des règles de vol (centres-villes, abords de lac, zones sensibles).',
      'Exemples d’usages : communication Grand Annecy et communes, couverture d’événements publics, illustration de projets d’aménagement, reportages pour la presse locale.',
      'Expérience auprès d’acteurs publics et para-publics du bassin annecien, avec livraison adaptée aux services communication.',
    ],
    bullets: [
      'Communication institutionnelle photo & vidéo',
      'Événements et cérémonies publiques',
      'Suivi de projets urbains / aménagement',
      'Cadre réglementaire DGAC maîtrisé',
    ],
    related: [
      { href: '/drone/evenementiel/', label: 'Drone événementiel' },
      { href: '/drone/immobilier/', label: 'Drone immobilier' },
      { href: '/pourquoi-nous-choisir/', label: 'Pourquoi nous choisir' },
    ],
  },
  {
    slug: 'evenementiel',
    title: 'Drone Événementiel Annecy | Couverture Aérienne Events',
    description: 'Couverture drone d’événements en Haute-Savoie : sports, festivals, manifestations. Photos et vidéos aériennes certifiées DGAC.',
    h1: 'Drone événementiel',
    heroImage: '/images/collections/region/171006-SoshBigAir-64.jpg',
    heroAlt: 'Couverture aérienne d’un événement sportif en Haute-Savoie',
    intro: 'Capturer l’ambiance et l’échelle d’un événement depuis les airs — sport, culture, corporate — en toute sécurité.',
    body: [
      'Un event se lit aussi de dessus : foule, site, mise en scène. Le drone complète la couverture sol avec des plans larges et dynamiques.',
      'Interventions sur manifestations sportives, festivals, inaugurations, événements corporate. Anticipation des autorisations et de la météo alpine.',
      'Possibilité de combiner photo, vidéo aérienne et images au sol selon le brief.',
    ],
    bullets: [
      'Sports, festivals, inaugurations',
      'Plans aériens + coordination avec l’équipe sol',
      'Livraison rapide pour diffusion post-event',
      'Vols réglementaires en site occupé',
    ],
    related: [
      { href: '/drone/stations-de-ski/', label: 'Drone stations de ski' },
      { href: '/drone/collectivites/', label: 'Drone collectivités' },
      { href: '/drone/', label: 'Hub drone' },
    ],
  },
  {
    slug: 'stations-de-ski',
    title: 'Drone Stations de Ski | Photos & Vidéos Alpes — Haute-Savoie',
    description: 'Drone pour stations de ski en Haute-Savoie et Alpes : domaines, événements, communication saisonnière. Pilote expérimenté montagne, certifié DGAC.',
    h1: 'Drone stations de ski',
    heroImage: '/images/parallax/MICHAUD-Seb-158.jpg',
    heroAlt: 'Image montagne et sports de glisse en station alpine',
    intro: 'Des images aériennes pensées pour les stations : domaine skiable, ambiance village, événements et communication hiver / été.',
    body: [
      'Quarante ans de culture glisse et une pratique drone en montagne : les stations ont besoin d’images qui parlent aux skieurs et aux familles, sans improvisation réglementaire.',
      'Usages : films de saison, photos pour OT et hébergeurs, couverture d’événements snow, vues de domaine et d’infrastructures.',
      'Interventions Aravis, Mont-Blanc, et plus largement Alpes du Nord selon le projet.',
    ],
    bullets: [
      'Communication hiver & été',
      'Événements et compétitions',
      'Domaines et villages de station',
      'Connaissance terrain montagne',
    ],
    related: [
      { href: '/drone/tourisme/', label: 'Drone tourisme' },
      { href: '/drone/hotellerie/', label: 'Drone hôtellerie' },
      { href: '/haute-savoie/', label: 'Haute-Savoie' },
    ],
  },
  {
    slug: 'entreprises',
    title: 'Drone Entreprises Haute-Savoie | Corporate & Sites Industriels',
    description: 'Prises de vue drone pour entreprises en Haute-Savoie : sites, usines, corporate, communication B2B. Pilote certifié DGAC à Annecy.',
    h1: 'Drone entreprises',
    heroImage: '/images/parallax/131024-besancon-1-1200x800.jpg',
    heroAlt: 'Vue aérienne drone d’un site d’entreprise',
    intro: 'Montrez votre site, votre savoir-faire ou votre implantation avec des images aériennes professionnelles, adaptées à la communication corporate.',
    body: [
      'Usines, entrepôts, sièges, campus : le drone donne la lecture d’ensemble que le sol ne permet pas. Utile pour plaquette, site web, recrutements et présentations investisseurs.',
      'Possibilité de combiner vues aériennes, plans au sol et montage vidéo. Respect strict des zones industrielles et des consignes de sécurité.',
      'Base Annecy, déplacements Haute-Savoie et Auvergne-Rhône-Alpes.',
    ],
    bullets: [
      'Sites industriels et tertiaires',
      'Films corporate courts',
      'Photos haute résolution pour print & web',
      'Cadre DGAC et assurance professionnelle',
    ],
    related: [
      { href: '/drone/immobilier/', label: 'Drone immobilier' },
      { href: '/drone/industrie/', label: 'Drone industrie' },
      { href: '/pourquoi-nous-choisir/', label: 'Pourquoi nous choisir' },
    ],
  },
  {
    slug: 'hotellerie',
    title: 'Drone Hôtellerie Annecy | Valorisation Hébergements & Spas',
    description: 'Drone pour hôtels, chalets et hébergements en Haute-Savoie. Vues aériennes du cadre lac & montagne. Certifié DGAC.',
    h1: 'Drone hôtellerie',
    heroImage: '/images/collections/region/130818-Se_vrier-42.jpg',
    heroAlt: 'Cadre lacustre et montagne pour hébergement tourisme',
    intro: 'Faites voir l’emplacement et l’environnement de votre établissement — lac, montagne, accès — avec des images qui convertissent les réservations.',
    body: [
      'Pour un hôtel ou un chalet, le cadre compte autant que les chambres. Le drone montre la situation réelle : vue lac, proximité pistes, parc, accès.',
      'Livrables photo et vidéo pour site de réservation, OT, campagnes saisonnières. Complément possible avec photo intérieure / lifestyle.',
      'Interventions Annecy, stations et lacs de Haute-Savoie.',
    ],
    bullets: [
      'Hôtels, chalets, résidences de tourisme',
      'Vues situation lac & montagne',
      'Contenus saisonniers',
      'Pack photo + vidéo aérienne',
    ],
    related: [
      { href: '/drone/tourisme/', label: 'Drone tourisme' },
      { href: '/drone/stations-de-ski/', label: 'Drone stations de ski' },
      { href: '/annecy/', label: 'Annecy' },
    ],
  },
  {
    slug: 'industrie',
    title: 'Drone Industrie Haute-Savoie | Sites & Infrastructures',
    description: 'Inspection visuelle et communication drone pour sites industriels en Haute-Savoie. Prises de vue aériennes certifiées DGAC.',
    h1: 'Drone industrie',
    heroImage: '/images/parallax/131024-besancon-1-1200x800.jpg',
    heroAlt: 'Prise de vue aérienne site industriel',
    intro: 'Documenter un site industriel ou une infrastructure depuis les airs — communication, reporting ou appui technique visuel.',
    body: [
      'Le drone permet des vues d’ensemble de sites étendus, des points de vue autrement coûteux (nacelle, hélico) et un suivi régulier de l’évolution d’un site.',
      'Usages : communication industrielle, reporting chantier lourd, illustration de process à grande échelle. Toujours dans le cadre réglementaire et les consignes site.',
      'Échange préalable sur les zones de vol et les contraintes sécurité.',
    ],
    bullets: [
      'Vues d’ensemble de sites',
      'Reporting et communication',
      'Complément aux inspections visuelles',
      'Vols encadrés DGAC',
    ],
    related: [
      { href: '/drone/entreprises/', label: 'Drone entreprises' },
      { href: '/drone/immobilier/', label: 'Drone immobilier' },
      { href: '/drone/', label: 'Hub drone' },
    ],
  },
];
