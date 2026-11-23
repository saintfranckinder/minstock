// Enchaînement des écrans : connexion, inscription, mot de passe oublié,
// confidentialité, premier lancement, puis écran des produits.

import {
  LONGUEUR_MIN_MOT_DE_PASSE,
  connecterAvecGoogle,
  connecterAvecMotDePasse,
  creerCompte,
  envoyerReinitialisation,
  preparerConnexionGoogle,
  seDeconnecter,
  surveillerConnexion
} from './auth.js';
import {
  arreterEcranMouvements,
  brancherEcranMouvements,
  demarrerEcranMouvements
} from './ecran-mouvements.js';
import {
  arreterEcranFournisseurs,
  brancherEcranFournisseurs,
  demarrerEcranFournisseurs,
  quitterEcranFournisseurs
} from './ecran-fournisseurs.js';
import {
  arreterEcranClients,
  brancherEcranClients,
  demarrerEcranClients,
  quitterEcranClients
} from './ecran-clients.js';
import {
  arreterEcranParametres,
  brancherEcranParametres,
  demarrerEcranParametres
} from './ecran-parametres.js';
import {
  arreterEcranProduits,
  brancherEcranProduits,
  demarrerEcranProduits
} from './ecran-produits.js';
import {
  CLE_COMPTE_SUPPRIME,
  arreterEcranSuppression,
  brancherEcranSuppression,
  demarrerEcranSuppression,
  reprendreSuppression,
  suppressionPriseEnMain
} from './ecran-suppression.js';
import { effacerDonneesLocales, suppressionCommenceeIci } from './suppression-compte.js';
import { arreterExport, brancherExport, demarrerExport } from './export-excel.js';
import {
  arreterIndicateur,
  brancherIndicateur,
  demarrerIndicateur,
  modificationsEnAttente,
  signalerEcoute
} from './indicateur-synchro.js';
import { autreCompteAvecOperationsEnAttente } from './operations-en-attente.js';
import {
  DEVISES,
  LONGUEUR_MAX_NOM_ENTREPOT,
  creerEntrepot,
  surveillerEntrepot
} from './entrepot.js';
import { demarrerFirebase, VERSION_SDK_FIREBASE } from './firebase-init.js';
import { afficherMessage, afficherVue, effacerMessages, element, vueActuelle } from './interface.js';
import { messageErreur } from './messages-erreur.js';
import { demarrerMisesAJour } from './mises-a-jour.js';
// Numéro de version : dans js/version.js, égal à celui de service-worker.js
// (décision 96).
import { VERSION_APP } from './version.js';

// Bouton retour du téléphone (décision 75) : pour chaque écran secondaire, le
// bouton de l'écran qui fait déjà « revenir » (flèche ←, « Annuler »…). Le
// retour du téléphone le touche à la place de l'utilisateur. Les écrans qui
// n'y figurent pas (accueil, connexion, chargement…) sont des écrans de base :
// là, le retour quitte l'application comme d'habitude.
// Niveau 1 : ouvert depuis un écran de base ; niveau 2 : ouvert depuis un
// écran de niveau 1 (formulaire d'un carnet, suppression du compte).
const ECRANS_NIVEAU_2 = ['vue-fournisseur', 'vue-client', 'vue-suppression'];
const BOUTONS_RETOUR = {
  'vue-historique': '#bouton-retour-historique',
  'vue-fournisseurs': '#bouton-retour-fournisseurs',
  'vue-fournisseur': '#bouton-annuler-fournisseur',
  'vue-clients': '#bouton-retour-clients',
  'vue-client': '#bouton-annuler-client',
  'vue-parametres': '#bouton-retour-parametres',
  'vue-produit': '#bouton-annuler-produit',
  'vue-mouvement': '#bouton-annuler-mouvement',
  'vue-suppression': '#bouton-annuler-suppression',
  'vue-inscription': '#vue-inscription [data-aller="vue-connexion"]',
  'vue-oubli': '#vue-oubli [data-aller="vue-connexion"]',
  'vue-confidentialite': '#vue-confidentialite [data-aller="vue-connexion"]'
};

