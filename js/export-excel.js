// Export Excel (phase 9, décisions 85 à 88) : un fichier stock_AAAA-MM-JJ.xlsx
// avec les feuilles Stock, Historique, Fournisseurs et Clients.
//
// L'export est TOUJOURS complet (produits archivés et tout l'historique) :
// c'est la seule sauvegarde (décision 2). Chaque feuille porte les boutons de
// filtre d'Excel sur sa ligne de titres : on filtre dans Excel, pas ici.
//
// Ce fichier ne fait que LIRE les données : il n'écrit rien dans la base.
// SheetJS (vendor/xlsx.full.min.js, 930 Ko) n'est chargé qu'au premier
// export, pas à l'ouverture de l'application.

import { collection, getDocs } from '../vendor/firebase-firestore.js';
import { afficherMessage, element } from './interface.js';
import { messageErreur } from './messages-erreur.js';
import { LIBELLES_TYPE, idAnnulation, referenceBon } from './mouvements.js';
import {
  calculerMargeCentimes,
  calculerValeurCentimes,
  centimesVersNombre,
  dateVersSerieExcel,
  milliemesVersNombre
} from './nombres.js';
import { libelleTypeStock } from './produits.js';

const CHEMIN_SHEETJS = './vendor/xlsx.full.min.js';

// Formats Excel : Excel les affiche avec les séparateurs de la langue de
// l'appareil (1 234,50 en français).
const FORMAT_MONTANT = '#,##0.00';
const FORMAT_DATE = 'dd/mm/yyyy hh:mm';

const COMPARATEUR = new Intl.Collator('fr', { sensitivity: 'base', numeric: true });
const FORMAT_ENTIER = new Intl.NumberFormat('fr-FR');

let contexte = null;      // { db, uid, entrepot }
let exportEnCours = false;
let chargementSheetJS = null;

// ---------- Bibliothèque Excel ----------

// Charge SheetJS une seule fois. En cas d'échec (pas d'Internet et fichier
// absent de la mémoire du navigateur), un nouvel essai reste possible.
function chargerSheetJS() {
  if (window.XLSX) {
    return Promise.resolve(window.XLSX);
  }
  if (!chargementSheetJS) {
    chargementSheetJS = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = CHEMIN_SHEETJS;
      script.onload = () => {
        if (window.XLSX) {
          resolve(window.XLSX);
        } else {
          chargementSheetJS = null;
          reject(new Error('SheetJS absent après chargement'));
        }
      };
      script.onerror = () => {
        chargementSheetJS = null;
        script.remove();
        reject(new Error('SheetJS non chargé'));
      };
      document.head.append(script);
    });
  }
  return chargementSheetJS;
}

// ---------- Lecture des données ----------

// Lit les quatre collections du compte. Avec Internet, la réponse vient du
// serveur ; sans réponse, de la copie gardée sur l'appareil (`depuisCache`).
// `enAttente` : une modification faite ici n'est pas encore confirmée.
export async function lireDonneesExport(db, uid) {
  const noms = ['products', 'movements', 'suppliers', 'clients'];
  const instantanes = await Promise.all(noms.map((nom) => getDocs(collection(db, 'users', uid, nom))));
  const versObjets = (instantane) => instantane.docs.map((document_) => ({
    id: document_.id,
    ...document_.data(),
    enAttente: document_.metadata.hasPendingWrites
  }));
  const [produits, mouvements, fournisseurs, clients] = instantanes.map(versObjets);
  return {
    produits,
    mouvements,
    fournisseurs,
    clients,
    depuisCache: instantanes.some((instantane) => instantane.metadata.fromCache),
    enAttente: instantanes.some((instantane) => instantane.metadata.hasPendingWrites)
  };
}

// ---------- Contenu des feuilles (décision 87) ----------

const parNom = (a, b) => COMPARATEUR.compare(a.nom || '', b.nom || '');
const texteOuVide = (texte) => (typeof texte === 'string' && texte !== '' ? texte : null);
const enDate = (valeur) => (valeur && typeof valeur.toDate === 'function' ? valeur.toDate() : null);

