// Les mouvements de stock : documents users/{uid}/movements/{movementId}.
// Champs (CLAUDE.md, section 5) : productId, nomProduit, unite,
// deltaMilliemes, type, motif, auteurUid, dateAppareil, dateServeur.
//
// Règles essentielles (CLAUDE.md, section 6) :
//   - toute variation de quantité passe par un lot unique qui additionne la
//     variation au produit (increment), écrit dernierMouvementId et crée le
//     mouvement ;
//   - la quantité n'est jamais remplacée par une valeur calculée ici ;
//   - l'identifiant du mouvement est créé une seule fois, avant l'envoi ;
//   - un mouvement enregistré n'est jamais modifié ni supprimé.

import {
  Timestamp,
  collection,
  doc,
  getDocFromServer,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  writeBatch
} from '../vendor/firebase-firestore.js';

export const LONGUEUR_MAX_MOTIF = 200;
export const TAILLE_PAGE_HISTORIQUE = 50;

// Annulation d'une opération (décisions 43 et 48) : l'opération inverse porte
// l'identifiant « annulation-{identifiant d'origine} ». Les règles refusant un
// identifiant déjà enregistré, une opération ne peut être annulée qu'une fois.
const PREFIXE_ANNULATION = 'annulation-';
const LONGUEUR_MAX_IDENTIFIANT = 100;   // comme dans firestore.rules

export function idAnnulation(idMouvement) {
  return PREFIXE_ANNULATION + idMouvement;
}

export function estUneAnnulation(idMouvement) {
  return idMouvement.startsWith(PREFIXE_ANNULATION);
}

// Référence courte d'une opération (décisions 90 et 92) : les 8 premiers
// caractères de son identifiant, en majuscules ; « A- » suivi de la référence
// de l'opération annulée pour une annulation. Unique sans compteur, même hors
// ligne, et rien n'est enregistré : la même opération donne toujours la même
// référence. Seule fonction qui la calcule (bon, recherche, export).
export function referenceBon(idMouvement) {
  if (estUneAnnulation(idMouvement)) {
    return 'A-' + referenceBon(idMouvement.slice(PREFIXE_ANNULATION.length));
  }
  return idMouvement.slice(0, 8).toUpperCase();
}

// Vrai si l'identifiant d'annulation reste accepté par les règles (toujours
// le cas pour les identifiants créés par l'application, de 20 caractères).
export function annulationPossiblePourId(idMouvement) {
  return !estUneAnnulation(idMouvement) &&
    idAnnulation(idMouvement).length <= LONGUEUR_MAX_IDENTIFIANT;
}

export const LIBELLES_TYPE = {
  entree: 'Entrée',
  sortie: 'Sortie',
  ajustement: 'Ajustement'
};

function collectionMouvements(db, uid) {
  return collection(db, 'users', uid, 'movements');
}

// Crée un identifiant de mouvement, sans rien envoyer. À appeler une seule
// fois par opération.
export function nouvelIdMouvement(db, uid) {
  return doc(collectionMouvements(db, uid)).id;
}

export function referenceMouvement(db, uid, idMouvement) {
  return doc(collectionMouvements(db, uid), idMouvement);
}

// Contenu d'un mouvement. Le nom et l'unité du produit sont recopiés pour que
// l'historique reste lisible si le produit est renommé ou archivé.
// dateAppareil : heure de l'appareil au moment de l'opération.
// dateServeur : heure attribuée par le serveur à la réception.
export function contenuMouvement(uid, mouvement) {
  return {
    productId: mouvement.idProduit,
    nomProduit: mouvement.nomProduit,
    unite: mouvement.unite,
    deltaMilliemes: mouvement.deltaMilliemes,
    type: mouvement.type,
    motif: mouvement.motif,
    auteurUid: uid,
    dateAppareil: Timestamp.fromDate(mouvement.dateAppareil),
    dateServeur: serverTimestamp()
  };
}

// Enregistre une opération de stock par un lot unique.
// `mouvement` : { idMouvement, idProduit, nomProduit, unite, deltaMilliemes,
//                 type, motif, dateAppareil }
// La promesse ne se termine que lorsque le serveur a répondu : ne pas
// l'attendre pour mettre l'écran à jour, mais traiter son échec.
export function enregistrerMouvement(db, uid, mouvement) {
  const lot = writeBatch(db);
  lot.update(doc(db, 'users', uid, 'products', mouvement.idProduit), {
    quantiteMilliemes: increment(mouvement.deltaMilliemes),
    dernierMouvementId: mouvement.idMouvement,
    updatedAt: serverTimestamp()
  });
  lot.set(
    referenceMouvement(db, uid, mouvement.idMouvement),
    contenuMouvement(uid, mouvement)
  );
  return lot.commit();
}

function versMouvement(document_) {
  const donnees = document_.data();
  return {
    id: document_.id,
    idProduit: donnees.productId,
    nomProduit: donnees.nomProduit,
    unite: donnees.unite,
    deltaMilliemes: donnees.deltaMilliemes,
    type: donnees.type,
    motif: donnees.motif,
    dateAppareil: donnees.dateAppareil ? donnees.dateAppareil.toDate() : null,
    // null tant que le serveur n'a pas confirmé le mouvement.
    dateServeur: donnees.dateServeur ? donnees.dateServeur.toDate() : null,
    enAttente: document_.metadata.hasPendingWrites,
    // Conservé pour demander la page suivante de l'historique.
    document: document_
  };
}

function requeteHistorique(db, uid, ...contraintes) {
  // Tri par heure du serveur : l'heure d'un appareil peut être fausse.
  // Les mouvements pas encore confirmés apparaissent en tête.
  return query(collectionMouvements(db, uid), orderBy('dateServeur', 'desc'), ...contraintes);
}

// Écoute en temps réel les 50 derniers mouvements seulement (économie de
// lectures : CLAUDE.md, section 3).
export function surveillerDerniersMouvements(db, uid, rappel, surErreur) {
  return onSnapshot(
    requeteHistorique(db, uid, limit(TAILLE_PAGE_HISTORIQUE)),
    { includeMetadataChanges: true },
    (instantane) => {
      rappel({
        mouvements: instantane.docs.map(versMouvement),
        depuisCache: instantane.metadata.fromCache
      });
    },
    surErreur
  );
}

// Charge à la demande les 50 mouvements suivants (bouton « Voir plus »).
// Sans Internet, la réponse vient de la mémoire de l'appareil et peut être
// incomplète : `depuisCache` le signale.
export async function chargerMouvementsSuivants(db, uid, dernierDocument) {
  const instantane = await getDocs(
    requeteHistorique(db, uid, startAfter(dernierDocument), limit(TAILLE_PAGE_HISTORIQUE))
  );
  return {
    mouvements: instantane.docs.map(versMouvement),
    depuisCache: instantane.metadata.fromCache
  };
}

// Demande au serveur si un document existe (mouvement ou produit).
// Sert à savoir si une opération refusée était en réalité déjà enregistrée.
export async function documentExisteSurServeur(db, chemin) {
  const instantane = await getDocFromServer(doc(db, ...chemin));
  return instantane.exists();
}