// Écrans où s'affichent la barre de navigation et le bouton ⚙ (décision 74).
// Ils sont cachés dans les formulaires, pour ne pas quitter une saisie par
// mégarde.
const VUES_NAVIGATION = ['vue-accueil', 'vue-historique', 'vue-fournisseurs', 'vue-clients'];

// Message affiché sur l'écran de connexion après « Effacer les données de cet
// appareil » (décision 67), qui recharge la page.
const CLE_APPAREIL_EFFACE = 'appareil-efface';

const QUESTION_DECONNEXION =
  'Des modifications faites sur cet appareil n’ont pas encore été envoyées au serveur.\n\n' +
  'Si vous vous déconnectez, elles restent sur cet appareil et partiront à votre ' +
  'prochaine connexion ici avec ce compte, quand Internet sera là. Elles seraient ' +
  'perdues si les données du navigateur étaient effacées.\n\n' +
  'Se déconnecter quand même ?';

const QUESTION_EFFACEMENT =
  'Effacer les données de cet appareil ?\n\n' +
  'La copie de vos données gardée sur cet appareil sera effacée, puis vous serez ' +
  'déconnecté. Vos données restent sur le serveur : à la prochaine connexion, il ' +
  'faudra Internet pour les recharger.\n\n' +
  'Si d’autres comptes MinStock sont utilisés dans ce navigateur, leur copie sera ' +
  'effacée aussi.';

// Écrans accessibles sans être connecté.
const VUES_SANS_COMPTE = ['vue-connexion', 'vue-inscription', 'vue-oubli', 'vue-confidentialite'];

// Écrans de travail d'un compte connecté. Tant que l'utilisateur est sur l'un
// d'eux, une simple mise à jour de l'entrepôt ne doit pas le déplacer.
const VUES_DE_TRAVAIL = [
  'vue-accueil', 'vue-produit', 'vue-mouvement', 'vue-historique', 'vue-parametres',
  'vue-fournisseurs', 'vue-fournisseur', 'vue-clients', 'vue-client', 'vue-suppression'
];

const AVERTISSEMENT_STOCKAGE =
  'Ce navigateur n’enregistre pas les données sur l’appareil. ' +
  'Sans Internet, l’application ne pourra pas se rouvrir avec vos données, ' +
  'et une modification non envoyée sera perdue à la fermeture. ' +
  'Évitez la navigation privée et vérifiez que le stockage du site est autorisé.';

let firebase = null;
let utilisateur = null;
let arreterEcouteEntrepot = null;
let memoireHorsLigneVerifiee = false;
let premierEtatConnu = false;
let stockagePersistantDemande = false;
let entrepotCharge = false;       // un compte est connecté et son entrepôt est affiché

// Historique du navigateur (décision 75) : autant d'entrées ajoutées que le
// niveau de l'écran affiché (0, 1 ou 2). Elles sont ajoutées au moment d'un
// toucher : Chrome ignore au retour les entrées ajoutées sans geste de
// l'utilisateur.
let profondeurHistorique = 0;      // entrées ajoutées par l'application
let retourEnCours = false;         // un retour du téléphone est en train d'être traité
let ignorerProchainRetour = false; // le prochain « popstate » vient de history.go() appelé ici

// ---------- Affichage ----------

function afficherProbleme(titre, texte) {
  element('probleme-titre').textContent = titre;
  element('probleme-texte').textContent = texte;
  element('bouton-deconnexion-probleme').hidden = utilisateur === null;
  afficherVue('vue-probleme');
}

function afficherAvertissementStockage() {
  const zone = element('avertissement-stockage');
  zone.textContent = AVERTISSEMENT_STOCKAGE;
  zone.hidden = false;
}