// Mêmes seuils que les alertes de l'écran des produits (décision 46).
function alerte(produit) {
  if (produit.quantiteMilliemes <= 0) {
    return 'Rupture';
  }
  if (produit.quantiteMilliemes <= produit.seuilAlerteMilliemes) {
    return 'Stock bas';
  }
  return null;
}

function feuilleStock(produits, devise) {
  const colonnes = [
    { titre: 'Nom', largeur: 32 },
    { titre: 'Code SKU', largeur: 16 },
    { titre: 'Type de stock', largeur: 26 },
    { titre: 'Unité', largeur: 10 },
    { titre: 'Quantité', largeur: 12 },
    { titre: 'Seuil d’alerte', largeur: 14 },
    { titre: 'Alerte', largeur: 11 },
    { titre: 'Quantité à commander', largeur: 20 },
    { titre: `Prix d’achat (${devise})`, largeur: 18, format: FORMAT_MONTANT },
    { titre: `Prix de vente (${devise})`, largeur: 18, format: FORMAT_MONTANT },
    { titre: `Marge par unité (${devise})`, largeur: 22, format: FORMAT_MONTANT },
    { titre: `Valeur indicative (${devise})`, largeur: 22, format: FORMAT_MONTANT },
    { titre: 'Archivé', largeur: 10 }
  ];
  const actifs = produits.filter((produit) => produit.archive !== true).sort(parNom);
  const archives = produits.filter((produit) => produit.archive === true).sort(parNom);
  const lignes = [...actifs, ...archives].map((produit) => {
    const avecPrixDeVente = Number.isInteger(produit.prixVenteCentimes);
    const avecACommander = Number.isInteger(produit.quantiteACommanderMilliemes) &&
      produit.quantiteACommanderMilliemes > 0;
    return [
      produit.nom,
      texteOuVide(produit.codeSku),
      libelleTypeStock(produit.typeStock),
      produit.unite,
      milliemesVersNombre(produit.quantiteMilliemes),
      milliemesVersNombre(produit.seuilAlerteMilliemes),
      alerte(produit),
      avecACommander ? milliemesVersNombre(produit.quantiteACommanderMilliemes) : null,
      centimesVersNombre(produit.prixAchatCentimes),
      avecPrixDeVente ? centimesVersNombre(produit.prixVenteCentimes) : null,
      avecPrixDeVente
        ? centimesVersNombre(calculerMargeCentimes(produit.prixVenteCentimes, produit.prixAchatCentimes))
        : null,
      centimesVersNombre(calculerValeurCentimes(produit.quantiteMilliemes, produit.prixAchatCentimes)),
      produit.archive === true ? 'Oui' : 'Non'
    ];
  });
  return { nom: 'Stock', colonnes, lignes };
}

// Du plus récent au plus ancien, selon l'heure du serveur ; les opérations
// pas encore confirmées (sans heure du serveur) en tête, comme à l'écran.
function trierMouvements(mouvements) {
  const temps = (date) => (date ? date.getTime() : 0);
  return mouvements.slice().sort((a, b) => {
    const serveurA = enDate(a.dateServeur);
    const serveurB = enDate(b.dateServeur);
    if (!serveurA || !serveurB) {
      if (!serveurA && !serveurB) {
        return temps(enDate(b.dateAppareil)) - temps(enDate(a.dateAppareil));
      }
      return serveurA ? 1 : -1;
    }
    return serveurB - serveurA;
  });
}

