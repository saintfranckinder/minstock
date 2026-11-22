// Écrans des mouvements de stock : formulaire d'entrée / sortie / ajustement,
// historique (50 derniers, puis « Voir plus ») avec « Annuler cette
// opération » (décisions 43 et 48), et liste des opérations refusées par le
// serveur.
// Recherche dans l'historique (décision 84) : elle ne porte que sur les
// mouvements déjà chargés (aucune lecture de plus) et ne change que ce qui est
// affiché ; les contrôles de l'annulation voient toujours tout l'historique
// chargé.
// Bouton « Imprimer » sur chaque ligne (étape 9b, décisions 89 à 91) : bon
// du mouvement, construit par js/bon-mouvement.js avec ce qui est déjà chargé.

import { effacerBon, imprimerBon } from './bon-mouvement.js';
import {
  afficherMessage,
  afficherVue,
  effacerMessages,
  element,
  normaliserPourRecherche,
  vueActuelle
} from './interface.js';
import { oublierEcoute, signalerEcoute } from './indicateur-synchro.js';
import {
  LIBELLES_TYPE,
  LONGUEUR_MAX_MOTIF,
  TAILLE_PAGE_HISTORIQUE,
  annulationPossiblePourId,
  chargerMouvementsSuivants,
  enregistrerMouvement,
  estUneAnnulation,
  idAnnulation,
  nouvelIdMouvement,
  surveillerDerniersMouvements
} from './mouvements.js';
import {
  DECIMALES_QUANTITE,
  analyserQuantite,
  formaterQuantite,
  messageNombreRefuse
} from './nombres.js';
import {
  operationsRefusees,
  oublierOperation,
  suivreOperation,
  surChangementDesOperations,
  verifierOperationsAuDemarrage
} from './operations-en-attente.js';
import { messageErreur } from './messages-erreur.js';

const FORMAT_DATE = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
const FORMAT_ENTIER = new Intl.NumberFormat('fr-FR');

// Au-delà de cet écart entre l'heure de l'opération et l'heure de réception
// par le serveur, l'historique affiche les deux.
const ECART_SYNCHRONISATION_MS = 5 * 60 * 1000;

let contexte = null;             // { db, uid }
let nomEntrepot = '';            // imprimé en haut des bons
let produitDuFormulaire = null;  // { id, nom, unite, quantiteMilliemes }
let arreterEcoute = null;

// Tous les mouvements déjà vus pendant cette session (les 50 derniers écoutés
// en direct, plus ceux chargés par « Voir plus »).
const mouvementsConnus = new Map();
let idsEnDirect = new Map();     // id -> enAttente, pour le dernier état écouté
let pagesChargees = false;
let peutEtreDAutres = false;
let historiquePartiel = false;
let mouvementsRecus = false;     // la première réponse de l'écoute est arrivée

// Produits non archivés, tenus à jour par l'écran des produits. Une opération
// ne s'annule que si son produit est encore dans la liste (décision 48).
let produitsActifs = [];
let produitsCharges = false;

// ---------- Textes partagés ----------

// +2,5 ou -2,5 : le signe est toujours affiché.
export function formaterVariation(deltaMilliemes) {
  return (deltaMilliemes > 0 ? '+' : '') + formaterQuantite(deltaMilliemes);
}

function libelleMouvement(type, deltaMilliemes, unite, nomProduit) {
  return `${LIBELLES_TYPE[type] || type} ${formaterVariation(deltaMilliemes)} ${unite} — ${nomProduit}`;
}

// Zone où afficher une information arrivée plus tard : l'historique s'il est
// ouvert, sinon l'écran des produits.
function zoneInformation() {
  return vueActuelle() === 'vue-historique' ? 'info-historique' : 'info-accueil';
}

// Affiche le résultat d'une opération suivie (voir operations-en-attente.js).
// Un refus s'affiche dans le bloc « Opérations refusées », mis à jour à part.
// `messageDejaEnregistree` (facultatif) remplace le message habituel.
export function signalerResultatOperation(resultat, libelle, messageDejaEnregistree = null) {
  if (resultat === 'deja-enregistree') {
    afficherMessage(
      zoneInformation(),
      messageDejaEnregistree ||
        `Cette opération était déjà enregistrée : ${libelle}. Rien n’a été compté deux fois.`
    );
  }
}

