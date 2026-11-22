// Page de test de js/nombres.js : chaque ligne compare le résultat obtenu au
// résultat attendu. Aucune connexion nécessaire, aucune donnée modifiée.

import {
  analyserPrix,
  analyserQuantite,
  calculerMargeCentimes,
  calculerValeurCentimes,
  calculerValeurTotaleCentimes,
  centimesVersNombre,
  dateVersSerieExcel,
  formaterDate,
  formaterDateHeure,
  formaterHeure,
  formaterMontant,
  formaterQuantite,
  milliemesVersNombre,
  prixPourSaisie,
  quantitePourSaisie
} from './nombres.js';

const refus = (raison) => ({ ok: false, raison });
const accepte = (valeur) => ({ ok: true, valeur });

// Les espaces insécables de l'affichage français sont remplacés par des
// espaces simples avant la comparaison.
function normaliser(valeur) {
  if (typeof valeur === 'bigint') {
    return valeur.toString() + ' (grand entier)';
  }
  if (typeof valeur === 'string') {
    return '« ' + valeur.replace(/[   ]/g, ' ') + ' »';
  }
  if (Object.is(valeur, -0)) {
    return '-0 (zéro négatif)';
  }
  return JSON.stringify(valeur);
}

const ESSAIS = [
  // ----- Quantités saisies -> millièmes -----
  ['Quantité « 2,5 »', () => analyserQuantite('2,5'), accepte(2500)],
  ['Quantité « 2.5 » (point)', () => analyserQuantite('2.5'), accepte(2500)],
  ['Quantité « 1 »', () => analyserQuantite('1'), accepte(1000)],
  ['Quantité « 0 »', () => analyserQuantite('0'), accepte(0)],
  ['Quantité « 0,001 »', () => analyserQuantite('0,001'), accepte(1)],
  ['Quantité « 0,07 »', () => analyserQuantite('0,07'), accepte(70)],
  ['Quantité « 1,005 » (piège d’arrondi)', () => analyserQuantite('1,005'), accepte(1005)],
  ['Quantité « ,5 »', () => analyserQuantite(',5'), accepte(500)],
  ['Quantité « 5, »', () => analyserQuantite('5,'), accepte(5000)],
  ['Quantité « 1 000 » (espace)', () => analyserQuantite('1 000'), accepte(1000000)],
  ['Quantité « 1 000,5 » (espace fine insécable)', () => analyserQuantite('1 000,5'), accepte(1000500)],
  ['Quantité «  12  » (espaces autour)', () => analyserQuantite('  12  '), accepte(12000)],
  ['Quantité « 2,5000 » (zéros de fin)', () => analyserQuantite('2,5000'), accepte(2500)],
  ['Quantité « 1.000 » (lue comme 1, pas mille)', () => analyserQuantite('1.000'), accepte(1000)],
  ['Quantité « 1000000000 » (maximum)', () => analyserQuantite('1000000000'), accepte(1000000000000)],
  ['Quantité « +10 » (mouvement)', () => analyserQuantite('+10', true), accepte(10000)],
  ['Quantité « -2,5 » (mouvement)', () => analyserQuantite('-2,5', true), accepte(-2500)],
  ['Quantité « −3 » (signe moins typographique)', () => analyserQuantite('−3', true), accepte(-3000)],
  ['Quantité « -0 » donne 0', () => analyserQuantite('-0', true), accepte(0)],
  ['Quantité « -0 » sans négatif autorisé', () => analyserQuantite('-0'), accepte(0)],
  ['Quantité « -2,5 » refusée pour un seuil', () => analyserQuantite('-2,5'), refus('negatif')],
  ['Quantité « 2,5555 » refusée', () => analyserQuantite('2,5555'), refus('trop-de-decimales')],
  ['Quantité « 0,0001 » refusée', () => analyserQuantite('0,0001'), refus('trop-de-decimales')],
  ['Quantité « 1000000000,001 » refusée', () => analyserQuantite('1000000000,001'), refus('trop-grand')],
  ['Quantité de 20 chiffres refusée', () => analyserQuantite('12345678901234567890'), refus('trop-grand')],
  ['Quantité vide refusée', () => analyserQuantite(''), refus('vide')],
  ['Quantité « espaces » refusée', () => analyserQuantite('   '), refus('vide')],
  ['Quantité « abc » refusée', () => analyserQuantite('abc'), refus('invalide')],
  ['Quantité « 1,2,3 » refusée', () => analyserQuantite('1,2,3'), refus('invalide')],
  ['Quantité « 1e3 » refusée', () => analyserQuantite('1e3'), refus('invalide')],
  ['Quantité « - » refusée', () => analyserQuantite('-', true), refus('invalide')],
  ['Quantité « , » refusée', () => analyserQuantite(','), refus('invalide')],
  ['Quantité « 12 kg » refusée', () => analyserQuantite('12 kg'), refus('invalide')],
  ['Quantité qui n’est pas du texte refusée', () => analyserQuantite(12), refus('invalide')],

  // ----- Prix saisis -> centimes -----
  ['Prix « 125,50 »', () => analyserPrix('125,50'), accepte(12550)],
  ['Prix « 125,5 »', () => analyserPrix('125,5'), accepte(12550)],
  ['Prix « 125 »', () => analyserPrix('125'), accepte(12500)],
  ['Prix « 0 »', () => analyserPrix('0'), accepte(0)],
  ['Prix « 0,07 »', () => analyserPrix('0,07'), accepte(7)],
  ['Prix « 4,35 » (piège d’arrondi)', () => analyserPrix('4,35'), accepte(435)],
  ['Prix « 19,99 »', () => analyserPrix('19,99'), accepte(1999)],
  ['Prix « 150 000 »', () => analyserPrix('150 000'), accepte(15000000)],
  ['Prix « 10000000000 » (maximum)', () => analyserPrix('10000000000'), accepte(1000000000000)],
  ['Prix « 1,005 » refusé', () => analyserPrix('1,005'), refus('trop-de-decimales')],
  ['Prix « -1 » refusé', () => analyserPrix('-1'), refus('negatif')],
  ['Prix « 10000000000,01 » refusé', () => analyserPrix('10000000000,01'), refus('trop-grand')],

  // ----- Millièmes -> affichage -----
  ['Afficher 2500', () => formaterQuantite(2500), '2,5'],
  ['Afficher 1000', () => formaterQuantite(1000), '1'],
  ['Afficher 0', () => formaterQuantite(0), '0'],
  ['Afficher 1', () => formaterQuantite(1), '0,001'],
  ['Afficher 70', () => formaterQuantite(70), '0,07'],
  ['Afficher -2500', () => formaterQuantite(-2500), '-2,5'],
  ['Afficher 1000500', () => formaterQuantite(1000500), '1 000,5'],
  ['Afficher 1234567890', () => formaterQuantite(1234567890), '1 234 567,89'],

  // ----- Centimes -> affichage -----
  ['Montant 12550 HTG', () => formaterMontant(12550, 'HTG'), '125,50 HTG'],
  ['Montant 7 USD', () => formaterMontant(7, 'USD'), '0,07 USD'],
  ['Montant 0 HTG', () => formaterMontant(0, 'HTG'), '0,00 HTG'],
  ['Montant -12550 HTG', () => formaterMontant(-12550, 'HTG'), '-125,50 HTG'],
  ['Montant 15000000 HTG', () => formaterMontant(15000000, 'HTG'), '150 000,00 HTG'],
  ['Montant très grand (grand entier)', () => formaterMontant(123456789012345678901n, 'HTG'), '1 234 567 890 123 456 789,01 HTG'],

  // ----- Préremplissage des champs -----
  ['Champ quantité 2500', () => quantitePourSaisie(2500), '2,5'],
  ['Champ quantité 1000500', () => quantitePourSaisie(1000500), '1000,5'],
  ['Champ quantité 0', () => quantitePourSaisie(0), '0'],
  ['Champ prix 12550', () => prixPourSaisie(12550), '125,50'],
  ['Champ prix 7', () => prixPourSaisie(7), '0,07'],

  // ----- Aller-retour : afficher puis relire redonne le même entier -----
  ...[0, 1, 70, 999, 1000, 1005, 2500, 123456789, 1000000000000].map((milliemes) => [
    `Aller-retour quantité ${milliemes}`,
    () => analyserQuantite(formaterQuantite(milliemes)),
    accepte(milliemes)
  ]),
  ...[0, 7, 435, 1999, 12550, 1000000000000].map((centimes) => [
    `Aller-retour prix ${centimes}`,
    () => analyserPrix(prixPourSaisie(centimes)),
    accepte(centimes)
  ]),

  // ----- Valeur d'une ligne : Math.round(quantité × prix / 1000) -----
  ['Valeur 2,5 × 125,50', () => calculerValeurCentimes(2500, 12550), 31375n],
  ['Valeur 1 × 125,50', () => calculerValeurCentimes(1000, 12550), 12550n],
  ['Valeur 0 × 125,50', () => calculerValeurCentimes(0, 12550), 0n],
  ['Valeur 0,001 × 125,50 (12,55 arrondi à 13)', () => calculerValeurCentimes(1, 12550), 13n],
  ['Valeur 0,001 × 14,99 (1,499 arrondi à 1)', () => calculerValeurCentimes(1, 1499), 1n],
  ['Valeur 0,001 × 5,00 (0,5 arrondi à 1)', () => calculerValeurCentimes(1, 500), 1n],
  ['Valeur 0,003 × 5,00 (1,5 arrondi à 2)', () => calculerValeurCentimes(3, 500), 2n],
  ['Valeur -2,5 × 125,50 (stock négatif)', () => calculerValeurCentimes(-2500, 12550), -31375n],
  ['Valeur -0,001 × 5,00 (-0,5 arrondi à 0)', () => calculerValeurCentimes(-1, 500), 0n],
  ['Valeur -0,003 × 5,00 (-1,5 arrondi à -1)', () => calculerValeurCentimes(-3, 500), -1n],
  ['Valeur maximale exacte', () => calculerValeurCentimes(1000000000000, 1000000000000), 1000000000000000000000n],

  // ----- Même résultat que la formule de CLAUDE.md sur des cas ordinaires -----
  ...[[2500, 12550], [333, 1000], [1, 500], [-1, 500], [-3, 500], [7, 143], [123456, 98765]].map(
    ([quantite, prix]) => [
      `Identique à Math.round pour ${quantite} × ${prix}`,
      () => calculerValeurCentimes(quantite, prix),
      BigInt(Math.round(quantite * prix / 1000))
    ]
  ),

  // ----- Valeur totale du stock : somme exacte des lignes (décision 45) -----
  ['Total d’un entrepôt vide', () => calculerValeurTotaleCentimes([]), 0n],
  [
    'Total 2,5 × 125,50 + 1 × 125,50',
    () => calculerValeurTotaleCentimes([
      { quantiteMilliemes: 2500, prixAchatCentimes: 12550 },
      { quantiteMilliemes: 1000, prixAchatCentimes: 12550 }
    ]),
    43925n
  ],
  [
    'Total avec un stock négatif (-2,5 × 125,50 compte en négatif)',
    () => calculerValeurTotaleCentimes([
      { quantiteMilliemes: 7000, prixAchatCentimes: 100000 },
      { quantiteMilliemes: -2500, prixAchatCentimes: 12550 }
    ]),
    668625n
  ],
  [
    'Total = somme des lignes arrondies (0,5 + 0,5 donne 1 + 1)',
    () => calculerValeurTotaleCentimes([
      { quantiteMilliemes: 1, prixAchatCentimes: 500 },
      { quantiteMilliemes: 1, prixAchatCentimes: 500 }
    ]),
    2n
  ],
  [
    'Total de deux lignes maximales, exact',
    () => calculerValeurTotaleCentimes([
      { quantiteMilliemes: 1000000000000, prixAchatCentimes: 1000000000000 },
      { quantiteMilliemes: 1000000000000, prixAchatCentimes: 1000000000000 }
    ]),
    2000000000000000000000n
  ],
  [
    'Affichage d’un total négatif',
    () => formaterMontant(calculerValeurTotaleCentimes([
      { quantiteMilliemes: -2500, prixAchatCentimes: 95000 }
    ]), 'HTG'),
    '-2 375,00 HTG'
  ],

  // ----- Marge par unité (phase 8b, décision 82) -----
  ['Marge 150,00 − 125,50', () => calculerMargeCentimes(15000, 12550), 2450],
  ['Marge nulle (même prix)', () => calculerMargeCentimes(12550, 12550), 0],
  ['Marge négative (vente à perte) 100,00 − 125,50', () => calculerMargeCentimes(10000, 12550), -2550],
  ['Marge 0,01 − 0,00', () => calculerMargeCentimes(1, 0), 1],
  ['Marge maximale exacte', () => calculerMargeCentimes(1000000000000, 0), 1000000000000],
  ['Marge minimale exacte', () => calculerMargeCentimes(0, 1000000000000), -1000000000000],
  ['Affichage d’une marge négative', () => formaterMontant(calculerMargeCentimes(10000, 12550), 'HTG'), '-25,50 HTG'],

  // ----- Conversions pour l'export Excel (phase 9, décision 87) -----
  ['Excel : 2500 millièmes donnent 2,5', () => milliemesVersNombre(2500), 2.5],
  ['Excel : 1 millième donne 0,001', () => milliemesVersNombre(1), 0.001],
  ['Excel : 1005 millièmes donnent 1,005', () => milliemesVersNombre(1005), 1.005],
  ['Excel : -2500 millièmes donnent -2,5', () => milliemesVersNombre(-2500), -2.5],
  ['Excel : 0 millième donne 0', () => milliemesVersNombre(0), 0],
  ['Excel : 1 milliard d’unités', () => milliemesVersNombre(1000000000000), 1000000000],
  ['Excel : 12550 centimes donnent 125,5', () => centimesVersNombre(12550), 125.5],
  ['Excel : 7 centimes donnent 0,07', () => centimesVersNombre(7), 0.07],
  ['Excel : 435 centimes donnent 4,35', () => centimesVersNombre(435), 4.35],
  ['Excel : -2550 centimes donnent -25,5', () => centimesVersNombre(-2550), -25.5],
  ['Excel : valeur en grand entier 31375 donne 313,75', () => centimesVersNombre(31375n), 313.75],
  ['Excel : date du 01/01/2026 à 0 h', () => dateVersSerieExcel(new Date(2026, 0, 1, 0, 0, 0)), 46023],
  ['Excel : date du 01/01/2026 à 12 h (demi-journée)', () => dateVersSerieExcel(new Date(2026, 0, 1, 12, 0, 0)), 46023.5],
  [
    'Excel : 07/11/2026 21:23:41 (comme le fichier du propriétaire)',
    () => Math.round(dateVersSerieExcel(new Date(2026, 10, 7, 21, 23, 41)) * 1000000) / 1000000,
    46333.891447
  ],
  ['Excel : 29/02/2028 (année bissextile)', () => dateVersSerieExcel(new Date(2028, 1, 29)), 46812],

  // Date et heure affichées, sur 12 heures avec AM ou PM (décision 93).
  ['Heure : 14:32 donne 2:32 PM', () => formaterHeure(new Date(2026, 10, 7, 14, 32)), '2:32 PM'],
  ['Heure : 9:05 donne 9:05 AM', () => formaterHeure(new Date(2026, 10, 7, 9, 5)), '9:05 AM'],
  ['Heure : minuit 0:05 donne 12:05 AM', () => formaterHeure(new Date(2026, 10, 7, 0, 5)), '12:05 AM'],
  ['Heure : midi donne 12:00 PM', () => formaterHeure(new Date(2026, 10, 7, 12, 0)), '12:00 PM'],
  ['Heure : 12:59 donne 12:59 PM', () => formaterHeure(new Date(2026, 10, 7, 12, 59)), '12:59 PM'],
  ['Heure : 13:00 donne 1:00 PM', () => formaterHeure(new Date(2026, 10, 7, 13, 0)), '1:00 PM'],
  ['Heure : 23:59 donne 11:59 PM', () => formaterHeure(new Date(2026, 10, 7, 23, 59)), '11:59 PM'],
  ['Heure : 11:59 donne 11:59 AM', () => formaterHeure(new Date(2026, 10, 7, 11, 59)), '11:59 AM'],
  ['Date : 07/11/2026 avec des zéros', () => formaterDate(new Date(2026, 10, 7, 14, 32)), '07/11/2026'],
  ['Date : 31/12/2026', () => formaterDate(new Date(2026, 11, 31, 23, 59)), '31/12/2026'],
  [
    'Date et heure : 07/11/2026 à 2:32 PM',
    () => formaterDateHeure(new Date(2026, 10, 7, 14, 32)),
    '07/11/2026 à 2:32 PM'
  ],
  [
    'Date et heure : 01/01/2027 à 12:00 AM (minuit)',
    () => formaterDateHeure(new Date(2027, 0, 1, 0, 0)),
    '01/01/2027 à 12:00 AM'
  ]
];