// Désactive un bouton pendant une opération, pour éviter les doubles envois.
async function avecBoutonOccupe(bouton, texteOccupe, action) {
  const texteNormal = bouton.textContent;
  bouton.disabled = true;
  bouton.textContent = texteOccupe;
  try {
    await action();
  } finally {
    bouton.disabled = false;
    bouton.textContent = texteNormal;
  }
}

function viderMotsDePasse() {
  for (const champ of document.querySelectorAll('input[data-mot-de-passe]')) {
    champ.value = '';
    champ.type = 'password';
  }
  for (const caseACocher of document.querySelectorAll('input[data-afficher-mdp]')) {
    caseACocher.checked = false;
  }
}

// ---------- Entrepôt ----------

async function verifierMemoireHorsLigneUneFois() {
  if (memoireHorsLigneVerifiee) {
    return;
  }
  memoireHorsLigneVerifiee = true;
  const active = await firebase.verifierMemoireHorsLigne();
  if (!active) {
    afficherAvertissementStockage();
  }
}

// Demande au navigateur de garder durablement les données de l'application
// (décision 68). Il peut refuser sans le dire : ce n'est pas une garantie.
// Demandé seulement une fois l'entrepôt chargé : certains navigateurs
// (Firefox) posent la question à l'utilisateur.
function demanderStockagePersistant() {
  if (stockagePersistantDemande) {
    return;
  }
  stockagePersistantDemande = true;
  try {
    if (!navigator.storage || typeof navigator.storage.persist !== 'function') {
      return;
    }
    navigator.storage.persisted()
      .then((deja) => deja || navigator.storage.persist())
      .then((accorde) => console.info(`Stockage durable accordé par le navigateur : ${accorde ? 'oui' : 'non'}.`))
      .catch(() => {});
  } catch {
    // Navigateur sans cette fonction : rien à faire.
  }
}

// Barre de navigation et bouton ⚙ (décision 74) : visibles seulement sur les
// quatre écrans principaux d'un compte dont l'entrepôt est affiché.
function mettreAJourNavigation() {
  const vue = vueActuelle();
  const visible = entrepotCharge && VUES_NAVIGATION.includes(vue);
  element('barre-navigation').hidden = !visible;
  element('bouton-parametres').hidden = !visible;
  document.body.classList.toggle('avec-navigation', visible);
  document.body.classList.toggle('connecte', entrepotCharge);
  for (const bouton of document.querySelectorAll('[data-nav]')) {
    if (bouton.dataset.nav === vue) {
      bouton.setAttribute('aria-current', 'page');
    } else {
      bouton.removeAttribute('aria-current');
    }
  }
}

// ---------- Bouton retour du téléphone (décision 75) ----------

function niveauEcran(vue) {
  if (!BOUTONS_RETOUR[vue]) {
    return 0;
  }
  return ECRANS_NIVEAU_2.includes(vue) ? 2 : 1;
}

// Ramène le nombre d'entrées ajoutées au niveau de l'écran affiché.
function ajusterHistorique() {
  const niveau = niveauEcran(vueActuelle());
  while (profondeurHistorique < niveau) {
    window.history.pushState({ minstock: profondeurHistorique + 1 }, '');
    profondeurHistorique += 1;
  }
  if (profondeurHistorique > niveau) {
    // Retour vers un écran moins profond par un bouton de l'application : les
    // entrées en trop sont retirées, pour que le retour du téléphone mène
    // ensuite au bon écran (ou quitte l'application depuis l'accueil).
    const enTrop = profondeurHistorique - niveau;
    profondeurHistorique = niveau;
    ignorerProchainRetour = true;
    window.history.go(-enTrop);
  }
}

// Après chaque changement d'écran fait dans l'application.
function synchroniserHistorique() {
  if (!retourEnCours) {
    ajusterHistorique();
  }
}