// ---------- Opérations refusées ----------

function afficherOperationsRefusees() {
  const bloc = element('operations-refusees');
  const liste = element('liste-operations-refusees');
  liste.textContent = '';
  const refusees = contexte ? operationsRefusees(contexte.uid) : [];
  bloc.hidden = refusees.length === 0;

  for (const operation of refusees) {
    const ligne = document.createElement('li');
    ligne.className = 'operation-refusee';

    const texte = document.createElement('p');
    texte.textContent = operation.libelle;
    const date = document.createElement('p');
    date.className = 'aide';
    date.textContent = 'Faite le ' + FORMAT_DATE.format(new Date(operation.dateAppareil));

    const bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.className = 'bouton bouton-secondaire';
    bouton.textContent = 'J’ai noté';
    bouton.setAttribute('aria-label', `J’ai noté : ${operation.libelle}`);
    bouton.addEventListener('click', () => oublierOperation(contexte.uid, operation.id));

    ligne.append(texte, date, bouton);
    liste.append(ligne);
  }
}

// ---------- Formulaire de mouvement ----------

function typeChoisi() {
  const coche = document.querySelector('input[name="mouvement-type"]:checked');
  return coche ? coche.value : 'entree';
}

// Lit le formulaire. Renvoie { ok: true, deltaMilliemes, type } ou
// { ok: false, message }.
function lireVariation() {
  const type = typeChoisi();
  const texte = element('mouvement-quantite').value;

  if (type === 'ajustement') {
    const resultat = analyserQuantite(texte, true);
    if (!resultat.ok) {
      return { ok: false, message: messageNombreRefuse(resultat, 'Correction', DECIMALES_QUANTITE) };
    }
    if (resultat.valeur === 0) {
      return { ok: false, message: 'Correction : la valeur ne peut pas être 0. Exemples : -2,5 ou +3.' };
    }
    return { ok: true, type, deltaMilliemes: resultat.valeur };
  }

  const resultat = analyserQuantite(texte, false);
  if (!resultat.ok) {
    const message = resultat.raison === 'negatif'
      ? 'Quantité : saisissez un nombre sans signe. Le type choisi indique déjà le sens.'
      : messageNombreRefuse(resultat, 'Quantité', DECIMALES_QUANTITE);
    return { ok: false, message };
  }
  if (resultat.valeur === 0) {
    return { ok: false, message: 'Quantité : la valeur doit être supérieure à 0.' };
  }
  return {
    ok: true,
    type,
    deltaMilliemes: type === 'sortie' ? -resultat.valeur : resultat.valeur
  };
}

// Met à jour le texte d'aide : valeur comprise et stock estimé après l'opération.
function mettreAJourApercu() {
  if (!produitDuFormulaire) {
    return;
  }
  const type = typeChoisi();
  element('mouvement-libelle-quantite').textContent =
    type === 'ajustement' ? 'Correction (avec son signe)' : 'Quantité';
  element('mouvement-exemple').textContent = type === 'ajustement'
    ? 'Exemples : -2,5 pour retirer, +3 pour ajouter.'
    : 'Exemples : 10 ou 2,5.';

  const apercu = element('mouvement-apercu');
  const alerte = element('mouvement-alerte-negatif');
  alerte.hidden = true;

  if (element('mouvement-quantite').value.trim() === '') {
    apercu.textContent = '';
    return;
  }
  const variation = lireVariation();
  if (!variation.ok) {
    apercu.textContent = variation.message;
    return;
  }
  const apres = produitDuFormulaire.quantiteMilliemes + variation.deltaMilliemes;
  apercu.textContent =
    `Valeur comprise : ${formaterVariation(variation.deltaMilliemes)} ${produitDuFormulaire.unite}. ` +
    `Stock après l’opération : ${formaterQuantite(apres)} ${produitDuFormulaire.unite} ` +
    '(estimation d’après ce que cet appareil connaît).';
  if (apres < 0) {
    alerte.textContent = texteStockNegatif(produitDuFormulaire.quantiteMilliemes);
    alerte.hidden = false;
  }
}

