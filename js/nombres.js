// Conversion des nombres : LE SEUL endroit où les quantités et les montants
// passent du texte saisi aux nombres entiers stockés, et inversement.
//
// Dans la base (CLAUDE.md, section 5) :
//   - les quantités sont en millièmes : 2,5 kg est stocké 2500 ;
//   - les prix sont en centimes : 125,50 est stocké 12550.
//
// Aucun calcul n'utilise de nombre à virgule : le texte est découpé en
// chiffres, ce qui évite les erreurs d'arrondi (par exemple 1,005 × 1000 qui
// donnerait 1004,999… avec un calcul ordinaire).
//
// Ce fichier est vérifié par la page tests-nombres.html.

export const DECIMALES_QUANTITE = 3;
export const DECIMALES_PRIX = 2;

// Limites de saisie : 1 milliard d'unités, et un prix de 10 milliards.
export const QUANTITE_MAX_MILLIEMES = 1000000000000;
export const PRIX_MAX_CENTIMES = 1000000000000;

const FORMAT_ENTIER = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

// Espaces acceptés comme séparateurs de milliers : espace simple, insécable,
// fine, fine insécable.
const ESPACES = /[\s   ]/g;

// Transforme un texte en nombre entier de « plus petites unités ».
// Renvoie { ok: true, valeur } ou { ok: false, raison }, avec pour raison :
// 'vide', 'invalide', 'trop-de-decimales', 'negatif' ou 'trop-grand'.
function analyserDecimal(texte, nombreDecimales, maximum, negatifAutorise) {
  if (typeof texte !== 'string') {
    return { ok: false, raison: 'invalide' };
  }
  const nettoye = texte.replace(ESPACES, '').replace(/−/g, '-');
  if (nettoye === '') {
    return { ok: false, raison: 'vide' };
  }

  // Signe facultatif, chiffres, puis au plus une virgule ou un point.
  const morceaux = /^([+-]?)(\d*)(?:[.,](\d*))?$/.exec(nettoye);
  if (!morceaux) {
    return { ok: false, raison: 'invalide' };
  }
  const signe = morceaux[1];
  const partieEntiere = morceaux[2];
  let partieDecimale = morceaux[3] || '';
  if (partieEntiere === '' && partieDecimale === '') {
    return { ok: false, raison: 'invalide' };
  }

  // Les zéros de fin ne comptent pas (2,5000 vaut 2,5). Des chiffres non nuls
  // en trop sont refusés : jamais d'arrondi silencieux.
  partieDecimale = partieDecimale.replace(/0+$/, '');
  if (partieDecimale.length > nombreDecimales) {
    return { ok: false, raison: 'trop-de-decimales' };
  }

  const chiffres = (partieEntiere + partieDecimale.padEnd(nombreDecimales, '0')).replace(/^0+/, '');
  // 15 chiffres au plus : au-delà, JavaScript ne représente plus exactement
  // les entiers.
  if (chiffres.length > 15) {
    return { ok: false, raison: 'trop-grand' };
  }
  const absolu = chiffres === '' ? 0 : Number(chiffres);

  if (signe === '-' && absolu !== 0 && !negatifAutorise) {
    return { ok: false, raison: 'negatif' };
  }
  if (absolu > maximum) {
    return { ok: false, raison: 'trop-grand' };
  }
  return { ok: true, valeur: signe === '-' && absolu !== 0 ? -absolu : absolu };
}

// Texte saisi -> millièmes. Par défaut, les valeurs négatives sont refusées
// (seuil d'alerte) ; les passer à true pour un mouvement de stock.
export function analyserQuantite(texte, negatifAutorise = false) {
  return analyserDecimal(texte, DECIMALES_QUANTITE, QUANTITE_MAX_MILLIEMES, negatifAutorise);
}

// Texte saisi -> centimes. Un prix n'est jamais négatif.
export function analyserPrix(texte) {
  return analyserDecimal(texte, DECIMALES_PRIX, PRIX_MAX_CENTIMES, false);
}

// Découpe un entier (nombre ou BigInt) en signe, partie entière et décimales.
function decouper(valeur, nombreDecimales) {
  const entier = BigInt(valeur);
  const negatif = entier < 0n;
  const absolu = negatif ? -entier : entier;
  const diviseur = 10n ** BigInt(nombreDecimales);
  return {
    negatif,
    partieEntiere: absolu / diviseur,
    partieDecimale: String(absolu % diviseur).padStart(nombreDecimales, '0')
  };
}

// Millièmes -> texte à afficher : 2500 donne « 2,5 », 1000500 donne « 1 000,5 ».
export function formaterQuantite(milliemes) {
  const morceaux = decouper(milliemes, DECIMALES_QUANTITE);
  const decimales = morceaux.partieDecimale.replace(/0+$/, '');
  return (morceaux.negatif ? '-' : '') +
    FORMAT_ENTIER.format(morceaux.partieEntiere) +
    (decimales ? ',' + decimales : '');
}

// Centimes -> texte à afficher avec la devise : 12550 donne « 125,50 HTG ».
// Accepte aussi un BigInt (valeur totale du stock).
export function formaterMontant(centimes, devise) {
  const morceaux = decouper(centimes, DECIMALES_PRIX);
  return (morceaux.negatif ? '-' : '') +
    FORMAT_ENTIER.format(morceaux.partieEntiere) + ',' + morceaux.partieDecimale +
    (devise ? ' ' + devise : '');
}