function lancer() {
  const corps = document.getElementById('resultats');
  let reussis = 0;

  for (const [nom, calcul, attendu] of ESSAIS) {
    let obtenu;
    try {
      obtenu = normaliser(calcul());
    } catch (erreur) {
      obtenu = 'erreur : ' + erreur.message;
    }
    const attenduNormalise = normaliser(attendu);
    const reussi = obtenu === attenduNormalise;
    if (reussi) {
      reussis += 1;
    }

    const ligne = document.createElement('tr');
    const celluleNom = document.createElement('td');
    celluleNom.textContent = nom;
    const celluleAttendu = document.createElement('td');
    celluleAttendu.textContent = attenduNormalise;
    const celluleResultat = document.createElement('td');
    celluleResultat.dataset.resultat = reussi ? 'reussi' : 'echec';
    celluleResultat.textContent = (reussi ? '✅ Réussi' : '❌ Échec') + ' — ' + obtenu;
    ligne.append(celluleNom, celluleAttendu, celluleResultat);
    corps.append(ligne);
  }

  const bilan = document.getElementById('bilan');
  bilan.textContent = `${reussis} essais réussis sur ${ESSAIS.length}.`;
  bilan.className = reussis === ESSAIS.length ? 'message-info' : 'message-erreur';
  bilan.hidden = false;
}

lancer();