// Avertissement quand le stock sera négatif après l'opération.
function texteStockNegatif(quantiteAvantMilliemes) {
  return quantiteAvantMilliemes < 0
    ? 'Attention : le stock restera négatif.'
    : 'Attention : le stock deviendra négatif.';
}

function afficherProduitDuFormulaire() {
  element('mouvement-produit').textContent = produitDuFormulaire.nom;
  element('mouvement-stock').textContent =
    `${formaterQuantite(produitDuFormulaire.quantiteMilliemes)} ${produitDuFormulaire.unite}`;
}

// Ouvre le formulaire pour un produit de la liste.
// `preremplissage` (facultatif) : { type, quantite }, par exemple
// { type: 'sortie', quantite: '1' } quand un « −1 » rendrait le stock négatif
// (décision 44) : l'avertissement s'affiche alors avant tout envoi.
export function ouvrirFormulaireMouvement(produit, preremplissage = null) {
  produitDuFormulaire = {
    id: produit.id,
    nom: produit.nom,
    unite: produit.unite,
    quantiteMilliemes: produit.quantiteMilliemes
  };
  const type = preremplissage ? preremplissage.type : 'entree';
  element(`mouvement-type-${type}`).checked = true;
  element('mouvement-quantite').value = preremplissage ? preremplissage.quantite : '';
  element('mouvement-motif').value = '';
  afficherVue('vue-mouvement');
  effacerMessages();
  afficherProduitDuFormulaire();
  mettreAJourApercu();
}

// Appelé par l'écran des produits à chaque mise à jour de la liste des
// produits non archivés : l'historique (boutons « Annuler cette opération »)
// et le stock affiché dans le formulaire ouvert restent à jour.
export function surProduitsActifs(produits) {
  produitsActifs = produits;
  produitsCharges = true;
  afficherHistorique();
  mettreAJourProduitDuFormulaire(produits);
}

function mettreAJourProduitDuFormulaire(produits) {
  if (!produitDuFormulaire || vueActuelle() !== 'vue-mouvement') {
    return;
  }
  const produit = produits.find((element_) => element_.id === produitDuFormulaire.id);
  if (produit) {
    produitDuFormulaire.nom = produit.nom;
    produitDuFormulaire.unite = produit.unite;
    produitDuFormulaire.quantiteMilliemes = produit.quantiteMilliemes;
    afficherProduitDuFormulaire();
    mettreAJourApercu();
  }
}

function fermerFormulaireMouvement() {
  produitDuFormulaire = null;
  afficherVue('vue-accueil');
}

// Envoie un mouvement déjà contrôlé. Seul chemin d'envoi d'un mouvement : le
// formulaire et les boutons « +1 » / « −1 » du tableau de bord l'utilisent.
//   - l'identifiant et l'heure sont fixés une seule fois, avant l'envoi ;
//   - un seul lot : quantité (increment), dernierMouvementId et mouvement ;
//   - l'opération est suivie jusqu'à la réponse du serveur (décision 37) ;
//   - pas d'attente : le stock et l'historique se mettent à jour dès
//     l'enregistrement local, même sans Internet.
// `produit` : { id, nom, unite }. Renvoie le libellé de l'opération, ou null
// si aucun compte n'est ouvert.
// `options` (facultatif, pour une annulation) :
//   idMouvement            : identifiant imposé (« annulation-… ») ;
//   libelle                : texte montré si le serveur refuse l'opération ;
//   messageDejaEnregistree : texte montré si elle était déjà enregistrée.
export function envoyerMouvement(produit, type, deltaMilliemes, motif, options = {}) {
  if (!contexte) {
    return null;
  }
  const mouvement = {
    idMouvement: options.idMouvement || nouvelIdMouvement(contexte.db, contexte.uid),
    idProduit: produit.id,
    nomProduit: produit.nom,
    unite: produit.unite,
    deltaMilliemes,
    type,
    motif,
    dateAppareil: new Date()
  };
  const libelle = libelleMouvement(
    mouvement.type, mouvement.deltaMilliemes, mouvement.unite, mouvement.nomProduit
  );

  suivreOperation(
    contexte.db,
    contexte.uid,
    {
      id: mouvement.idMouvement,
      chemin: ['users', contexte.uid, 'movements', mouvement.idMouvement],
      libelle: options.libelle || libelle,
      dateAppareil: mouvement.dateAppareil
    },
    enregistrerMouvement(contexte.db, contexte.uid, mouvement),
    (resultat) => signalerResultatOperation(resultat, libelle, options.messageDejaEnregistree)
  );
  return libelle;
}