function feuilleHistorique(mouvements, produits) {
  const colonnes = [
    { titre: 'Fait le', largeur: 17, format: FORMAT_DATE },
    { titre: 'Reçu par le serveur le', largeur: 21, format: FORMAT_DATE },
    // Référence imprimée sur le bon de l'opération (décision 92).
    { titre: 'Référence', largeur: 13 },
    { titre: 'Produit', largeur: 32 },
    { titre: 'Code SKU', largeur: 16 },
    { titre: 'Type', largeur: 12 },
    { titre: 'Quantité', largeur: 11 },
    { titre: 'Unité', largeur: 10 },
    { titre: 'Motif', largeur: 40 },
    { titre: 'Statut', largeur: 18 }
  ];
  const produitsParId = new Map(produits.map((produit) => [produit.id, produit]));
  const ids = new Set(mouvements.map((mouvement) => mouvement.id));
  const lignes = trierMouvements(mouvements).map((mouvement) => {
    const dateAppareil = enDate(mouvement.dateAppareil);
    const dateServeur = enDate(mouvement.dateServeur);
    const produit = produitsParId.get(mouvement.productId);
    let statut = 'Terminé';
    if (mouvement.enAttente || !dateServeur) {
      statut = 'En attente d’envoi';
    } else if (ids.has(idAnnulation(mouvement.id))) {
      statut = 'Annulé';
    }
    return [
      dateAppareil ? dateVersSerieExcel(dateAppareil) : null,
      dateServeur ? dateVersSerieExcel(dateServeur) : null,
      referenceBon(mouvement.id),
      mouvement.nomProduit,
      produit ? texteOuVide(produit.codeSku) : null,
      LIBELLES_TYPE[mouvement.type] || mouvement.type,
      milliemesVersNombre(mouvement.deltaMilliemes),
      mouvement.unite,
      texteOuVide(mouvement.motif),
      statut
    ];
  });
  return { nom: 'Historique', colonnes, lignes };
}

function feuilleCarnet(nom, fiches, avecProduitsFournis) {
  const colonnes = [
    { titre: 'Nom', largeur: 28 },
    { titre: 'Téléphone', largeur: 17 },
    { titre: 'WhatsApp', largeur: 17 },
    { titre: 'E-mail', largeur: 28 },
    { titre: 'Adresse', largeur: 32 },
    ...(avecProduitsFournis ? [{ titre: 'Produits fournis', largeur: 32 }] : []),
    { titre: 'Notes', largeur: 40 }
  ];
  const lignes = fiches.slice().sort(parNom).map((fiche) => [
    fiche.nom,
    texteOuVide(fiche.telephone),
    texteOuVide(fiche.whatsapp),
    texteOuVide(fiche.email),
    texteOuVide(fiche.adresse),
    ...(avecProduitsFournis ? [texteOuVide(fiche.produitsFournis)] : []),
    texteOuVide(fiche.notes)
  ]);
  return { nom, colonnes, lignes };
}

// Une feuille SheetJS : titres, lignes, formats, largeurs, boutons de filtre.
function versFeuilleExcel(XLSX, feuille) {
  const titres = feuille.colonnes.map((colonne) => colonne.titre);
  const page = XLSX.utils.aoa_to_sheet([titres, ...feuille.lignes]);
  feuille.colonnes.forEach((colonne, numeroColonne) => {
    if (!colonne.format) {
      return;
    }
    for (let numeroLigne = 1; numeroLigne <= feuille.lignes.length; numeroLigne += 1) {
      const cellule = page[XLSX.utils.encode_cell({ r: numeroLigne, c: numeroColonne })];
      if (cellule && cellule.t === 'n') {
        cellule.z = colonne.format;
      }
    }
  });
  page['!cols'] = feuille.colonnes.map((colonne) => ({ wch: colonne.largeur }));
  page['!autofilter'] = { ref: page['!ref'] };
  return page;
}

// Construit le classeur complet, sans rien enregistrer ni télécharger.
export function construireClasseur(XLSX, donnees, devise) {
  const classeur = XLSX.utils.book_new();
  const feuilles = [
    feuilleStock(donnees.produits, devise),
    feuilleHistorique(donnees.mouvements, donnees.produits),
    feuilleCarnet('Fournisseurs', donnees.fournisseurs, true),
    feuilleCarnet('Clients', donnees.clients, false)
  ];
  for (const feuille of feuilles) {
    XLSX.utils.book_append_sheet(classeur, versFeuilleExcel(XLSX, feuille), feuille.nom);
  }
  return classeur;
}

// « stock_2026-11-21.xlsx », avec la date de l'appareil.
export function nomDuFichier(date = new Date()) {
  const deux = (nombre) => String(nombre).padStart(2, '0');
  return `stock_${date.getFullYear()}-${deux(date.getMonth() + 1)}-${deux(date.getDate())}.xlsx`;
}

// ---------- Bouton « Exporter » ----------

const BOUTONS = [
  { bouton: 'bouton-exporter', erreur: 'erreur-export', info: 'info-export' },
  { bouton: 'bouton-exporter-suppression', erreur: 'erreur-export-suppression', info: 'info-export-suppression' }
];

