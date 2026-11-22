// Bon imprimable d'un mouvement de stock (étape 9b, décisions 89 à 91).
// Le bon ne fait que lire un mouvement déjà affiché dans l'historique : rien
// n'est écrit, rien n'est lu sur le serveur. Il est construit dans une zone
// invisible à l'écran (#zone-impression) ; pendant l'impression demandée par
// le bouton « Imprimer », seule cette zone est montrée (css/style.css, partie
// « Bon imprimable »). Une impression lancée autrement (Ctrl+P) reste comme
// avant.

import { element } from './interface.js';
import { estUneAnnulation, idAnnulation } from './mouvements.js';
import { formaterQuantite } from './nombres.js';

const FORMAT_JOUR = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short' });
const FORMAT_HEURE = new Intl.DateTimeFormat('fr-FR', { timeStyle: 'short' });

const TITRES = {
  entree: 'Bon d’entrée',
  sortie: 'Bon de sortie',
  ajustement: 'Ajustement de stock'
};

// Zones de signature (décision 90).
const SIGNATURES = {
  entree: ['Remis par', 'Reçu par'],
  sortie: ['Remis par', 'Reçu par'],
  ajustement: ['Établi par', 'Vérifié par']
};

// Classe posée sur <body> pendant l'impression d'un bon.
const CLASSE_IMPRESSION = 'impression-bon';

let titreDeLaPage = null;   // titre à remettre après l'impression

// « 21/11/2026 à 10:42 »
function dateEtHeure(date) {
  return `${FORMAT_JOUR.format(date)} à ${FORMAT_HEURE.format(date)}`;
}

// Référence courte (décision 90) : les 8 premiers caractères de l'identifiant
// du mouvement, en majuscules ; « A- » suivi de la référence de l'opération
// annulée pour une annulation. Unique sans compteur, même hors ligne.
export function referenceDuBon(idMouvement) {
  if (estUneAnnulation(idMouvement)) {
    return 'A-' + referenceDuBon(idMouvement.slice(idAnnulation('').length));
  }
  return idMouvement.slice(0, 8).toUpperCase();
}

// Quantité imprimée : sans signe pour une entrée ou une sortie (le titre dit
// déjà le sens), avec son signe pour un ajustement.
function quantiteImprimee(type, deltaMilliemes, unite) {
  if (type === 'ajustement') {
    return `${deltaMilliemes > 0 ? '+' : ''}${formaterQuantite(deltaMilliemes)} ${unite}`;
  }
  return `${formaterQuantite(Math.abs(deltaMilliemes))} ${unite}`;
}

function bloc(balise, classe, texte) {
  const noeud = document.createElement(balise);
  if (classe) {
    noeud.className = classe;
  }
  if (texte !== undefined) {
    noeud.textContent = texte;
  }
  return noeud;
}

// Une information du haut du bon : libellé en petites capitales, valeur dessous.
function information(libelle, valeur) {
  const groupe = bloc('div', 'bon-info');
  groupe.append(bloc('dt', 'bon-libelle', libelle), bloc('dd', 'bon-valeur', valeur));
  return groupe;
}

function zoneSignature(libelle) {
  const zone = bloc('div', 'bon-signature');
  zone.append(bloc('p', 'bon-libelle', libelle), bloc('p', 'bon-ligne-signature', 'Nom et signature'));
  return zone;
}