function enregistrerLeMouvement() {
  effacerMessages();
  const variation = lireVariation();
  if (!variation.ok) {
    afficherMessage('erreur-mouvement', variation.message);
    return;
  }
  const motif = element('mouvement-motif').value.trim();
  if (motif.length > LONGUEUR_MAX_MOTIF) {
    afficherMessage('erreur-mouvement', `Le motif ne doit pas dépasser ${LONGUEUR_MAX_MOTIF} caractères.`);
    return;
  }

  envoyerMouvement(produitDuFormulaire, variation.type, variation.deltaMilliemes, motif);
  fermerFormulaireMouvement();
}

// ---------- Historique ----------

function mouvementsTries() {
  return [...mouvementsConnus.values()].sort((a, b) => {
    // Les mouvements pas encore confirmés en premier, puis du plus récent au
    // plus ancien selon l'heure du serveur.
    if (a.dateServeur === null || b.dateServeur === null) {
      if (a.dateServeur === null && b.dateServeur === null) {
        return b.dateAppareil - a.dateAppareil;
      }
      return a.dateServeur === null ? -1 : 1;
    }
    return b.dateServeur - a.dateServeur;
  });
}

function paragraphe(classe, texte) {
  const ligne = document.createElement('p');
  if (classe) {
    ligne.className = classe;
  }
  ligne.textContent = texte;
  return ligne;
}

// ---------- Annulation d'une opération (décisions 43 et 48) ----------

function estEnAttente(mouvement) {
  return mouvement.enAttente || mouvement.dateServeur === null;
}

function produitActif(idProduit) {
  return produitsActifs.find((produit) => produit.id === idProduit) || null;
}

// L'annulation de cette opération, si elle figure dans l'historique chargé
// (même pas encore confirmée). Une annulation est toujours plus récente que
// l'opération qu'elle annule : si l'opération est chargée, son annulation
// l'est aussi.
function annulationDe(mouvement) {
  return mouvementsConnus.get(idAnnulation(mouvement.id)) || null;
}

// Le bouton « Annuler cette opération » n'apparaît pas (décision 48) :
//   - sur une annulation (une annulation ne s'annule pas) ;
//   - sur une opération déjà annulée ;
//   - sur une opération pas encore confirmée : si le serveur la refusait,
//     l'annulation, elle, serait acceptée et fausserait le stock ;
//   - sur un produit qui n'est plus dans la liste (archivé).
function peutEtreAnnule(mouvement) {
  return contexte !== null &&
    annulationPossiblePourId(mouvement.id) &&
    annulationDe(mouvement) === null &&
    !estEnAttente(mouvement) &&
    produitActif(mouvement.idProduit) !== null;
}

// « Sortie -1 sac — Ciment, faite le 18/11/2026 14:32 »
function descriptionOperation(mouvement) {
  const libelle = libelleMouvement(
    mouvement.type, mouvement.deltaMilliemes, mouvement.unite, mouvement.nomProduit
  );
  return mouvement.dateAppareil
    ? `${libelle}, faite le ${FORMAT_DATE.format(mouvement.dateAppareil)}`
    : libelle;
}