function pluriel(nombre, singulier, plurielTexte) {
  return `${FORMAT_ENTIER.format(nombre)} ${nombre >= 2 ? plurielTexte : singulier}`;
}

async function exporter(zone) {
  if (!contexte || exportEnCours) {
    return;
  }
  const { db, uid, entrepot } = contexte;
  for (const autre of BOUTONS) {
    element(autre.erreur).hidden = true;
    element(autre.info).hidden = true;
  }
  exportEnCours = true;
  for (const autre of BOUTONS) {
    element(autre.bouton).disabled = true;
  }
  afficherMessage(zone.info, 'Préparation du fichier… Avec beaucoup de mouvements, cela peut prendre quelques secondes.');

  try {
    let XLSX;
    let donnees;
    try {
      [XLSX, donnees] = await Promise.all([chargerSheetJS(), lireDonneesExport(db, uid)]);
    } catch (erreur) {
      console.error(erreur);
      element(zone.info).hidden = true;
      afficherMessage(
        zone.erreur,
        erreur && erreur.message && erreur.message.startsWith('SheetJS')
          ? 'La bibliothèque Excel n’a pas pu être chargée. Vérifiez la connexion Internet, puis réessayez.'
          : 'Impossible de lire vos données pour l’export. ' + messageErreur(erreur)
      );
      return;
    }

    // Sans réponse du serveur : le fichier ne contiendrait que la copie gardée
    // sur cet appareil (décision 88).
    if (donnees.depuisCache) {
      const continuer = window.confirm(
        'Pas de connexion au serveur.\n\n' +
        'Le fichier sera créé avec la copie des données gardée sur cet appareil. ' +
        'Il peut être incomplet : modifications faites sur d’autres appareils, ' +
        'historique ancien jamais affiché ici.\n\n' +
        'Créer le fichier quand même ?'
      );
      if (!continuer) {
        element(zone.info).hidden = true;
        afficherMessage(zone.erreur, 'Export annulé. Réessayez quand Internet sera revenu.');
        return;
      }
    }

    const nom = nomDuFichier();
    XLSX.writeFile(construireClasseur(XLSX, donnees, entrepot.devise), nom, { compression: true });

    let texte = `Fichier « ${nom} » créé : ` +
      `${pluriel(donnees.produits.length, 'produit', 'produits')}, ` +
      `${pluriel(donnees.mouvements.length, 'mouvement', 'mouvements')}, ` +
      `${pluriel(donnees.fournisseurs.length, 'fournisseur', 'fournisseurs')}, ` +
      `${pluriel(donnees.clients.length, 'client', 'clients')}. ` +
      'Sur un téléphone, il se trouve dans « Téléchargements ». ' +
      'C’est votre seule sauvegarde : gardez-en une copie ailleurs (e-mail, Google Drive, ordinateur).';
    if (donnees.depuisCache) {
      texte += ' Attention : fait sans Internet, il peut être incomplet.';
    }
    if (donnees.enAttente) {
      texte += ' Des modifications faites sur cet appareil n’étaient pas encore confirmées par le serveur : ' +
        'elles sont dans le fichier (les mouvements ont le statut « En attente d’envoi »).';
    }
    afficherMessage(zone.info, texte);
  } catch (erreur) {
    console.error(erreur);
    element(zone.info).hidden = true;
    afficherMessage(zone.erreur, 'Le fichier Excel n’a pas pu être créé. Réessayez. ' + messageErreur(erreur));
  } finally {
    exportEnCours = false;
    for (const autre of BOUTONS) {
      element(autre.bouton).disabled = false;
    }
  }
}

// À appeler une seule fois, au démarrage de l'application.
export function brancherExport() {
  for (const zone of BOUTONS) {
    element(zone.bouton).addEventListener('click', () => exporter(zone));
  }
}

// À appeler quand l'entrepôt du compte connecté est connu (ou a changé :
// la devise sert aux titres des colonnes de prix).
export function demarrerExport(db, uid, entrepot) {
  contexte = { db, uid, entrepot };
}

// À appeler à la déconnexion.
export function arreterExport() {
  contexte = null;
  for (const zone of BOUTONS) {
    element(zone.erreur).hidden = true;
    element(zone.info).hidden = true;
  }
}