// Construit le bon. Tous les textes sont posés comme du texte, jamais comme
// du HTML.
//   bon : { idMouvement, type, deltaMilliemes, unite, nomProduit, motif,
//           date (Date ou null), codeSku (ou ''), nomEntrepot,
//           annulation ({ idMouvement, date }) ou null, enAttente }
function construireBon(bon) {
  const reference = referenceDuBon(bon.idMouvement);
  const article = bloc('article', 'bon');

  const entete = bloc('header', 'bon-entete');
  if (bon.nomEntrepot) {
    entete.append(bloc('p', 'bon-entrepot', bon.nomEntrepot));
  }
  entete.append(bloc('h1', 'bon-titre', TITRES[bon.type] || 'Mouvement de stock'));
  article.append(entete);

  const informations = bloc('dl', 'bon-infos');
  informations.append(
    information('Référence', reference),
    information('Date de l’opération', bon.date ? dateEtHeure(bon.date) : '—')
  );
  article.append(informations);

  // Mentions visibles (décision 90) : opération annulée, ou pas encore
  // confirmée par le serveur au moment de l'impression.
  if (bon.annulation) {
    const quand = bon.annulation.date ? ` le ${dateEtHeure(bon.annulation.date)}` : '';
    article.append(bloc(
      'p',
      'bon-mention',
      `Opération annulée${quand} (référence ${referenceDuBon(bon.annulation.idMouvement)}).`
    ));
  } else if (bon.enAttente) {
    article.append(bloc(
      'p',
      'bon-mention',
      'Opération pas encore confirmée par le serveur au moment de l’impression.'
    ));
  }

  const tableau = bloc('table', 'bon-tableau');
  const titres = bloc('tr');
  const colonneProduit = bloc('th', 'bon-libelle', 'Produit');
  colonneProduit.scope = 'col';
  const colonneQuantite = bloc('th', 'bon-libelle bon-colonne-quantite', 'Quantité');
  colonneQuantite.scope = 'col';
  titres.append(colonneProduit, colonneQuantite);
  const tete = bloc('thead');
  tete.append(titres);

  const produit = bloc('td', 'bon-produit');
  produit.append(bloc('span', 'bon-nom-produit', bon.nomProduit));
  if (bon.codeSku) {
    produit.append(bloc('span', 'bon-code', `Code SKU : ${bon.codeSku}`));
  }
  const ligne = bloc('tr');
  ligne.append(
    produit,
    bloc('td', 'bon-quantite', quantiteImprimee(bon.type, bon.deltaMilliemes, bon.unite))
  );
  const corps = bloc('tbody');
  corps.append(ligne);
  tableau.append(tete, corps);
  article.append(tableau);

  if (bon.motif) {
    const motif = bloc('div', 'bon-motif');
    motif.append(bloc('p', 'bon-libelle', 'Motif'), bloc('p', 'bon-texte-motif', bon.motif));
    article.append(motif);
  }

  const signatures = bloc('div', 'bon-signatures');
  for (const libelle of SIGNATURES[bon.type] || SIGNATURES.entree) {
    signatures.append(zoneSignature(libelle));
  }
  article.append(signatures);

  article.append(bloc('footer', 'bon-pied', `Imprimé le ${dateEtHeure(new Date())} avec MinStock`));

  return { article, nomDuFichier: `${TITRES[bon.type] || 'Mouvement'} ${reference}` };
}

// Fin de l'impression : l'application redevient imprimable comme avant et
// l'onglet reprend son titre.
function finDImpression() {
  document.body.classList.remove(CLASSE_IMPRESSION);
  if (titreDeLaPage !== null) {
    document.title = titreDeLaPage;
    titreDeLaPage = null;
  }
}

// Ouvre la fenêtre d'impression du navigateur avec le bon de ce mouvement.
// Renvoie false si ce navigateur ne sait pas imprimer.
export function imprimerBon(bon) {
  if (typeof window.print !== 'function') {
    return false;
  }
  const { article, nomDuFichier } = construireBon(bon);
  const zone = element('zone-impression');
  zone.replaceChildren(article);

  // Le titre de la page sert de nom au fichier PDF proposé.
  if (titreDeLaPage === null) {
    titreDeLaPage = document.title;
  }
  document.title = nomDuFichier;
  document.body.classList.add(CLASSE_IMPRESSION);
  window.addEventListener('afterprint', finDImpression, { once: true });
  window.print();
  return true;
}

// À appeler à la déconnexion : le dernier bon ne reste pas dans la page.
export function effacerBon() {
  finDImpression();
  element('zone-impression').replaceChildren();
}