// Le bouton retour du téléphone a été pressé : le navigateur a déjà reculé
// d'une entrée. L'écran fait comme si son bouton « retour » était touché.
function surRetourDuTelephone() {
  if (ignorerProchainRetour) {
    ignorerProchainRetour = false;
    return;
  }
  if (profondeurHistorique === 0) {
    return;
  }
  profondeurHistorique -= 1;
  const selecteur = BOUTONS_RETOUR[vueActuelle()];
  const bouton = selecteur ? document.querySelector(selecteur) : null;
  retourEnCours = true;
  try {
    if (bouton && !bouton.disabled) {
      bouton.click();
    }
  } finally {
    retourEnCours = false;
  }
  ajusterHistorique();
}

// Hauteur de l'en-tête figé, qui change quand l'explication de l'indicateur
// s'ouvre : la partie figée des écrans se place juste dessous.
function suivreHauteurEntete() {
  const entete = document.querySelector('.entete');
  const appliquer = () => {
    document.documentElement.style.setProperty('--hauteur-entete', `${entete.offsetHeight}px`);
  };
  appliquer();
  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(appliquer).observe(entete);
  }
}

// Quitter un carnet (fournisseurs, clients) pour un autre écran arrête
// l'écoute de sa liste (décision 52).
function quitterLesCarnets(cible) {
  if (cible !== 'vue-fournisseurs') {
    quitterEcranFournisseurs();
  }
  if (cible !== 'vue-clients') {
    quitterEcranClients();
  }
}

// Arrête les écoutes des écrans de travail (déconnexion, suppression du compte).
function arreterEcransDeTravail() {
  arreterEcranProduits();
  arreterEcranMouvements();
  arreterEcranParametres();
  arreterExport();
  arreterEcranFournisseurs();
  arreterEcranClients();
  arreterIndicateur();
  entrepotCharge = false;
  mettreAJourNavigation();
}

function surEtatEntrepot(etat) {
  verifierMemoireHorsLigneUneFois();

  // Suppression du compte commencée sur cet appareil : l'écran de suppression
  // garde la main jusqu'au rechargement de la page (décision 62).
  if (suppressionPriseEnMain()) {
    arreterEcransDeTravail();
    return;
  }

  // Suppression demandée (sur cet appareil ou un autre) : plus d'écoute des
  // données, la suppression reprend où elle s'était arrêtée.
  if (etat.existe && etat.donnees.suppressionDemandee === true) {
    arreterEcransDeTravail();
    reprendreSuppression();
    return;
  }

  // L'entrepôt n'existe plus sur le serveur alors que cet appareil avait
  // commencé une suppression : il ne reste que le compte de connexion.
  if (!etat.existe && !etat.depuisCache && suppressionCommenceeIci(utilisateur.uid)) {
    arreterEcransDeTravail();
    reprendreSuppression();
    return;
  }

  if (etat.existe) {
    element('accueil-entrepot').textContent = etat.donnees.nomEntrepot;
    // L'adresse du compte est affichée dans Paramètres (décision 74).
    element('parametres-compte').textContent = utilisateur.email || 'compte sans adresse e-mail';
    demarrerIndicateur(firebase.db, utilisateur.uid);
    signalerEcoute('entrepot', etat.depuisCache);
    demanderStockagePersistant();
    demarrerEcranProduits(firebase.db, utilisateur.uid, etat.donnees);
    demarrerEcranMouvements(firebase.db, utilisateur.uid, etat.donnees);
    demarrerEcranParametres(firebase.db, utilisateur.uid, etat.donnees);
    demarrerExport(firebase.db, utilisateur.uid, etat.donnees);
    demarrerEcranFournisseurs(firebase.db, utilisateur.uid);
    demarrerEcranClients(firebase.db, utilisateur.uid);
    entrepotCharge = true;
    if (!VUES_DE_TRAVAIL.includes(vueActuelle())) {
      afficherVue('vue-accueil');
    }
    mettreAJourNavigation();
    return;
  }

  arreterEcransDeTravail();

  if (!etat.depuisCache) {
    // Le serveur confirme qu'aucun entrepôt n'existe : c'est un nouveau compte.
    afficherVue('vue-premier-lancement');
    return;
  }

  // Réponse venue de la mémoire de l'appareil : impossible de savoir si le
  // compte est nouveau. Ne surtout pas proposer de créer un entrepôt.
  afficherProbleme(
    'Connexion Internet nécessaire',
    'Vos données n’ont pas encore été chargées sur cet appareil. ' +
    'Dès qu’Internet revient, l’application continue toute seule.'
  );
}