// Motif de l'annulation : « Annulation : Sortie -1 sac du 18/11/2026 14:32 ».
// Le nom du produit est déjà dans le mouvement.
function motifAnnulation(mouvement) {
  let texte = `Annulation : ${LIBELLES_TYPE[mouvement.type] || mouvement.type} ` +
    `${formaterVariation(mouvement.deltaMilliemes)} ${mouvement.unite}`;
  if (mouvement.dateAppareil) {
    texte += ` du ${FORMAT_DATE.format(mouvement.dateAppareil)}`;
  }
  return texte.slice(0, LONGUEUR_MAX_MOTIF);
}

// Crée l'opération inverse, après confirmation. Elle part par le même chemin
// que les autres mouvements (un seul lot, suivi jusqu'à la réponse du
// serveur) ; rien n'est modifié ni supprimé.
function annulerOperation(idMouvement) {
  effacerMessages();
  const mouvement = mouvementsConnus.get(idMouvement);
  // Nouvelle vérification au moment de l'appui : l'état a pu changer.
  if (!mouvement || !peutEtreAnnule(mouvement)) {
    afficherMessage('erreur-historique', 'Cette opération ne peut plus être annulée.');
    return;
  }
  const produit = produitActif(mouvement.idProduit);
  const correction = -mouvement.deltaMilliemes;
  const apres = produit.quantiteMilliemes + correction;
  const description = descriptionOperation(mouvement);

  let question = 'Annuler cette opération ?\n\n' + description + '\n\n' +
    `L’application va enregistrer l’opération inverse : ` +
    `${LIBELLES_TYPE.ajustement} ${formaterVariation(correction)} ${mouvement.unite}.\n` +
    `Stock de « ${produit.nom} » après l’annulation : ${formaterQuantite(apres)} ${produit.unite} ` +
    '(estimation d’après ce que cet appareil connaît).';
  if (apres < 0) {
    question += '\n' + texteStockNegatif(produit.quantiteMilliemes);
  }
  question += '\n\nL’opération restera dans l’historique, marquée « Annulée ». ' +
    'Une annulation ne peut pas être annulée.';
  if (!window.confirm(question)) {
    return;
  }

  envoyerMouvement(produit, 'ajustement', correction, motifAnnulation(mouvement), {
    idMouvement: idAnnulation(mouvement.id),
    libelle: `Annulation de : ${description}`,
    messageDejaEnregistree:
      `Cette opération avait déjà été annulée, peut-être depuis un autre appareil : ` +
      `${description}. Rien n’a été compté deux fois.`
  });
  afficherMessage('info-historique', `Opération annulée : ${description}.`);
}

function boutonAnnuler(mouvement) {
  const bouton = document.createElement('button');
  bouton.type = 'button';
  bouton.className = 'bouton bouton-secondaire';
  bouton.dataset.action = 'annuler';
  bouton.textContent = 'Annuler cette opération';
  bouton.setAttribute('aria-label', `Annuler cette opération : ${descriptionOperation(mouvement)}`);
  bouton.addEventListener('click', () => annulerOperation(mouvement.id));
  return bouton;
}

// ---------- Bon imprimable (étape 9b, décisions 89 à 91) ----------

// Rassemble ce que l'historique sait déjà du mouvement, puis ouvre la
// fenêtre d'impression. Rien n'est écrit ni lu sur le serveur.
function imprimerMouvement(idMouvement) {
  effacerMessages();
  const mouvement = mouvementsConnus.get(idMouvement);
  if (!mouvement) {
    afficherMessage('erreur-historique', 'Cette opération n’est plus dans l’historique affiché.');
    return;
  }
  // Code SKU actuel du produit, s'il est encore dans la liste (non archivé).
  const produit = produitActif(mouvement.idProduit);
  const annulation = annulationDe(mouvement);
  const imprime = imprimerBon({
    idMouvement: mouvement.id,
    type: mouvement.type,
    deltaMilliemes: mouvement.deltaMilliemes,
    unite: mouvement.unite,
    nomProduit: mouvement.nomProduit,
    motif: mouvement.motif,
    date: mouvement.dateAppareil || mouvement.dateServeur || null,
    codeSku: produit && produit.codeSku ? produit.codeSku : '',
    nomEntrepot,
    annulation: annulation
      ? { idMouvement: annulation.id, date: annulation.dateAppareil || annulation.dateServeur || null }
      : null,
    enAttente: estEnAttente(mouvement)
  });
  if (!imprime) {
    afficherMessage(
      'erreur-historique',
      'Ce navigateur ne permet pas d’imprimer. Ouvrez MinStock dans Chrome pour imprimer ce bon.'
    );
  }
}

