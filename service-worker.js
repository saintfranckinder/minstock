// Service worker de MinStock (phase 10, décisions 96 et 97).
//
// Il garde sur l'appareil une copie des fichiers de l'application, pour
// qu'elle s'ouvre vite et même sans Internet après une première visite.
// Il ne garde JAMAIS les échanges avec Firebase (autres adresses : ils passent
// par le réseau, et les données restent gérées par la mémoire hors ligne de
// Firebase), ni les pages de test (toujours lues sur le serveur).
//
// Script classique (pas un module) : il marche dans tous les navigateurs qui
// savent installer une application.

// Numéro de version : DOIT être égal à celui de js/version.js (vérifié par
// tests-nombres.html). À changer à chaque publication : le navigateur ne
// détecte une nouvelle version que si ce fichier change.
const VERSION = '0.23.0';

// Bibliothèques copiées dans vendor/ (décision 16) : elles ne changent
// qu'avec leur propre version. Gardées à part et téléchargées une seule fois,
// pour ne pas reprendre environ 2 Mo de données mobiles à chaque nouvelle
// version de MinStock. Changer ce nom si une bibliothèque change.
const BIBLIOTHEQUES = 'firebase-13.4.0_sheetjs-0.20.3_montserrat-1';

const PREFIXE_CACHE = 'minstock-';
const CACHE_APPLICATION = `${PREFIXE_CACHE}application-${VERSION}`;
const CACHE_BIBLIOTHEQUES = `${PREFIXE_CACHE}bibliotheques-${BIBLIOTHEQUES}`;

// Fichiers de l'application, relatifs au dossier de ce fichier. Un fichier
// ajouté à l'application doit être ajouté ici, sinon il manquera sans
// Internet. Un fichier absent du serveur fait échouer l'installation (et
// l'application continue alors de marcher comme avant, sans copie).
const FICHIERS_APPLICATION = [
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './images/logo-minstock.svg',
  './images/icones/icone-192.png',
  './images/icones/icone-512.png',
  './images/icones/icone-maskable-512.png',
  './images/icones/apple-touch-icon.png',
  './js/app.js',
  './js/auth.js',
  './js/bon-mouvement.js',
  './js/clients.js',
  './js/ecran-clients.js',
  './js/ecran-fournisseurs.js',
  './js/ecran-mouvements.js',
  './js/ecran-parametres.js',
  './js/ecran-produits.js',
  './js/ecran-suppression.js',
  './js/entrepot.js',
  './js/export-excel.js',
  './js/firebase-config.js',
  './js/firebase-init.js',
  './js/fournisseurs.js',
  './js/indicateur-synchro.js',
  './js/interface.js',
  './js/messages-erreur.js',
  './js/mises-a-jour.js',
  './js/mouvements.js',
  './js/nombres.js',
  './js/operations-en-attente.js',
  './js/produits.js',
  './js/suppression-compte.js',
  './js/version.js'
];

const FICHIERS_BIBLIOTHEQUES = [
  './vendor/firebase-app.js',
  './vendor/firebase-auth.js',
  './vendor/firebase-firestore.js',
  './vendor/xlsx.full.min.js',
  './vendor/polices/montserrat-latin.woff2'
];

const ADRESSES = new Set(
  [...FICHIERS_APPLICATION, ...FICHIERS_BIBLIOTHEQUES].map((fichier) => new URL(fichier, self.location).href)
);
const ADRESSE_INDEX = new URL('./index.html', self.location).href;
const DOSSIER = new URL('./', self.location).pathname;

// Fichier demandé au serveur, qui confirme ou renvoie la version du moment
// (jamais une ancienne copie gardée par le navigateur).
function requeteVerifiee(fichier) {
  return new Request(fichier, { cache: 'no-cache' });
}

// Ouverture de l'application : le dossier lui-même ou index.html.
function estLaPageDeLApplication(adresse) {
  return adresse.pathname === DOSSIER || adresse.pathname === DOSSIER + 'index.html';
}

// Pages de test (tests-nombres.html, tests-regles.html) : jamais de copie.
function estUnePageDeTest(adresseTexte) {
  return /\/tests-[^/]*\.html$/.test(new URL(adresseTexte).pathname);
}

async function copierLesFichiers() {
  const application = await caches.open(CACHE_APPLICATION);
  await application.addAll(FICHIERS_APPLICATION.map(requeteVerifiee));

  const bibliotheques = await caches.open(CACHE_BIBLIOTHEQUES);
  const manquantes = [];
  for (const fichier of FICHIERS_BIBLIOTHEQUES) {
    if (!(await bibliotheques.match(fichier))) {
      manquantes.push(requeteVerifiee(fichier));
    }
  }
  await bibliotheques.addAll(manquantes);
}

// Installation : copie des fichiers. La nouvelle version attend ensuite que
// l'utilisateur touche « Mettre à jour » (décision 97) ; la toute première
// installation, elle, prend la main tout de suite (il n'y a pas d'ancienne
// version).
self.addEventListener('install', (evenement) => {
  evenement.waitUntil(copierLesFichiers());
});

// Prise de main : les copies des anciennes versions sont effacées.
self.addEventListener('activate', (evenement) => {
  evenement.waitUntil(
    caches.keys()
      .then((noms) => Promise.all(
        noms
          .filter((nom) => nom.startsWith(PREFIXE_CACHE) &&
            nom !== CACHE_APPLICATION && nom !== CACHE_BIBLIOTHEQUES)
          .map((nom) => caches.delete(nom))
      ))
      .then(() => self.clients.claim())
  );
});

// « Mettre à jour » touché dans l'application (js/mises-a-jour.js).
self.addEventListener('message', (evenement) => {
  if (evenement.data === 'mettre-a-jour') {
    self.skipWaiting();
  }
});

async function repondre(evenement) {
  const requete = evenement.request;
  if (evenement.clientId) {
    const client = await self.clients.get(evenement.clientId);
    if (client && estUnePageDeTest(client.url)) {
      return fetch(requete);
    }
  }
  const cle = requete.mode === 'navigate' ? ADRESSE_INDEX : requete;
  const copie = await (await caches.open(CACHE_APPLICATION)).match(cle) ||
    await (await caches.open(CACHE_BIBLIOTHEQUES)).match(cle);
  return copie || fetch(requete);
}

self.addEventListener('fetch', (evenement) => {
  const requete = evenement.request;
  if (requete.method !== 'GET') {
    return;
  }
  const adresse = new URL(requete.url);
  // Firebase et toute autre adresse : le réseau, sans rien garder.
  if (adresse.origin !== self.location.origin) {
    return;
  }
  const geree = requete.mode === 'navigate'
    ? estLaPageDeLApplication(adresse)
    : ADRESSES.has(adresse.origin + adresse.pathname);
  if (geree) {
    evenement.respondWith(repondre(evenement));
  }
});