// Lit puis oublie un message laissé avant le rechargement de la page.
function lireMessageLaisse(cle) {
  try {
    const valeur = window.sessionStorage.getItem(cle);
    window.sessionStorage.removeItem(cle);
    return valeur;
  } catch {
    return null;
  }
}

// Après la suppression d'un compte (décision 62) ou l'effacement des données
// de l'appareil (décision 67), la page est rechargée : le message s'affiche
// une fois sur l'écran de connexion.
function afficherMessageApresRechargement() {
  const copieNonEffacee =
    ' La copie gardée par ce navigateur n’a pas pu être effacée : fermez les autres onglets de MinStock, ' +
    'puis effacez les données du site dans les réglages du navigateur.';

  const compteSupprime = lireMessageLaisse(CLE_COMPTE_SUPPRIME);
  if (compteSupprime) {
    afficherMessage(
      'info-connexion',
      'Votre compte et toutes vos données ont été supprimés.' +
      (compteSupprime === 'complet' ? '' : copieNonEffacee)
    );
    return;
  }

  const appareilEfface = lireMessageLaisse(CLE_APPAREIL_EFFACE);
  if (appareilEfface) {
    afficherMessage(
      'info-connexion',
      appareilEfface === 'complet'
        ? 'Les données de cet appareil ont été effacées et vous êtes déconnecté. ' +
          'Vos données restent sur le serveur.'
        : 'Vous êtes déconnecté. Vos données restent sur le serveur.' + copieNonEffacee
    );
  }
}

function surErreurEntrepot(erreur) {
  if (suppressionPriseEnMain()) {
    // Fin de la suppression du compte : l'écran de suppression s'en occupe.
    return;
  }
  console.error(erreur);
  afficherProbleme(
    'Impossible de charger vos données',
    messageErreur(erreur) + ' Rechargez la page. Si le problème continue, ' +
    'les règles de sécurité ne sont peut-être pas publiées dans la console Firebase.'
  );
}

function surChangementUtilisateur(nouvelUtilisateur) {
  if (arreterEcouteEntrepot) {
    arreterEcouteEntrepot();
    arreterEcouteEntrepot = null;
  }
  arreterEcransDeTravail();
  arreterEcranSuppression();
  utilisateur = nouvelUtilisateur;
  viderMotsDePasse();
  // Le message « compte supprimé » ne se lit qu'au premier état de connexion
  // après le rechargement de la page.
  const premierEtat = !premierEtatConnu;
  premierEtatConnu = true;

  if (!utilisateur) {
    if (!VUES_SANS_COMPTE.includes(vueActuelle())) {
      afficherVue('vue-connexion');
    }
    if (premierEtat) {
      afficherMessageApresRechargement();
    }
    return;
  }

  demarrerEcranSuppression(firebase.db, firebase.auth);
  afficherVue('vue-chargement');
  arreterEcouteEntrepot = surveillerEntrepot(
    firebase.db,
    utilisateur.uid,
    surEtatEntrepot,
    surErreurEntrepot
  );
}

// ---------- Formulaires ----------

