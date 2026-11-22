# Application de gestion de stock

## 1. Contexte et objectif

- Le propriétaire du projet ne connaît pas la programmation. Explique chaque étape en français simple, sans jargon inutile. Pour toute action manuelle, indique précisément où cliquer et quoi copier.
- Objectif : créer une application de gestion de stock pour **un seul entrepôt par compte utilisateur**. Elle doit être utilisable sur ordinateur et smartphone.
- L'application est destinée à un portfolio et à une petite utilisation réelle. Elle doit être fiable, mais le projet doit rester simple à construire et à maintenir.
- Budget : zéro. Utiliser uniquement des services et outils gratuits, sans activer de forfait payant ni demander une carte bancaire.
- Contexte d'utilisation : Haïti, connexion Internet souvent instable, coupures fréquentes de plus de 30 minutes. Le fonctionnement hors ligne est important.
- Toute l'interface, les messages d'erreur et la documentation destinée au propriétaire doivent être en français.
- Ne pas ajouter de fonctionnalités non demandées.
### Indépendance de l'hébergement

L'application doit être conçue pour pouvoir changer d'hébergeur sans reconstruction majeure.

Principes :
- GitHub reste le dépôt principal du code source.
- Firebase reste indépendant de l'hébergeur et conserve les données.
- Ne pas rendre le fonctionnement de l'application dépendant de GitHub Pages.
- Éviter les chemins de fichiers absolus liés à un domaine particulier.
- Documenter les paramètres de déploiement.
- Prévoir une possibilité de déploiement sur GitHub Pages, Vercel ou un autre hébergeur statique.
- Ne jamais modifier la configuration Firebase ou les données de production sans autorisation.

Toute migration doit être testée sur une version de prévisualisation avant de remplacer l'hébergement utilisé en production.

## 2. Règles de travail pour l'assistant de programmation

1. Avant de coder, lire ce fichier ainsi que `PLAN.md` et `DECISIONS.md` s'ils existent.
2. Le propriétaire est débutant : expliquer les choix et les risques en termes simples.
3. Avancer par petites étapes vérifiables. Ne pas construire toute l'application en une seule fois.
4. Avant une modification importante, expliquer ce qui va changer et attendre l'accord du propriétaire.
5. Ne pas introduire une technologie, une dépendance ou un service payant sans accord explicite.
6. Choisir la solution la plus simple qui répond correctement au besoin. Ne pas ajouter de couches techniques « au cas où ».
7. **En cas de conflit entre la simplicité (règle 6) et la sécurité ou l'intégrité des données (sections 6 et 8), la sécurité et l'intégrité l'emportent.** Signaler le conflit au propriétaire.
8. Ne pas réécrire du code qui fonctionne sans raison liée à l'étape en cours.
9. Ne pas modifier une décision inscrite dans `DECISIONS.md` sans l'accord explicite du propriétaire. Proposer, ne pas appliquer.
10. Si une exigence est impossible, incertaine ou risquée avec les outils gratuits, l'expliquer avant de coder et proposer la solution la plus simple.
11. Après chaque étape, expliquer comment tester le résultat, noter les problèmes connus et faire un commit Git local.
12. Ne jamais publier de code (`git push`) : le propriétaire vérifie les changements et publie lui-même avec GitHub Desktop.

## 3. Technologies retenues

Ne pas changer ces choix sans expliquer les raisons et obtenir l'accord du propriétaire.

- Interface : HTML, CSS et JavaScript en modules ES, sans framework ni étape de compilation dans la première version.
- Base de données : Cloud Firestore, édition Standard, base `(default)`, emplacement `nam5`.
- Comptes : Firebase Authentication avec **deux méthodes**, toutes deux déjà activées dans la console :
  - Connexion avec Google : utiliser `signInWithPopup()`, pas `signInWithRedirect()` (la redirection pose problème sur certains navigateurs pour un site hébergé sur GitHub Pages). Si la fenêtre popup est bloquée, afficher un message clair expliquant quoi faire.
  - Adresse e-mail et mot de passe, avec « Mot de passe oublié » (uniquement pour cette méthode).
  - Avant de coder la connexion, expliquer au propriétaire ce qui se passe quand une même adresse e-mail est utilisée avec les deux méthodes, gérer ce cas avec un message clair, et le tester.