function boutonImprimer(mouvement) {
  const bouton = document.createElement('button');
  bouton.type = 'button';
  bouton.className = 'bouton-imprimer';
  bouton.dataset.action = 'imprimer';
  bouton.setAttribute('aria-label', `Imprimer le bon : ${descriptionOperation(mouvement)}`);

  const icone = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icone.setAttribute('class', 'icone');
  icone.setAttribute('aria-hidden', 'true');
  icone.setAttribute('focusable', 'false');
  const dessin = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  dessin.setAttribute('href', '#icone-imprimer');
  icone.append(dessin);

  const texte = document.createElement('span');
  texte.textContent = 'Imprimer';
  bouton.append(icone, texte);
  bouton.addEventListener('click', () => imprimerMouvement(mouvement.id));
  return bouton;
}

// ---------- Affichage de l'historique ----------

function ligneHistorique(mouvement) {
  const article = document.createElement('li');
  article.className = 'mouvement';
  article.dataset.mouvement = mouvement.id;
  // Permet de garder le focus clavier sur cette ligne quand la liste est
  // reconstruite (par exemple juste après une annulation).
  article.tabIndex = -1;

  const entete = document.createElement('div');
  entete.className = 'mouvement-entete';
  const titre = document.createElement('h4');
  titre.textContent = mouvement.nomProduit;
  entete.append(titre, boutonImprimer(mouvement));
  article.append(entete);

  article.append(paragraphe(
    'mouvement-variation',
    `${LIBELLES_TYPE[mouvement.type] || mouvement.type} : ` +
    `${formaterVariation(mouvement.deltaMilliemes)} ${mouvement.unite}`
  ));

  // Heure de l'opération (appareil) et heure de réception (serveur) ne
  // sont jamais confondues.
  if (mouvement.dateAppareil) {
    article.append(paragraphe('', 'Fait le ' + FORMAT_DATE.format(mouvement.dateAppareil)));
  }
  if (estEnAttente(mouvement)) {
    article.append(paragraphe('produit-attente', 'En attente de synchronisation'));
  } else if (mouvement.dateAppareil &&
      Math.abs(mouvement.dateServeur - mouvement.dateAppareil) > ECART_SYNCHRONISATION_MS) {
    article.append(paragraphe(
      'aide',
      'Reçu par le serveur le ' + FORMAT_DATE.format(mouvement.dateServeur)
    ));
  }
  if (mouvement.motif) {
    article.append(paragraphe('', 'Motif : ' + mouvement.motif));
  }

  const annulation = annulationDe(mouvement);
  if (annulation) {
    article.append(paragraphe(
      'mouvement-annulee',
      annulation.dateAppareil
        ? 'Annulée le ' + FORMAT_DATE.format(annulation.dateAppareil)
        : 'Annulée'
    ));
  } else if (peutEtreAnnule(mouvement)) {
    article.append(boutonAnnuler(mouvement));
  } else if (produitsCharges && annulationPossiblePourId(mouvement.id) &&
      !estEnAttente(mouvement) && produitActif(mouvement.idProduit) === null) {
    article.append(paragraphe('aide', 'Produit archivé : cette opération ne peut plus être annulée.'));
  }
  return article;
}

// Recherche (décision 84) : nom du produit, type d'opération (« sortie »…) ou
// motif, sans tenir compte des majuscules ni des accents.
function correspondALaRecherche(mouvement, recherche) {
  return normaliserPourRecherche(mouvement.nomProduit || '').includes(recherche) ||
    normaliserPourRecherche(LIBELLES_TYPE[mouvement.type] || '').includes(recherche) ||
    normaliserPourRecherche(mouvement.motif || '').includes(recherche);
}