function brancherConnexion() {
  element('bouton-google').addEventListener('click', () => {
    effacerMessages();
    // Appel direct depuis le clic : indispensable pour que la popup s'ouvre.
    connecterAvecGoogle(firebase.auth).catch((erreur) => {
      afficherMessage('erreur-connexion', messageErreur(erreur));
    });
  });

  element('formulaire-connexion').addEventListener('submit', (evenement) => {
    evenement.preventDefault();
    effacerMessages();
    const email = element('connexion-email').value.trim();
    const motDePasse = element('connexion-mdp').value;
    if (!email || !motDePasse) {
      afficherMessage('erreur-connexion', 'Saisissez votre adresse e-mail et votre mot de passe.');
      return;
    }
    avecBoutonOccupe(evenement.submitter || element('bouton-connexion'), 'Connexion…', async () => {
      try {
        await connecterAvecMotDePasse(firebase.auth, email, motDePasse);
      } catch (erreur) {
        afficherMessage('erreur-connexion', messageErreur(erreur));
      }
    });
  });
}

function brancherInscription() {
  element('formulaire-inscription').addEventListener('submit', (evenement) => {
    evenement.preventDefault();
    effacerMessages();
    const email = element('inscription-email').value.trim();
    const motDePasse = element('inscription-mdp').value;
    if (!email) {
      afficherMessage('erreur-inscription', 'Saisissez votre adresse e-mail.');
      return;
    }
    if (motDePasse.length < LONGUEUR_MIN_MOT_DE_PASSE) {
      afficherMessage(
        'erreur-inscription',
        `Le mot de passe doit contenir au moins ${LONGUEUR_MIN_MOT_DE_PASSE} caractères.`
      );
      return;
    }
    avecBoutonOccupe(evenement.submitter || element('bouton-inscription'), 'Création…', async () => {
      try {
        await creerCompte(firebase.auth, email, motDePasse);
      } catch (erreur) {
        afficherMessage('erreur-inscription', messageErreur(erreur));
      }
    });
  });
}

function brancherMotDePasseOublie() {
  element('formulaire-oubli').addEventListener('submit', (evenement) => {
    evenement.preventDefault();
    effacerMessages();
    const email = element('oubli-email').value.trim();
    if (!email) {
      afficherMessage('erreur-oubli', 'Saisissez votre adresse e-mail.');
      return;
    }
    avecBoutonOccupe(evenement.submitter || element('bouton-oubli'), 'Envoi…', async () => {
      try {
        await envoyerReinitialisation(firebase.auth, email);
        // Même message que l'adresse ait un compte ou non.
        afficherMessage(
          'info-oubli',
          'Si un compte existe pour cette adresse, un e-mail vient d’être envoyé. ' +
          'Pensez à regarder dans le courrier indésirable.'
        );
      } catch (erreur) {
        afficherMessage('erreur-oubli', messageErreur(erreur));
      }
    });
  });
}

function brancherPremierLancement() {
  const liste = element('lancement-devise');
  for (const devise of DEVISES) {
    const option = document.createElement('option');
    option.value = devise.code;
    option.textContent = devise.nom;
    liste.append(option);
  }
  element('lancement-nom').maxLength = LONGUEUR_MAX_NOM_ENTREPOT;

  element('formulaire-lancement').addEventListener('submit', (evenement) => {
    evenement.preventDefault();
    effacerMessages();
    const nom = element('lancement-nom').value.trim();
    const devise = liste.value;
    if (!nom) {
      afficherMessage('erreur-lancement', 'Donnez un nom à votre entrepôt.');
      return;
    }
    if (nom.length > LONGUEUR_MAX_NOM_ENTREPOT) {
      afficherMessage(
        'erreur-lancement',
        `Le nom ne doit pas dépasser ${LONGUEUR_MAX_NOM_ENTREPOT} caractères.`
      );
      return;
    }
    if (!DEVISES.some((choix) => choix.code === devise)) {
      afficherMessage('erreur-lancement', 'Choisissez une devise dans la liste.');
      return;
    }
    // Pas d'attente : l'écran se met à jour dès l'enregistrement local.
    // Si le serveur refuse, l'écran de premier lancement revient avec ce message.
    creerEntrepot(firebase.db, utilisateur.uid, nom, devise).catch((erreur) => {
      console.error(erreur);
      afficherVue('vue-premier-lancement');
      afficherMessage(
        'erreur-lancement',
        'L’entrepôt n’a pas pu être créé. ' + messageErreur(erreur)
      );
    });
  });
}

