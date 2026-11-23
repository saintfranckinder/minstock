// Démarrage de Firebase : application, comptes (Authentication) et base de
// données (Firestore) avec la mémoire hors ligne.
//
// Les fichiers du SDK viennent du dossier /vendor (copie locale, version fixe),
// jamais d'Internet : voir vendor/LISEZMOI.md.

import { initializeApp } from '../vendor/firebase-app.js';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  indexedDBLocalPersistence,
  initializeAuth
} from '../vendor/firebase-auth.js';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from '../vendor/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

export const VERSION_SDK_FIREBASE = '13.4.0';

// Vérifie que le navigateur accepte d'enregistrer des données sur l'appareil
// (IndexedDB), en écrivant puis en effaçant une petite base de test.
// Firestore en a besoin pour sa mémoire hors ligne.
function testerStockageLocal() {
  return new Promise((resolve) => {
    let termine = false;
    const finir = (resultat) => {
      if (!termine) {
        termine = true;
        resolve(resultat);
      }
    };

    try {
      if (!globalThis.indexedDB) {
        finir(false);
        return;
      }
      const nomBase = 'test-stockage-local';
      const demande = globalThis.indexedDB.open(nomBase, 1);

      demande.onupgradeneeded = () => {
        demande.result.createObjectStore('test');
      };
      demande.onsuccess = () => {
        const base = demande.result;
        try {
          const transaction = base.transaction('test', 'readwrite');
          transaction.objectStore('test').put(1, 'cle');
          transaction.oncomplete = () => {
            base.close();
            globalThis.indexedDB.deleteDatabase(nomBase);
            finir(true);
          };
          transaction.onerror = () => {
            base.close();
            finir(false);
          };
          transaction.onabort = transaction.onerror;
        } catch {
          base.close();
          finir(false);
        }
      };
      demande.onerror = () => finir(false);
      demande.onblocked = () => finir(false);

      // Sécurité : ne jamais bloquer le démarrage si le navigateur ne répond pas.
      setTimeout(() => finir(false), 5000);
    } catch {
      finir(false);
    }
  });
}

// Cherche la base locale créée par Firestore. Elle n'existe que si la mémoire
// hors ligne a réellement démarré, et seulement après une première opération.
// Renvoie true, false, ou null quand le navigateur ne permet pas de le savoir.
async function baseLocaleFirestorePresente() {
  try {
    if (!globalThis.indexedDB || typeof globalThis.indexedDB.databases !== 'function') {
      return null;
    }
    const bases = await globalThis.indexedDB.databases();
    return bases.some((base) =>
      typeof base.name === 'string' &&
      base.name.startsWith('firestore/') &&
      base.name.includes(firebaseConfig.projectId)
    );
  } catch {
    return null;
  }
}

// Vérification du compte au démarrage (décision 99). Avant de retrouver la
// session enregistrée sur l'appareil, Firebase vérifie le compte auprès de
// ses serveurs ; sans réponse, il attend jusqu'à 30 secondes quand le
// téléphone se croit connecté (Wi-Fi sans Internet, réseau très faible).
// Pendant le démarrage seulement, ces demandes-là sont abandonnées après
// 4 secondes : Firebase garde alors la session (comme sans Internet) et la
// vérifie plus tard. Les autres demandes ne sont pas touchées.
const DELAI_VERIFICATION_COMPTE_MS = 4000;
const SERVEURS_DES_COMPTES = ['identitytoolkit.googleapis.com', 'securetoken.googleapis.com'];

// Renvoie la fonction qui remet l'envoi normal.
function limiterLaVerificationDuCompte() {
  const envoiNormal = globalThis.fetch;
  const envoiAuDemarrage = function (entree, options) {
    let serveur = '';
    try {
      serveur = new URL(typeof entree === 'string' ? entree : entree.url).hostname;
    } catch {
      // Adresse illisible : envoi normal.
    }
    if (!SERVEURS_DES_COMPTES.includes(serveur)) {
      return envoiNormal.call(this, entree, options);
    }
    const abandon = new AbortController();
    const minuterie = setTimeout(() => abandon.abort(), DELAI_VERIFICATION_COMPTE_MS);
    return envoiNormal.call(this, entree, { ...options, signal: abandon.signal })
      .finally(() => clearTimeout(minuterie));
  };
  globalThis.fetch = envoiAuDemarrage;
  return () => {
    if (globalThis.fetch === envoiAuDemarrage) {
      globalThis.fetch = envoiNormal;
    }
  };
}

// Démarre Firebase. À appeler une seule fois, avant toute lecture ou écriture.
export async function demarrerFirebase() {
  const stockageLocalDisponible = await testerStockageLocal();

  const app = initializeApp(firebaseConfig);
  // Comptes : comme getAuth(), mais sans préparer la connexion Google au
  // démarrage (décision 99). getAuth() charge des scripts de Google et une
  // page cachée AVANT de retrouver la session enregistrée sur l'appareil, sans
  // limite de temps : avec un réseau qui ne répond pas (mode avion sur
  // certains téléphones, Wi-Fi sans Internet), l'ouverture restait bloquée
  // sur « Chargement… » environ une minute. La connexion Google est préparée
  // seulement sur les écrans qui la proposent (js/auth.js,
  // preparerConnexionGoogle).
  const retablirEnvoiNormal = limiterLaVerificationDuCompte();
  const auth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence]
  });
  // Session retrouvée (ou absence de session connue) : envoi normal.
  auth.authStateReady().finally(retablirEnvoiNormal);

  // La mémoire hors ligne est toujours demandée. Si le navigateur la refuse,
  // Firestore continue sans elle et sans prévenir : c'est pourquoi l'état est
  // vérifié à part, pour pouvoir avertir l'utilisateur.
  const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });

  // À appeler seulement APRÈS une première opération Firestore : avant, la
  // base locale n'existe pas encore et le résultat serait faux.
  // Résultat approximatif, à présenter comme tel :
  //   true  : la mémoire hors ligne semble active ;
  //   false : elle est indisponible (les données ne survivront pas à la
  //           fermeture de l'application).
  async function verifierMemoireHorsLigne() {
    if (!stockageLocalDisponible) {
      return false;
    }
    const presente = await baseLocaleFirestorePresente();
    return presente !== false;
  }

  // `stockageLocalDisponible` est connu dès le démarrage, avant toute
  // opération Firestore.
  return { app, auth, db, stockageLocalDisponible, verifierMemoireHorsLigne };
}