- Offre Firebase : plan Spark gratuit uniquement. Ne jamais activer le plan Blaze.
- SDK Firebase : version fixe et officielle, jamais `latest`. **Copier les fichiers du SDK nécessaires dans `/vendor`**, comme SheetJS, pour que l'application puisse être rouverte hors ligne sans dépendre d'un CDN. Dans chaque fichier du SDK copié, remplacer l'import vers `https://www.gstatic.com/...` par un chemin local, sinon l'application continue d'appeler Internet (décision 11).
- Export Excel : copie locale de SheetJS dans `/vendor`.
- Application installable : PWA avec `manifest.webmanifest`, icônes et service worker.
- Hébergement : GitHub Pages en HTTPS. Le dépôt reste privé jusqu'à la fin de la phase 4b. Il devient public à ce moment, après une recherche de secrets dans les fichiers et tout l'historique Git et une fois les règles Firestore publiées, pour permettre les tests sur smartphone (décision 10). L'audit final de sécurité reste obligatoire avant la publication finale.
- Développement local : petit serveur local sans installation (script PowerShell), car les modules et le service worker ne fonctionnent pas en ouvrant le fichier directement (décision 11).
- Règles Firestore : fournir un fichier `firestore.rules` et expliquer au propriétaire comment le publier dans la console Firebase. Ne pas exiger Firebase CLI pour les tâches courantes.

### Limites à respecter

- Les quotas gratuits ne sont pas illimités (notamment 50 000 lectures et 20 000 écritures par jour pour tout le projet). Expliquer les limites pertinentes et ne jamais promettre une disponibilité ou un stockage illimité.
- La persistance hors ligne sur le Web dépend du navigateur et de sa configuration. Si elle échoue, afficher un avertissement clair.
- Les données déjà consultées peuvent être disponibles hors ligne, mais une première connexion et un premier chargement des données nécessitent Internet.
- Une opération créée hors ligne n'est pas encore confirmée par le serveur.
- Le fonctionnement hors ligne sur plusieurs appareils ne permet pas de garantir toutes les règles métier en temps réel. Ne jamais promettre qu'une sortie ne pourra jamais créer un stock négatif dans tous les scénarios simultanés.
- Le service worker met en cache l'interface. Cela ne garantit pas à lui seul que toutes les fonctions Firebase fonctionneront hors ligne. Tester ce comportement et signaler clairement toute limite.

### Économie des lectures (quota gratuit)

- Quand une écoute en temps réel est déconnectée plus de 30 minutes, Firestore facture de nouveau tous les documents écoutés à la reconnexion. Les coupures longues étant fréquentes, limiter ce que l'application écoute.
- Écouter en temps réel : les produits du compte et **les 50 derniers mouvements seulement**.
- L'historique affiche les 50 derniers mouvements, avec un bouton « Voir plus » qui charge la suite à la demande.
- L'historique complet n'est chargé qu'au moment de l'export.
- Les vérifications des règles de sécurité (`get()`, `getAfter()`, `exists()`) consomment aussi des lectures : les limiter au nécessaire.

## 4. Périmètre fonctionnel de la première version

L'application gère un seul entrepôt par compte utilisateur.

### Écrans et fonctions

1. Connexion (Google ou e-mail et mot de passe), inscription et mot de passe oublié.
2. Premier lancement : nom de l'entrepôt et choix d'une devise.
3. Tableau de bord listant les produits :
   - Nom.
   - Unité.
   - Quantité actuelle.
   - Seuil d'alerte.
   - Prix d'achat unitaire.
   - Valeur totale du stock.
   - Quantité à commander, seulement en « Stock bas » ou « Rupture » (phase 8b, décision 80).