// « Se déconnecter » : avertissement s'il reste des modifications non
// envoyées (décision 66). Elles restent sur l'appareil et partiront à la
// prochaine connexion avec ce compte.
async function deconnecter(bouton) {
  if (bouton.disabled) {
    return;
  }
  if (utilisateur) {
    let enAttente = false;
    await avecBoutonOccupe(bouton, 'Vérification…', async () => {
      enAttente = await modificationsEnAttente(firebase.db);
    });
    if (enAttente && !window.confirm(QUESTION_DECONNEXION)) {
      return;
    }
  }
  seDeconnecter(firebase.auth).catch((erreur) => console.error(erreur));
}

// « Effacer les données de cet appareil et me déconnecter » (décision 67).
// Refusé tant que des modifications attendent d'être envoyées : elles
// seraient perdues (CLAUDE.md, section 9).
async function effacerDonneesAppareil() {
  effacerMessages();
  if (!utilisateur) {
    return;
  }
  const uid = utilisateur.uid;
  const bouton = element('bouton-effacer-appareil');
  if (bouton.disabled) {
    return;
  }

  let enAttente = false;
  await avecBoutonOccupe(bouton, 'Vérification…', async () => {
    enAttente = await modificationsEnAttente(firebase.db);
  });
  if (enAttente) {
    afficherMessage(
      'erreur-effacer-appareil',
      'Rien n’a été effacé : des modifications faites sur cet appareil n’ont pas encore ' +
      'été envoyées au serveur. Attendez, avec Internet, que l’indicateur en haut de ' +
      'l’écran affiche « Synchronisé », puis recommencez.'
    );
    return;
  }
  if (autreCompteAvecOperationsEnAttente(uid)) {
    afficherMessage(
      'erreur-effacer-appareil',
      'Rien n’a été effacé : un autre compte utilisé sur cet appareil a des opérations ' +
      'pas encore envoyées. Connectez-vous avec ce compte, avec Internet, et attendez ' +
      '« Synchronisé » avant d’effacer.'
    );
    return;
  }
  if (!window.confirm(QUESTION_EFFACEMENT) || !utilisateur || utilisateur.uid !== uid) {
    return;
  }

  bouton.disabled = true;
  bouton.textContent = 'Effacement…';
  // Plus aucune écoute ni aucun écran de travail : la copie peut être effacée.
  if (arreterEcouteEntrepot) {
    arreterEcouteEntrepot();
    arreterEcouteEntrepot = null;
  }
  arreterEcransDeTravail();
  try {
    await seDeconnecter(firebase.auth);
  } catch (erreur) {
    console.error(erreur);
  }
  const complet = await effacerDonneesLocales(firebase.db, uid);
  try {
    window.sessionStorage.setItem(CLE_APPAREIL_EFFACE, complet ? 'complet' : 'partiel');
  } catch {
    // Stockage bloqué : la page se recharge sans message.
  }
  // Firebase est arrêté : la page doit être rechargée.
  window.location.reload();
}