// Ligne sous la recherche : combien de mouvements trouvés, parmi combien de
// mouvements chargés, et comment chercher plus loin.
function afficherBilanRecherche(saisie, nombreTrouves, nombreCharges) {
  const bilan = element('recherche-historique-bilan');
  if (!normaliserPourRecherche(saisie)) {
    bilan.hidden = true;
    bilan.textContent = '';
    return;
  }
  const charges = `parmi les ${FORMAT_ENTIER.format(nombreCharges)} derniers mouvements chargés`;
  let texte = nombreTrouves === 0
    ? `Aucun mouvement ne correspond à « ${saisie.trim()} » ${charges}.`
    : `${FORMAT_ENTIER.format(nombreTrouves)} ` +
      (nombreTrouves >= 2 ? 'mouvements trouvés' : 'mouvement trouvé') + ` ${charges}.`;
  if (peutEtreDAutres) {
    texte += ' Pour chercher plus loin, touchez « Voir plus » en bas de la liste.';
  }
  bilan.textContent = texte;
  bilan.hidden = false;
}

function afficherHistorique() {
  const liste = element('liste-historique');

  // Ligne qui a le focus clavier, pour le lui rendre après reconstruction.
  const actif = document.activeElement;
  const ligneActive = actif && liste.contains(actif) ? actif.closest('li[data-mouvement]') : null;
  const idActif = ligneActive ? ligneActive.dataset.mouvement : null;
  // Bouton qui avait le focus (« imprimer » ou « annuler »), s'il y en avait un.
  const actionActive = ligneActive && actif.tagName === 'BUTTON' ? actif.dataset.action : null;

  liste.textContent = '';
  const mouvements = mouvementsTries();
  element('historique-vide').hidden = !mouvementsRecus || mouvements.length > 0;
  element('bloc-recherche-historique').hidden = mouvements.length === 0;

  // La recherche ne filtre que l'affichage : chaque ligne est construite avec
  // tout l'historique chargé (« Annulée », bouton « Annuler cette opération »).
  const saisie = element('recherche-historique').value;
  const recherche = normaliserPourRecherche(saisie);
  const visibles = recherche
    ? mouvements.filter((mouvement) => correspondALaRecherche(mouvement, recherche))
    : mouvements;
  afficherBilanRecherche(saisie, visibles.length, mouvements.length);

  for (const mouvement of visibles) {
    liste.append(ligneHistorique(mouvement));
  }

  if (idActif) {
    const ligne = liste.querySelector(`li[data-mouvement="${CSS.escape(idActif)}"]`);
    if (ligne) {
      const bouton = actionActive
        ? ligne.querySelector(`button[data-action="${actionActive}"]`)
        : null;
      (bouton || ligne).focus({ preventScroll: true });
    }
  }

  element('bouton-voir-plus').hidden = !peutEtreDAutres;
  element('historique-partiel').hidden = !historiquePartiel;
}

function surMouvements(etat) {
  signalerEcoute('mouvements', etat.depuisCache, etat.mouvements.some((mouvement) => mouvement.enAttente));
  mouvementsRecus = true;
  // Un mouvement qui était « en attente » et qui a disparu de l'écoute a été
  // refusé par le serveur : il sort de l'historique.
  const nouveauxIds = new Map(etat.mouvements.map((mouvement) => [mouvement.id, mouvement.enAttente]));
  for (const [id, etaitEnAttente] of idsEnDirect) {
    if (etaitEnAttente && !nouveauxIds.has(id)) {
      mouvementsConnus.delete(id);
    }
  }
  idsEnDirect = nouveauxIds;

  for (const mouvement of etat.mouvements) {
    mouvementsConnus.set(mouvement.id, mouvement);
  }
  if (!pagesChargees) {
    peutEtreDAutres = etat.mouvements.length >= TAILLE_PAGE_HISTORIQUE;
  }
  afficherHistorique();
}