// Millièmes -> texte pour préremplir un champ de saisie (sans espaces).
export function quantitePourSaisie(milliemes) {
  const morceaux = decouper(milliemes, DECIMALES_QUANTITE);
  const decimales = morceaux.partieDecimale.replace(/0+$/, '');
  return (morceaux.negatif ? '-' : '') + String(morceaux.partieEntiere) +
    (decimales ? ',' + decimales : '');
}

// Centimes -> texte pour préremplir un champ de saisie : 12550 donne « 125,50 ».
export function prixPourSaisie(centimes) {
  const morceaux = decouper(centimes, DECIMALES_PRIX);
  return (morceaux.negatif ? '-' : '') + String(morceaux.partieEntiere) + ',' + morceaux.partieDecimale;
}

// Valeur d'une ligne de stock, en centimes :
//   Math.round(quantiteMilliemes × prixAchatCentimes / 1000)
// Le calcul est fait en BigInt pour rester exact même avec de très grands
// nombres. Le résultat est un BigInt, arrondi comme Math.round (la moitié
// vers le haut).
export function calculerValeurCentimes(quantiteMilliemes, prixAchatCentimes) {
  const produit = BigInt(quantiteMilliemes) * BigInt(prixAchatCentimes);
  const numerateur = produit * 2n + 1000n;
  const denominateur = 2000n;
  let quotient = numerateur / denominateur;
  // La division des BigInt tronque vers zéro : corriger pour les négatifs.
  if (numerateur % denominateur < 0n) {
    quotient -= 1n;
  }
  return quotient;
}

// Valeur totale du stock, en centimes (BigInt) : somme exacte des valeurs de
// chaque ligne, chacune arrondie comme ci-dessus. Le total est donc toujours
// égal à la somme des lignes affichées. Un stock négatif compte avec sa
// valeur négative (décision 45).
// `lignes` : tableau d'objets { quantiteMilliemes, prixAchatCentimes }.
export function calculerValeurTotaleCentimes(lignes) {
  let total = 0n;
  for (const ligne of lignes) {
    total += calculerValeurCentimes(ligne.quantiteMilliemes, ligne.prixAchatCentimes);
  }
  return total;
}

// ---------- Conversions pour l'export Excel (phase 9, décision 87) ----------

// Millièmes -> nombre décimal : 2500 donne 2,5 (CLAUDE.md, section 5).
export function milliemesVersNombre(milliemes) {
  return milliemes / 1000;
}

// Centimes -> nombre décimal : 12550 donne 125,5. Accepte aussi un BigInt
// (valeur d'une ligne de stock).
export function centimesVersNombre(centimes) {
  return (typeof centimes === 'bigint' ? Number(centimes) : centimes) / 100;
}

// Date -> numéro de série Excel (jours depuis le 30/12/1899), à l'heure
// affichée par l'appareil : Excel affiche la même date et la même heure que
// l'application.
export function dateVersSerieExcel(date) {
  const enUtc = Date.UTC(
    date.getFullYear(), date.getMonth(), date.getDate(),
    date.getHours(), date.getMinutes(), date.getSeconds()
  );
  return (enUtc - Date.UTC(1899, 11, 30)) / 86400000;
}

// ---------- Date et heure affichées (décision 93) ----------
// Écrites ici plutôt que par les formats du navigateur : le résultat est le
// même sur tous les téléphones et navigateurs. Heure de l'appareil.

function deuxChiffres(nombre) {
  return String(nombre).padStart(2, '0');
}

// « 07/11/2026 »
export function formaterDate(date) {
  return `${deuxChiffres(date.getDate())}/${deuxChiffres(date.getMonth() + 1)}/${date.getFullYear()}`;
}

// Sur 12 heures, avec AM ou PM : « 2:32 PM », « 12:05 AM » (minuit),
// « 12:00 PM » (midi).
export function formaterHeure(date) {
  const heures = date.getHours();
  const sur12 = heures % 12 === 0 ? 12 : heures % 12;
  return `${sur12}:${deuxChiffres(date.getMinutes())} ${heures < 12 ? 'AM' : 'PM'}`;
}

// « 07/11/2026 à 2:32 PM »
export function formaterDateHeure(date) {
  return `${formaterDate(date)} à ${formaterHeure(date)}`;
}

// Marge par unité, en centimes (décision 82) : prix de vente moins prix
// d'achat ; négative si le produit est vendu à perte. Les deux prix sont des
// entiers d'au plus 10^12 : la soustraction reste exacte.
export function calculerMargeCentimes(prixVenteCentimes, prixAchatCentimes) {
  return prixVenteCentimes - prixAchatCentimes;
}

// Message d'erreur en français pour un résultat d'analyse refusé.
// `sujet` complète la phrase, par exemple « Le seuil d'alerte ».
export function messageNombreRefuse(resultat, sujet, nombreDecimales) {
  switch (resultat.raison) {
    case 'vide':
      return `${sujet} : saisissez un nombre.`;
    case 'trop-de-decimales':
      return `${sujet} : ${nombreDecimales} chiffres au plus après la virgule.`;
    case 'negatif':
      return `${sujet} : la valeur ne peut pas être négative.`;
    case 'trop-grand':
      return `${sujet} : ce nombre est trop grand.`;
    default:
      return `${sujet} : nombre non reconnu. Exemple : 2,5`;
  }
}