function brancherNavigation() {
  for (const bouton of document.querySelectorAll('[data-aller]')) {
    bouton.addEventListener('click', () => {
      // Ces liens n'existent que sur les écrans sans compte.
      if (!utilisateur) {
        afficherVue(bouton.dataset.aller);
      }
    });
  }

  for (const bouton of document.querySelectorAll('[data-deconnexion]')) {
    bouton.addEventListener('click', () => deconnecter(bouton));
  }
  element('bouton-effacer-appareil').addEventListener('click', effacerDonneesAppareil);

  // Barre de navigation (décision 74). « Mouvements », « Fournisseurs » et
  // « Clients » sont aussi ouverts par leurs propres écrans (mêmes
  // identifiants que les anciens boutons de l'accueil).
  for (const bouton of document.querySelectorAll('[data-nav]')) {
    bouton.addEventListener('click', () => {
      if (!utilisateur) {
        return;
      }
      quitterLesCarnets(bouton.dataset.nav);
      if (bouton.dataset.nav === 'vue-accueil') {
        afficherVue('vue-accueil');
      }
    });
  }
  // Le bouton ⚙ ouvre Paramètres (js/ecran-parametres.js).
  element('bouton-parametres').addEventListener('click', () => quitterLesCarnets('vue-parametres'));
  document.addEventListener('vue-changee', mettreAJourNavigation);
  document.addEventListener('vue-changee', synchroniserHistorique);
  // Fenêtre Google préparée à l'avance sur les écrans qui la proposent
  // (décision 99), et de nouveau au retour d'Internet.
  document.addEventListener('vue-changee', preparerGoogleSiUtile);
  window.addEventListener('online', preparerGoogleSiUtile);
  window.addEventListener('popstate', surRetourDuTelephone);
  suivreHauteurEntete();

  for (const caseACocher of document.querySelectorAll('input[data-afficher-mdp]')) {
    caseACocher.addEventListener('change', () => {
      element(caseACocher.dataset.afficherMdp).type = caseACocher.checked ? 'text' : 'password';
    });
  }

  element('bouton-recharger').addEventListener('click', () => {
    window.location.reload();
  });
}

// ---------- Démarrage ----------

// Écrans où l'on peut toucher un bouton Google : connexion, inscription, et
// reconnexion avant la suppression du compte (décision 99).
const VUES_AVEC_GOOGLE = ['vue-connexion', 'vue-inscription', 'vue-suppression', 'vue-suppression-en-cours'];

function preparerGoogleSiUtile() {
  if (firebase && VUES_AVEC_GOOGLE.includes(vueActuelle())) {
    preparerConnexionGoogle(firebase.auth);
  }
}

// Vrai si MinStock est ouverte comme application installée (plein écran,
// sans barre d'adresse), et non dans un onglet du navigateur.
function estApplicationInstallee() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
}

async function demarrer() {
  element('version').textContent =
    `Version ${VERSION_APP} — SDK Firebase ${VERSION_SDK_FIREBASE}`;
  element('parametres-version').textContent = element('version').textContent;

  // Copie hors ligne et bandeau « Nouvelle version disponible » (phase 10),
  // indépendants de Firebase.
  demarrerMisesAJour();
  // Aide « Installer MinStock » de Paramètres (décision 95) : inutile dans
  // l'application déjà installée.
  element('bloc-installation').hidden = estApplicationInstallee();

  try {
    firebase = await demarrerFirebase();
  } catch (erreur) {
    console.error(erreur);
    afficherProbleme(
      'L’application n’a pas pu démarrer',
      'Rechargez la page. Si le problème continue, vérifiez la connexion Internet.'
    );
    return;
  }

  if (!firebase.stockageLocalDisponible) {
    afficherAvertissementStockage();
  }

  brancherNavigation();
  brancherIndicateur();
  brancherConnexion();
  brancherInscription();
  brancherMotDePasseOublie();
  brancherPremierLancement();
  brancherEcranProduits();
  brancherEcranMouvements();
  brancherEcranParametres();
  brancherExport();
  brancherEcranFournisseurs();
  brancherEcranClients();
  brancherEcranSuppression();

  surveillerConnexion(firebase.auth, surChangementUtilisateur);
}

demarrer();