4. Recherche de produits par nom, code SKU ou type de stock (phase 8b, décisions 78 et 79).
5. Actions rapides `-1` et `+1`, avec zones tactiles d'au moins 48 × 48 pixels.
6. Action permettant de saisir une quantité précise, par exemple `+10` ou `-2,5`, avec motif facultatif.
7. Formulaire simple pour ajouter ou modifier un produit. Phase 8b (décisions 78 à 82) : code SKU (champ toujours présent, facultatif à remplir, unique quand il est rempli), type de stock (liste fixe, « Non classé » par défaut), quantité à commander et prix de vente facultatifs ; avertissement si le prix de vente est plus bas que le prix d'achat. La fiche du produit affiche ces informations et la marge par unité.
8. Historique des entrées, sorties et ajustements, avec date, heure, produit, quantité et motif (50 derniers, puis « Voir plus »). Chaque ligne propose « Annuler cette opération » (section 6, règle 12). Recherche par produit, type, motif ou référence du bon (à partir de 4 caractères) dans les mouvements déjà chargés, sans lecture de plus (décisions 84 et 92). Chaque ligne a aussi un bouton « Imprimer » : bon du mouvement (un mouvement = un produit), ouvert dans la fenêtre d'impression du navigateur (imprimante ou PDF), mise en page épurée et symétrique pensée pour le papier ; il ne fait que lire ce qui est déjà chargé (étape 9b, décisions 89 à 91).
9. Export Excel en un clic, avec quatre feuilles : `Stock`, `Historique`, `Fournisseurs` et `Clients` ; toujours complet (produits archivés compris), avec les boutons de filtre d'Excel ; bouton dans Paramètres (bloc « Sauvegarde ») et sur l'écran « Supprimer mon compte » (phase 9, décisions 85 à 88).
10. Données de démonstration, uniquement lorsque l'entrepôt est vide.
11. Indicateur de l'état de connexion et de synchronisation (voir section 7).
12. Paramètres : modifier le nom de l'entrepôt. La devise n'est modifiable que si l'entrepôt ne contient encore aucun produit (changer la devise ne convertit pas les montants).
13. Bouton « Supprimer mon compte et mes données », avec double confirmation (voir section 8).
14. Court texte de confidentialité accessible depuis l'écran de connexion : données collectées (adresse e-mail, nom du compte Google le cas échéant, données de stock, coordonnées des fournisseurs et des clients saisies par l'utilisateur), usage, absence de revente ou de partage, possibilité de supprimer son compte.
15. Carnet de fournisseurs (phase 6b, décisions 42 et 50 à 54) : ajouter, modifier et supprimer un fournisseur, avec nom, téléphone, WhatsApp, e-mail, adresse, produits fournis et notes ; recherche par nom ou par produit fourni ; boutons « Appeler », « WhatsApp » et « E-mail » (une icône avec son nom dessous, décision 77) qui ouvrent l'application correspondante du téléphone. Le carnet est indépendant du stock : il ne crée ni ne modifie aucun mouvement.
16. Carnet de clients (phase 6c, décisions 72 et 73) : même fonctionnement que le carnet de fournisseurs, avec nom, téléphone, WhatsApp, e-mail, adresse et notes (pas de case VIP : « VIP » peut s'écrire dans les notes) ; recherche par nom ou dans les notes. Indépendant du stock ; aucune gestion des ventes.

### Ordre de priorité si le temps manque

1. Sécurité et intégrité des données (connexion, modèle de données, règles).
2. Tableau de bord et mouvements de stock.
3. Fonctionnement hors ligne.
4. Export Excel.
5. Installation sur téléphone (PWA).
6. Carnets de fournisseurs et de clients.
7. Données de démonstration.

### Hors périmètre de la première version

Ne pas développer sans demande explicite :

- Plusieurs entrepôts par compte.
- Transferts entre entrepôts.
- Invitations et gestion d'équipes.
- Codes-barres.
- Importation CSV.
- Multi-devises par produit.
- Méthodes de valorisation avancées (coût moyen pondéré, premier entré premier sorti).
- Comptabilité complète, facturation ou gestion des ventes.
- Notifications complexes.
- Lien entre les mouvements et les fournisseurs (choisir un fournisseur lors d'une entrée) : « niveau 2 », non retenu pour l'instant (décision 42).
- Lien entre les mouvements et les clients, historique d'achats, crédit ou dettes des clients, remises, points de fidélité (décision 73).

## 5. Modèle de données

Chaque compte utilisateur possède un entrepôt unique. Les données d'un compte doivent être isolées de celles des autres.

### Nombres entiers obligatoires

Pour éviter les erreurs d'arrondi des nombres à virgule, **toutes les quantités et tous les montants sont stockés en nombres entiers** :

- Quantités en **millièmes** : 2,5 kg est stocké `2500` ; 1 sac est stocké `1000`.
- Prix en **centimes** : 125,50 HTG est stocké `12550`.
- La conversion vers l'affichage (et depuis la saisie) se fait uniquement dans l'interface, dans une seule fonction utilitaire testée.
- Valeur d'une ligne, en centimes : `Math.round(quantiteMilliemes × prixAchatCentimes / 1000)`.
- Les règles Firestore vérifient que ces champs sont des entiers (`is int`).
- L'export Excel convertit les entiers en nombres décimaux lisibles.

### Structure

- `users/{uid}` : `nomEntrepot`, `devise`, `createdAt`, `suppressionDemandee` (booléen, `false` par défaut).
- `users/{uid}/products/{productId}` : `nom`, `unite`, `quantiteMilliemes`, `seuilAlerteMilliemes`, `prixAchatCentimes`, `archive`, `dernierMouvementId`, `createdAt`, `updatedAt`. Depuis la phase 8b (décisions 78 à 83) : `codeSku`, `typeStock`, `quantiteACommanderMilliemes`, `prixVenteCentimes`. Ces quatre champs sont facultatifs (les produits plus anciens ne les ont pas) ; un code SKU, une quantité à commander ou un prix de vente non rempli est absent du document.
- `users/{uid}/movements/{movementId}` : `productId`, `nomProduit`, `unite`, `deltaMilliemes`, `type`, `motif`, `auteurUid`, `dateAppareil`, `dateServeur`.
- `users/{uid}/suppliers/{supplierId}` (phase 6b, décisions 42 et 50) : `nom`, `telephone`, `whatsapp`, `email`, `adresse`, `produitsFournis`, `notes`, `createdAt`, `updatedAt`. Seul `nom` est obligatoire ; un champ facultatif non rempli vaut une chaîne vide. `produitsFournis` est un texte libre, sans lien avec les produits du stock. Un fournisseur supprimé est effacé définitivement : il n'y a pas d'archivage (décision 50).
- `users/{uid}/clients/{clientId}` (phase 6c, décision 72) : `nom`, `telephone`, `whatsapp`, `email`, `adresse`, `notes`, `createdAt`, `updatedAt`. Seul `nom` est obligatoire ; un champ facultatif non rempli vaut une chaîne vide. Un client supprimé est effacé définitivement.

### Règles

- `deltaMilliemes` positif = entrée ; négatif = sortie. Jamais égal à 0.
- `type` vaut `entree`, `sortie` ou `ajustement`.
- `dernierMouvementId` contient l'identifiant du mouvement qui a modifié la quantité en dernier. Il sert aux règles de sécurité (section 8). Il est vide pour un produit créé avec un stock de 0 et qui n'a encore reçu aucun mouvement (décision 12).
- Valeur du stock : quantité × prix d'achat unitaire **actuel**. Limite à documenter dans le README et à signaler dans l'interface (« valeur indicative ») : modifier un prix d'achat réévalue tout le stock existant de ce produit.
- Une seule devise par entrepôt.
- Afficher les nombres avec `Intl.NumberFormat('fr-FR')` et la devise de l'entrepôt.
- Conserver le nom et l'unité du produit dans le mouvement, afin que l'historique reste compréhensible si le produit est renommé ou archivé.
- Ne pas supprimer les mouvements historiques (seule exception : suppression du compte, section 8).

Ne pas ajouter d'autres champs ou collections sans expliquer leur utilité et obtenir l'accord du propriétaire.

## 6. Règles métier et intégrité du stock

1. Toute modification de quantité crée un mouvement dans l'historique.
2. Une opération de stock est un batch Firestore unique qui : applique `increment(deltaMilliemes)` au produit, écrit `dernierMouvementId` sur le produit, et crée le mouvement.
3. Ne jamais remplacer la quantité par une valeur calculée dans le navigateur : cela pourrait écraser des changements faits sur un autre appareil.
4. Générer l'identifiant du mouvement une seule fois avant l'envoi, et le réutiliser si l'opération est réessayée. Une nouvelle tentative avec un identifiant déjà enregistré est refusée par les règles (les mouvements ne peuvent pas être modifiés) : dans ce cas, ne pas afficher d'erreur alarmante, indiquer que l'opération était déjà enregistrée.
5. Les mouvements sont immuables : pas de modification ni de suppression. Une erreur se corrige par un mouvement d'ajustement.
6. Le stock négatif est signalé clairement. Une application utilisée hors ligne sur plusieurs appareils ne peut pas toujours l'empêcher avant la synchronisation. Ne pas prétendre le contraire.
7. Si une opération est rejetée par le serveur, afficher une explication claire et ne pas la présenter comme confirmée.
8. Le stock initial d'un produit est enregistré par un mouvement d'entrée initial dans le même batch que la création du produit, pas par une modification silencieuse de la quantité.
9. Avant d'écrire les règles de sécurité, expliquer simplement comment elles vérifient qu'un mouvement correspond à la modification de stock associée.
10. Les règles de sécurité ne refusent pas un mouvement à cause d'un état qui a pu changer sur un autre appareil pendant que l'appareil était hors ligne (produit renommé ou archivé). Raison : une écriture hors ligne refusée après la fermeture de l'application disparaît sans message (décision 9).
11. L'appareil garde une liste locale des opérations pas encore confirmées par le serveur. À chaque ouverture, une opération absente du serveur est signalée comme refusée. Cette liste reste sur l'appareil : elle n'ajoute aucun champ ni collection dans Firestore (décision 9).
12. **Annuler une opération faite par erreur (phase 6, décision 43).** Chaque ligne de l'historique propose « Annuler cette opération ». Après confirmation, l'application crée l'opération inverse : un mouvement `ajustement` de valeur opposée, envoyé comme tout autre mouvement (règle 2), dont l'identifiant est `annulation-{identifiant de l'opération d'origine}` et dont le motif décrit l'opération annulée. Un identifiant déjà enregistré étant refusé par les règles, une opération ne peut être annulée qu'une seule fois, même depuis deux appareils. L'opération d'origine reste dans l'historique, marquée « annulée ». Une annulation ne s'annule pas : pour revenir en arrière, refaire l'opération voulue. Aucun mouvement n'est modifié ni supprimé (règle 5).

## 7. Dates et synchronisation

Chaque mouvement conserve :

- `dateAppareil` : heure locale indiquée par l'appareil au moment de l'opération.
- `dateServeur` : heure attribuée par le serveur lorsque l'opération est reçue.

L'interface ne doit pas confondre l'heure de réalisation et l'heure de synchronisation.

Affichage (décision 93) : partout, heure sur 12 heures avec AM ou PM, date et heure écrites « 21/11/2026 à 2:32 PM » par une seule fonction de `js/nombres.js` (`formaterDateHeure`) ; dans l'export Excel, format `dd/mm/yyyy h:mm AM/PM`.

### Indicateur de synchronisation (approximatif, assumé comme tel)

Firestore pour le Web ne fournit pas d'indicateur fiable de connexion au serveur, et le navigateur peut se croire en ligne sur un Wi-Fi sans Internet. Construire un indicateur simple, sans mécanisme de détection complexe :

- `Synchronisé` : aucune écriture locale en attente et données récentes reçues du serveur (`hasPendingWrites` faux et `fromCache` faux).
- `En attente de synchronisation` : des écritures locales attendent leur confirmation (`hasPendingWrites` vrai).
- `Hors ligne` : le navigateur signale l'absence de réseau (`navigator.onLine` faux), ou les données viennent uniquement du cache.
- `Erreur de synchronisation` : une opération a été rejetée.

Ne pas afficher un nombre exact de modifications en attente. Ne pas attribuer à ces métadonnées une signification qu'elles n'ont pas. Expliquer cette limite au propriétaire.

## 8. Sécurité minimale obligatoire

### Accès

- Un utilisateur ne peut lire et écrire que dans `users/{son uid}`.
- Tout accès non autorisé est refusé par défaut.
- Valider dans les règles les types, les champs autorisés, les longueurs des textes (nom 100 caractères, unité 30, motif 200) et les valeurs numériques (entiers, `deltaMilliemes` différent de 0). Fournisseurs (décision 54) : nom 1 à 100 caractères ; téléphone et WhatsApp 30 caractères au plus, seulement des chiffres, des espaces et `+ - ( ) .` ; e-mail 254 caractères au plus, vide ou de la forme `x@y` ; adresse 200 ; produits fournis 500 ; notes 1 000. Clients (décision 72) : mêmes limites, sans « produits fournis ». Produits, phase 8b (décision 83) : quand ils sont présents, code SKU de 1 à 50 caractères (`A-Z a-z 0-9 -`), type de stock dans la liste fixe, quantité à commander et prix de vente entiers positifs ou nuls ; un produit sans ces champs reste accepté.

### Lien entre produit et mouvement

Principe à appliquer, puis à vérifier avec la page de test `tests-regles.html` (décision 8) :

- Création d'un mouvement : `auteurUid` égal à l'utilisateur connecté ; le produit indiqué appartient au même utilisateur ; après le batch (`getAfter()`), le produit a `dernierMouvementId` égal à l'identifiant de ce mouvement, et sa quantité a augmenté exactement de `deltaMilliemes` par rapport à avant (`get()`).
- Modification de la quantité d'un produit : refusée si `dernierMouvementId` ne change pas, ou si le mouvement correspondant n'existe pas après le batch (`getAfter()`) avec le même `deltaMilliemes`, ou si ce mouvement existait déjà avant le batch (`exists()`).
- Création d'un produit : cas traité à part, car le produit n'existe pas avant le batch. Avec un stock initial, la quantité du produit est égale au `deltaMilliemes` du mouvement d'entrée créé dans le même batch. Avec un stock de 0, aucun mouvement n'est créé et `dernierMouvementId` est vide (décision 12).
- Si une partie de ce principe s'avère impossible ou non testable avec les règles Firestore, le dire avant de coder et proposer l'alternative la plus sûre.

### Mouvements

- Modification interdite.
- Suppression interdite, sauf si `users/{uid}.suppressionDemandee` vaut `true` (suppression du compte uniquement).

### Suppression du compte

1. Double confirmation à l'écran, avec rappel d'exporter les données avant.
2. Demander à l'utilisateur de se reconnecter avant de supprimer quoi que ce soit. La suppression n'est possible qu'en ligne (décision 13).
3. Écrire `suppressionDemandee: true` sur `users/{uid}`. Une suppression demandée ne s'annule pas.
4. Supprimer les mouvements, les produits, les fournisseurs, les clients, puis le document `users/{uid}`. Si la suppression est interrompue, elle reprend automatiquement à la connexion suivante tant que `suppressionDemandee` est vrai.
5. Supprimer le compte Firebase Authentication. Si Firebase exige malgré tout une connexion récente, demander à l'utilisateur de se reconnecter, puis réessayer.
6. Tester ce parcours avec un compte de test, jamais avec le compte du propriétaire.

### Divers

- Ne jamais placer de mot de passe, clé privée ou secret dans le code publié.
- La configuration web Firebase (`firebaseConfig`) est utilisée côté client et n'est pas un mot de passe. La protection repose sur Authentication et les règles Firestore.
- Afficher les textes saisis comme du texte (`textContent`), jamais comme du HTML non fiable.
- Ne pas ajouter App Check, la restriction de la clé API ou d'autres protections avancées à la première version. Les envisager seulement après que l'application de base fonctionne, lors de l'audit de sécurité, en expliquant leur utilité et leurs risques.

## 9. Mode hors ligne et PWA

- Activer la persistance locale Firestore lorsque le navigateur le permet, avant toute lecture ou écriture.
- Gérer le cas où cette activation échoue et avertir l'utilisateur.
- Mettre en cache les fichiers nécessaires à l'interface : HTML, CSS, JavaScript, icônes, SDK Firebase et bibliothèque Excel locale (`/vendor`).
- Ne pas supposer que le cache de l'interface rend automatiquement Firebase disponible hors ligne.
- Vérifier que l'application peut être rouverte après une première visite en ligne, en mode avion.
- Vérifier les limites de la persistance selon le navigateur et les onglets.
- Ne pas supprimer automatiquement les données locales ou les mouvements en attente.
- Prévoir un indicateur compréhensible de l'état de synchronisation (section 7).

## 10. Export et sauvegarde

- Le bouton principal est `Exporter le stock (Excel)`.
- Générer le fichier dans le navigateur, sans service externe payant.
- Le fichier contient les feuilles `Stock` (avec le code SKU, le type de stock, la quantité à commander et le prix de vente, phase 8b), `Historique` (historique complet, chargé au moment de l'export, avec la référence du bon de chaque opération, décision 92), `Fournisseurs` (décision 42) et `Clients` (décision 72), avec les quantités et montants convertis en nombres décimaux.
- Nom du fichier : `stock_AAAA-MM-JJ.xlsx`.
- Si l'appareil est hors ligne ou si des mouvements sont encore en attente, avertir l'utilisateur que l'export peut ne pas contenir les données non synchronisées d'autres appareils, et que l'historique peut être incomplet s'il n'a pas été entièrement chargé.
- L'export est la seule sauvegarde disponible : le plan Spark n'inclut aucune sauvegarde automatique du serveur. Le dire clairement à l'utilisateur.
- Ne jamais présenter le cache Firestore comme une sauvegarde.
- Documenter simplement comment conserver une copie des exports.

## 11. Design et accessibilité

- Mobile d'abord, moderne, sobre et entièrement en français.
- Tester à 360 pixels de largeur et sur ordinateur.
- Contraste lisible, y compris en extérieur.
- Boutons tactiles d'au moins 48 × 48 pixels.
- Libellés explicites pour les champs et focus clavier visible.
- Taille de texte confortable, idéalement 16 pixels pour les champs.
- Les alertes ne reposent pas uniquement sur la couleur : afficher aussi `Stock bas` ou `Rupture`.

Couleurs :

- Orange si `quantiteMilliemes <= seuilAlerteMilliemes`.
- Rouge si `quantiteMilliemes <= 0`.

## 12. Tests simples mais obligatoires

Le propriétaire doit pouvoir suivre les tests avec des instructions en français. Utiliser les outils gratuits déjà disponibles. Ne pas imposer une infrastructure de test complexe.

### Outils

- Règles de sécurité : utiliser la page de test `tests-regles.html` de l'application avec un compte de test, pour toutes les opérations en lot (produit + mouvement). Le simulateur de règles de la console Firestore (onglet Règles) ne teste qu'une écriture à la fois : il sert seulement aux refus simples (décision 8). Prévoir un second compte de test pour vérifier l'isolation des comptes.
- Interface : navigateur de l'ordinateur et smartphone du propriétaire.

### Cas à vérifier avant de déclarer une étape terminée (selon l'étape)

- Connexion avec Google, puis avec e-mail et mot de passe, puis avec la même adresse e-mail par les deux méthodes.
- Ajouter, modifier et archiver un produit.
- Enregistrer une entrée, une sortie et un ajustement, y compris avec des décimales (ex. `-2,5`).
- Vérifier que chaque mouvement modifie exactement la quantité (aucune erreur d'arrondi).
- Vérifier qu'un mouvement n'est pas dupliqué lors d'une nouvelle tentative.
- Vérifier qu'une modification directe de la quantité sans mouvement est refusée.
- Annuler une opération : le stock revient exactement à sa valeur ; une seconde annulation de la même opération est refusée, y compris depuis un autre appareil.
- Fournisseurs : ajouter, modifier et supprimer ; un compte ne voit pas les fournisseurs d'un autre.
- Clients : ajouter, modifier et supprimer ; un compte ne voit pas les clients d'un autre ; la suppression du compte efface aussi les clients.
- Vérifier les alertes de stock bas et de rupture.
- Phase 8b : code SKU facultatif, unique quand il est rempli ; un produit ancien, sans les nouveaux champs, reste accepté par les règles et s'affiche sans erreur ; avertissement si le prix de vente est plus bas que le prix d'achat ; marge exacte ; recherche par code et par type.
- Exporter le stock et l'historique, et ouvrir le fichier dans Excel.
- Tester sur ordinateur et smartphone.
- Tester une première ouverture en ligne, puis une réouverture hors ligne.
- Tester une modification hors ligne puis le retour en ligne.
- Si possible, tester deux appareils qui modifient le même produit et expliquer le résultat.
- Vérifier qu'un utilisateur ne peut pas accéder aux données d'un autre compte.
- Supprimer un compte de test et vérifier que ses données ont disparu.

Ne pas prétendre qu'un test a réussi s'il n'a pas été exécuté. Noter les tests non effectués et les limites restantes.

## 13. Fichiers de continuité du projet

La mémoire du projet est conservée dans les fichiers, pas seulement dans la conversation. Plusieurs modèles d'IA peuvent travailler successivement sur ce projet.

- `PLAN.md` : étapes, état d'avancement, tests et problèmes connus, notes de passation.
- `DECISIONS.md` : décisions importantes, date et raison.
- `README.md` : présentation, installation, test, publication et limites connues.

Au début de chaque session, lire ces fichiers. À la fin de chaque étape, les mettre à jour.

## 14. Définition d'une étape terminée

Une étape est terminée seulement si :

1. Le résultat attendu existe.
2. Les tests prévus pour cette étape ont été exécutés, ou les tests impossibles sont signalés.
3. Les erreurs connues sont documentées.
4. Le propriétaire reçoit des instructions simples pour vérifier le résultat.
5. `PLAN.md`, `DECISIONS.md` et `README.md` sont mis à jour si nécessaire.
6. Un commit Git local est créé après vérification.

Ne jamais faire de `git push` : le propriétaire publie lui-même avec GitHub Desktop.
