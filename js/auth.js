// Comptes utilisateurs : connexion, inscription, mot de passe oublié,
// déconnexion. Deux méthodes : Google, ou adresse e-mail et mot de passe.

import {
  EmailAuthProvider,
  GoogleAuthProvider,
  browserPopupRedirectResolver,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from '../vendor/firebase-auth.js';

export const LONGUEUR_MIN_MOT_DE_PASSE = 8;

// ---------- Préparation de la fenêtre Google (décision 99) ----------
// Firebase démarre sans préparer la connexion Google (js/firebase-init.js) :
// l'ouverture de l'application n'attend plus les serveurs de Google. La
// fenêtre Google a besoin de scripts de Google et d'une page cachée ; ils
// sont chargés à l'avance, en arrière-plan, quand un écran qui propose Google
// s'affiche, pour que la fenêtre s'ouvre tout de suite à l'appui (sinon le
// navigateur pourrait la bloquer).

let connexionGooglePreparee = false;
let preparationEnCours = false;

// Sans effet si c'est déjà fait, en cours, ou sans Internet (nouvel essai au
// prochain affichage de l'écran, ou au retour d'Internet).
export function preparerConnexionGoogle(auth) {
  if (connexionGooglePreparee || preparationEnCours || navigator.onLine === false) {
    return;
  }
  preparationEnCours = true;
  // Fonction interne de Firebase (`_initialize`, SDK en version fixe 13.4.0,
  // décision 16) : elle charge les scripts de Google, gardés ensuite pour la
  // fenêtre. Un échec est sans conséquence : la fenêtre les chargera
  // elle-même à l'appui.
  Promise.resolve()
    .then(() => new browserPopupRedirectResolver()._initialize(auth))
    .then(() => {
      connexionGooglePreparee = true;
    })
    .catch(() => {
      // Pas d'Internet ou réseau trop lent : nouvel essai plus tard.
    })
    .finally(() => {
      preparationEnCours = false;
    });
}

// Connexion avec Google dans une fenêtre popup (jamais par redirection : voir
// CLAUDE.md). À appeler directement depuis le clic, sans attente avant, sinon
// le navigateur bloque la fenêtre.
export function connecterAvecGoogle(auth) {
  const fournisseur = new GoogleAuthProvider();
  // Toujours proposer le choix du compte : utile sur un appareil partagé.
  fournisseur.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(auth, fournisseur, browserPopupRedirectResolver);
}

export function connecterAvecMotDePasse(auth, email, motDePasse) {
  return signInWithEmailAndPassword(auth, email, motDePasse);
}

export function creerCompte(auth, email, motDePasse) {
  return createUserWithEmailAndPassword(auth, email, motDePasse);
}

// Envoie l'e-mail de réinitialisation. Firebase ne dit pas si l'adresse a un
// compte : l'écran affiche donc toujours le même message.
export function envoyerReinitialisation(auth, email) {
  auth.languageCode = 'fr';
  return sendPasswordResetEmail(auth, email);
}

export function seDeconnecter(auth) {
  return signOut(auth);
}

// ---------- Suppression du compte (phase 7, décision 60) ----------

// Méthode à utiliser pour se reconnecter : 'motDePasse' si le compte en a un,
// sinon 'google'.
export function methodeDeReconnexion(utilisateur) {
  const methodes = (utilisateur && utilisateur.providerData) || [];
  return methodes.some((methode) => methode.providerId === 'password') ? 'motDePasse' : 'google';
}

export function reconnecterAvecMotDePasse(utilisateur, motDePasse) {
  const preuve = EmailAuthProvider.credential(utilisateur.email, motDePasse);
  return reauthenticateWithCredential(utilisateur, preuve);
}

// À appeler directement depuis le clic, sans attente avant (fenêtre popup).
export function reconnecterAvecGoogle(utilisateur) {
  const fournisseur = new GoogleAuthProvider();
  fournisseur.setCustomParameters({ prompt: 'select_account' });
  return reauthenticateWithPopup(utilisateur, fournisseur, browserPopupRedirectResolver);
}

// Supprime le compte de connexion lui-même (dernière étape).
export function supprimerCompteDeConnexion(utilisateur) {
  return deleteUser(utilisateur);
}

// Appelle `rappel` avec l'utilisateur connecté, ou null. Le premier appel
// arrive dès que Firebase a retrouvé la session enregistrée sur l'appareil,
// même sans Internet.
export function surveillerConnexion(auth, rappel) {
  return onAuthStateChanged(auth, rappel);
}