function surErreurMouvements(erreur) {
  console.error(erreur);
  afficherMessage(
    'erreur-historique',
    'Impossible de charger l’historique. ' + messageErreur(erreur) + ' Rechargez la page.'
  );
}

async function voirPlus() {
  // Le plus ancien mouvement confirmé sert de point de départ.
  const confirmes = mouvementsTries().filter((mouvement) => mouvement.dateServeur !== null);
  const plusAncien = confirmes[confirmes.length - 1];
  if (!plusAncien) {
    return;
  }
  const bouton = element('bouton-voir-plus');
  bouton.disabled = true;
  try {
    const page = await chargerMouvementsSuivants(contexte.db, contexte.uid, plusAncien.document);
    pagesChargees = true;
    for (const mouvement of page.mouvements) {
      mouvementsConnus.set(mouvement.id, mouvement);
    }
    peutEtreDAutres = page.mouvements.length >= TAILLE_PAGE_HISTORIQUE;
    historiquePartiel = page.depuisCache;
    afficherHistorique();
  } catch (erreur) {
    console.error(erreur);
    afficherMessage('erreur-historique', 'Impossible de charger la suite. ' + messageErreur(erreur));
  } finally {
    bouton.disabled = false;
  }
}

// ---------- Branchement ----------

// À appeler une seule fois, au démarrage de l'application.
export function brancherEcranMouvements() {
  element('mouvement-motif').maxLength = LONGUEUR_MAX_MOTIF;

  element('formulaire-mouvement').addEventListener('submit', (evenement) => {
    evenement.preventDefault();
    enregistrerLeMouvement();
  });
  element('formulaire-mouvement').addEventListener('input', () => {
    element('erreur-mouvement').hidden = true;
    mettreAJourApercu();
  });
  element('bouton-annuler-mouvement').addEventListener('click', fermerFormulaireMouvement);

  element('bouton-historique').addEventListener('click', () => afficherVue('vue-historique'));
  element('bouton-retour-historique').addEventListener('click', () => afficherVue('vue-accueil'));
  element('bouton-voir-plus').addEventListener('click', voirPlus);
  element('recherche-historique').addEventListener('input', () => {
    if (contexte) {
      afficherHistorique();
    }
  });

  surChangementDesOperations(afficherOperationsRefusees);
}

// À appeler quand l'entrepôt du compte connecté est connu (ou a changé : son
// nom est imprimé en haut des bons).
export function demarrerEcranMouvements(db, uid, entrepot) {
  nomEntrepot = entrepot && entrepot.nomEntrepot ? entrepot.nomEntrepot : '';
  if (contexte && contexte.uid === uid) {
    return;
  }
  const nomGarde = nomEntrepot;
  arreterEcranMouvements();
  nomEntrepot = nomGarde;
  contexte = { db, uid };
  arreterEcoute = surveillerDerniersMouvements(db, uid, surMouvements, surErreurMouvements);
  afficherOperationsRefusees();
  verifierOperationsAuDemarrage(db, uid);
}

// À appeler à la déconnexion.
export function arreterEcranMouvements() {
  if (arreterEcoute) {
    arreterEcoute();
    arreterEcoute = null;
  }
  oublierEcoute('mouvements');
  contexte = null;
  nomEntrepot = '';
  effacerBon();
  produitDuFormulaire = null;
  mouvementsConnus.clear();
  idsEnDirect = new Map();
  pagesChargees = false;
  peutEtreDAutres = false;
  historiquePartiel = false;
  mouvementsRecus = false;
  produitsActifs = [];
  produitsCharges = false;
  element('liste-historique').textContent = '';
  element('historique-vide').hidden = true;
  element('bouton-voir-plus').hidden = true;
  element('historique-partiel').hidden = true;
  element('recherche-historique').value = '';
  element('bloc-recherche-historique').hidden = true;
  element('recherche-historique-bilan').hidden = true;
  element('recherche-historique-bilan').textContent = '';
  afficherOperationsRefusees();
}
