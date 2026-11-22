// Service worker et mises à jour (phase 10, décisions 96 et 97).
// Le service worker (service-worker.js) garde une copie des fichiers de
// l'application. Quand une nouvelle version est publiée, elle se télécharge
// en arrière-plan puis attend : le bandeau « Nouvelle version disponible »
// s'affiche, et rien ne change tant que l'utilisateur ne touche pas
// « Mettre à jour ». Jamais de rechargement automatique.

import { element } from './interface.js';

// Une application restée ouverte vérifie les nouvelles versions quand elle
// revient au premier plan, au plus une fois par heure.
const DELAI_VERIFICATION_MS = 60 * 60 * 1000;

let enregistrement = null;
let miseAJourDemandee = false;
let derniereVerification = 0;

function afficherBandeau() {
  element('bandeau-mise-a-jour').hidden = false;
}

// Une nouvelle version téléchargée attend tant qu'une version est déjà en
// place sur cet appareil.
function suivreLesNouvellesVersions(registration) {
  if (registration.waiting && navigator.serviceWorker.controller) {
    afficherBandeau();
  }
  registration.addEventListener('updatefound', () => {
    const nouvelle = registration.installing;
    if (!nouvelle) {
      return;
    }
    nouvelle.addEventListener('statechange', () => {
      if (nouvelle.state === 'installed' && navigator.serviceWorker.controller) {
        afficherBandeau();
      }
    });
  });
}

function mettreAJour() {
  miseAJourDemandee = true;
  element('bouton-mettre-a-jour').disabled = true;
  if (enregistrement && enregistrement.waiting) {
    // La nouvelle version prend la main ; la page se recharge ensuite
    // (événement « controllerchange »).
    enregistrement.waiting.postMessage('mettre-a-jour');
  } else {
    window.location.reload();
  }
}

function verifierSiNouvelleVersion() {
  if (document.visibilityState !== 'visible' || !enregistrement ||
      Date.now() - derniereVerification < DELAI_VERIFICATION_MS) {
    return;
  }
  derniereVerification = Date.now();
  enregistrement.update().catch(() => {
    // Pas d'Internet : nouvel essai plus tard.
  });
}

// À appeler une seule fois, au démarrage de l'application. Dans un navigateur
// sans service worker, l'application marche comme avant (sans ouverture hors
// ligne).
export function demarrerMisesAJour() {
  if (!('serviceWorker' in navigator)) {
    return;
  }
  element('bouton-mettre-a-jour').addEventListener('click', mettreAJour);

  // Une version était déjà en place : un changement de version qui n'a pas
  // été demandé ici vient d'un autre onglet ; le bandeau propose de recharger.
  const versionDejaEnPlace = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (miseAJourDemandee) {
      window.location.reload();
    } else if (versionDejaEnPlace) {
      afficherBandeau();
    }
  });

  navigator.serviceWorker.register('./service-worker.js')
    .then((registration) => {
      enregistrement = registration;
      derniereVerification = Date.now();
      suivreLesNouvellesVersions(registration);
    })
    .catch((erreur) => {
      console.warn('Copie hors ligne non installée : l’application marche, mais pas sans Internet.', erreur);
    });

  document.addEventListener('visibilitychange', verifierSiNouvelleVersion);
}
