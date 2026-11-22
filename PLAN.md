# Plan du projet

Ce fichier suit l'avancement. `CLAUDE.md` reste le cahier des charges ; `DECISIONS.md` contient les décisions validées.

Dossier de travail : `C:\GitHub\Inventory Management\inventorymanagement` (dépôt cloné par le propriétaire avec GitHub Desktop le 2026-11-16).

Dépôt GitHub : `saintfranckinder/minstock`, renommé par le propriétaire le 2026-11-18 (ancien nom : `inventorymanagement`). Adresse prévue du site : `https://saintfranckinder.github.io/minstock/`. Le dossier de travail garde son nom.

## 1. État d'avancement

| Phase | Travail | État |
|---|---|---|
| 0 | Préparer le dossier (Git, `.gitignore`, `README.md`) | **Terminée le 2026-11-16** |
| 1 | Audit et plan | **Terminée le 2026-11-16** (analyse validée, aucun code écrit) |
| 2 | Structure, Firebase, persistance hors ligne | **Terminée le 2026-11-16** |
| 3 | Connexion, premier lancement, confidentialité | **Faite le 2026-11-16** ; trois tests du propriétaire restent à faire (Google, e-mail de réinitialisation, même adresse) |
| 4a | Produits et conversion des nombres | **Terminée le 2026-11-16** |
| 4b | Mouvements, règles complètes, historique | **Terminée le 2026-11-16** (tests hors ligne et à deux appareils non faits) |
| — | Vérification des secrets, dépôt public, GitHub Pages activé | **Terminée le 2026-11-18** (site en ligne ; premier test sur smartphone réussi selon le propriétaire) |
| 5 | Tableau de bord | **Terminée le 2026-11-18** (test sur smartphone réussi le même jour, selon le propriétaire) |
| 6 | Formulaires, historique lisible (avec « Annuler cette opération »), paramètres | **Terminée le 2026-11-18** (test sur smartphone réussi le même jour, selon le propriétaire) |
| 6b | Carnet de fournisseurs (décisions 42 et 50 à 54) | **Terminée le 2026-11-18** (règles version 6 publiées par le propriétaire ; test sur smartphone réussi le même jour) |
| — | Identité visuelle MinStock (décisions 55 à 58) et compteurs cliquables (décision 59) | **Terminée le 2026-11-18** (validées sur smartphone par le propriétaire) |
| 7 | Suppression du compte (décisions 60 à 63) | **Terminée le 2026-11-18** (règles version 7 publiées par le propriétaire ; test sur smartphone réussi avec un compte jetable) |
| 6c | Carnet de clients (décisions 72 et 73) | **Terminée le 2026-11-20** (règles version 8 publiées par le propriétaire ; test sur smartphone réussi) |
| — | Accueil épuré (décision 74), haut figé et bouton retour (décision 75), partie figée réduite (décision 76) | **Terminé le 2026-11-20** (version 0.15.0 essayée sur smartphone par le propriétaire : réussi) |
| — | Boutons de contact en icônes, avec leur nom dessous (décision 77), puis grille centrée (une colonne égale par bouton) | **Fait le 2026-11-21** (version 0.15.3, tests sur l'ordinateur réussis) ; test de la version 0.15.3 sur smartphone à faire par le propriétaire |
| 8 | Hors ligne et indicateur de synchronisation (décisions 64 à 68) | **Terminée le 2026-11-19** (essai en mode avion réussi sur smartphone, selon les captures du propriétaire) |
| — | Recherche dans l'historique, sur les mouvements déjà chargés (décision 84) | **Terminée le 2026-11-21** (version 0.17.0 ; test sur smartphone réussi le même jour, selon le propriétaire) |
| 8b | Code SKU, type de stock, quantité à commander, prix de vente (décisions 69 et 78 à 83) | **Terminée le 2026-11-21** (version 0.16.0 ; règles version 9 publiées ; `tests-regles.html` 122 sur 122, `tests-nombres.html` 111 sur 111 ; test sur smartphone réussi le même jour, selon le propriétaire) |
| 9 | Export Excel (décisions 85 à 88) | **Terminée le 2026-11-21** (version 0.18.0 ; tests sur l'ordinateur réussis, `tests-nombres.html` 126 sur 126 ; essai sur smartphone réussi le même jour, selon le propriétaire) |
| 9b | Bon imprimable d'un mouvement (décisions 89 à 91) | **Fait le 2026-11-21** (version 0.19.0 ; tests sur l'ordinateur réussis, PDF réels vérifiés) ; essai sur smartphone à faire par le propriétaire |
| 10 | Application installable (PWA) | À faire |
| 11 | Données de démonstration | À faire |
| 12 | Audit final de sécurité | À faire |
| 13 | Documentation et publication finale | À faire |

## 2. Détail des phases : résultat attendu et tests

### Phase 0 : préparer le dossier
- **Résultat :** le dossier est un vrai dépôt Git relié à `saintfranckinder/minstock` (appelé `inventorymanagement` jusqu'au 2026-11-18) ; Git fonctionne (celui de GitHub Desktop suffit) ; `.gitignore` et `README.md` existent.
- **Test :** un commit local apparaît dans l'onglet **History** de GitHub Desktop.

### Phase 2 : structure, Firebase, persistance
- **Résultat :**
  - Structure : `index.html`, `css/`, `js/` (petits modules), `vendor/`, `firestore.rules`. Tous les chemins sont relatifs (`./`).
  - SDK Firebase (version fixe) copié dans `vendor/`, avec la ligne d'import vers `https://www.gstatic.com/...` remplacée par un chemin local dans chaque fichier. Modification documentée dans le README.
  - Petit serveur local sans installation (script PowerShell) pour ouvrir l'application sur `http://localhost`.
  - Persistance hors ligne activée avant toute lecture, avec test préalable du stockage local et avertissement en cas d'échec.
  - `firestore.rules` qui refuse tout, avec les instructions de publication dans la console.
- **Tests :**
  - La page s'ouvre en local et se connecte au projet Firebase.
  - Dans l'onglet Réseau du navigateur, aucun appel vers `gstatic.com`.
  - Quand le navigateur bloque le stockage local, l'avertissement de persistance s'affiche.

**Compte rendu de la phase 2 (2026-11-16)**

Tests exécutés par l'assistant, dans le navigateur intégré, sur `http://localhost:8080/` :

| Test | Résultat |
|---|---|
| Le serveur local démarre et sert la page | Réussi |
| Les trois fichiers du SDK sont chargés depuis `vendor/` ; aucun appel vers `gstatic.com` | Réussi |
| Firebase répond « accès refusé » (projet joint, règles actives) | Réussi |
| Mémoire hors ligne active ; la base locale `firestore/[DEFAULT]/inventory-management-app-52866/main` existe | Réussi |
| Stockage local bloqué (simulé par une page de test temporaire, supprimée ensuite) : avertissement affiché, « Indisponible » | Réussi |
| Affichage à 360 pixels de large, sans défilement horizontal | Réussi |
| Le serveur local refuse `.git`, `.gitignore` et les chemins hors du projet | Réussi |
| Aucune erreur dans la console du navigateur | Réussi |

Tests non exécutés :

- Double-clic sur `demarrer.bat` par le propriétaire (seul le script qu'il lance a été testé).
- Coupure d'Internet : la ligne doit afficher « Serveur injoignable ».
- Publication de `firestore.rules` dans la console (action du propriétaire).
- Aucun test sur smartphone (impossible avant la mise en ligne, fin de phase 4b).

Constats :

- Le SDK Firebase 13.4.0 confirme l'analyse : si le stockage local est bloqué, Firestore continue en mémoire sans prévenir l'application (seulement un message dans la console). L'application teste donc elle-même le stockage local au démarrage, puis vérifie que la base locale de Firestore existe quand le navigateur permet de le savoir.
- Cette détection est approximative. En navigation privée, les navigateurs récents acceptent le stockage puis l'effacent à la fermeture : l'application affiche alors « Active » à tort. Limite notée dans le README.
- La page de vérification fait une tentative de lecture sur le serveur à chaque ouverture. C'est provisoire : à retirer en phase 3, quand la connexion des utilisateurs existera.
- `firebase-auth.js` est chargé et démarré pour valider la copie locale, mais aucune fonction de connexion n'existe encore.
- SheetJS (`xlsx.full.min.js`, 0.20.3) est copié dans `vendor/` mais n'est pas encore utilisé ni chargé par la page.

### Phase 3 : connexion, premier lancement, confidentialité
- **Résultat :** connexion Google (popup) et e-mail / mot de passe, inscription, mot de passe oublié, premier lancement (nom de l'entrepôt, devise), texte de confidentialité, règles d'isolation par compte. Messages génériques quand l'e-mail existe déjà avec l'autre méthode.
- **Avant de coder :** expliquer au propriétaire le cas « même adresse e-mail avec les deux méthodes ».
- **Tests :**
  - Créer un compte par chaque méthode, se déconnecter, se reconnecter.
  - Même adresse par les deux méthodes, dans les deux ordres ; noter le comportement réel.
  - Popup bloquée : le message d'aide s'affiche.
  - Un second compte ne voit pas les données du premier.

**Compte rendu de la phase 3 (2026-11-16)**

Tests exécutés par l'assistant, dans le navigateur intégré, sur `http://localhost:8080/`, avec le compte de test `test-phase3@example.com` (mot de passe dans `.env.test`, fichier ignoré par Git) :

| Test | Résultat |
|---|---|
| Création du compte par e-mail et mot de passe | Réussi |
| Mot de passe de moins de 8 caractères refusé avant l'envoi | Réussi |
| Seconde inscription avec la même adresse : message « a déjà un compte » | Réussi |
| Mauvais mot de passe : message générique | Réussi |
| Déconnexion, puis reconnexion | Réussi |
| Mot de passe oublié avec une adresse sans compte : même message que pour une adresse existante | Réussi |
| Texte de confidentialité accessible depuis la connexion | Réussi |
| Règles non publiées : message « Impossible de charger vos données » | Réussi |
| Premier lancement : nom vide refusé, puis entrepôt créé (4 champs, date du serveur) | Réussi |
| Rechargement : l'accueil s'affiche avec l'entrepôt existant, sans repasser par le premier lancement | Réussi |
| `tests-regles.html` : 14 essais sur 14 (2 autorisés, 12 refusés) | Réussi |
| Tous les écrans à 360 pixels, sans défilement horizontal, cibles d'au moins 48 pixels | Réussi |

Tests non exécutés :

- Connexion avec Google (popup) et message de popup bloquée : à faire par le propriétaire.
- Réception réelle de l'e-mail de réinitialisation, en français : à faire par le propriétaire.
- Même adresse par les deux méthodes, dans les deux ordres : à faire par le propriétaire, avec son compte Google.
- Second compte réel qui ne voit pas les données du premier : seule la lecture d'un autre identifiant de compte a été testée (refusée).
- Premier chargement sans Internet sur un nouvel appareil (écran « Connexion Internet nécessaire ») : non simulé.
- Smartphone : impossible avant la mise en ligne.

Constats :

- La publication des règles a d'abord semblé sans effet : le serveur a continué de tout refuser pendant plusieurs minutes, puis la version 3 est devenue active. Cause non identifiée (délai du serveur ou publication refaite). Le README demande désormais de vérifier la ligne « Version des regles » dans la console.
- La lecture de test provisoire de la phase 2 est retirée.
- L'écran de premier lancement ne s'affiche que si le serveur confirme qu'aucun entrepôt n'existe (décision 20).
- Le texte de confidentialité mentionne la suppression du compte, qui n'existera qu'en phase 7.
- La liste des devises existe à deux endroits qui doivent rester identiques : `js/entrepot.js` et `firestore.rules`.
- Le compte de test reste dans Firebase Authentication, avec son entrepôt « Entrepôt de test ». Il resservira en phase 4.

### Phase 4a : produits et nombres
- **Résultat :** ajouter, modifier, archiver un produit ; fonction unique de conversion (saisie ↔ entiers) ; bornes sur les quantités et les prix ; règles de validation des produits (types, champs, longueurs).
- **Tests :**
  - Page `tests-nombres.html` entièrement verte (`2,5`, `-2,5`, `1 000`, plus de 3 décimales refusées, etc.).
  - Modifier un produit ne change jamais sa quantité.

**Compte rendu de la phase 4a (2026-11-16)**

Tests exécutés par l'assistant, dans le navigateur intégré, sur `http://localhost:8080/`, avec le compte de test :

| Test | Résultat |
|---|---|
| `tests-nombres.html` : 98 essais sur 98 (dont `1,005`, `4,35`, `-2,5`, `1 000`, très grands nombres) | Réussi |
| Formulaire : nom vide, unité vide, trop de décimales, texte non numérique refusés | Réussi |
| Valeur comprise affichée sous les champs ; `1.000` affiché comme 1 | Réussi |
| Ajout de deux produits : affichage immédiat « En attente de synchronisation », puis confirmation | Réussi |
| Sur le serveur : 9 champs, quantité 0, `dernierMouvementId` vide, 2,5 enregistré `2500`, 1 250,50 enregistré `125050` | Réussi |
| Nom en double refusé, sans tenir compte des majuscules ni des espaces | Réussi |
| Modification du nom, du seuil et du prix : quantité et `dernierMouvementId` inchangés | Réussi |
| Archivage : annulation respectée, puis produit retiré de la liste et conservé sur le serveur | Réussi |
| `tests-regles.html` : 39 essais sur 39 au premier passage, 38 sur 38 au second (la création du produit d'essai n'est pas rejouée) | Réussi |
| Règles version 3 encore actives : message « Impossible de charger les produits » | Réussi |
| Formulaire à 360 pixels, cibles d'au moins 48 pixels | Réussi |

Tests non exécutés :

- Ajout ou modification hors ligne, puis retour en ligne.
- Deux appareils modifiant le même produit.
- Message d'avertissement de l'archivage quand le stock n'est pas à 0 (aucun produit n'a encore de stock).
- Smartphone : impossible avant la mise en ligne.

Constats :

- La valeur d'une ligne (`calculerValeurCentimes`) est calculée en grands entiers (BigInt) : même résultat que la formule de `CLAUDE.md`, mais exact avec de très grands nombres.
- Les règles exigent `updatedAt` égal à l'heure du serveur à chaque modification d'un produit : le lot de mouvement de la phase 4b devra l'écrire aussi.
- Les bornes de quantité des règles (±10^15 millièmes) sont volontairement plus larges que celles du formulaire (10^12), pour ne pas refuser une opération légitime faite hors ligne.
- Le compte de test contient maintenant : « Riz 25 kg (Tchako) » (actif), « Huile » et « Produit d'essai (règles) » (archivés).
- `js/interface.js` regroupe les fonctions d'affichage partagées, auparavant dans `js/app.js`.

### Phase 4b : mouvements, règles, historique
- **Résultat :**
  - Entrées, sorties, ajustements par lot unique (`increment`, `dernierMouvementId`, mouvement).
  - Stock initial par mouvement dans le lot de création.
  - Règles complètes du lien produit-mouvement (voir décision 12).
  - Liste locale des opérations non confirmées, vérifiée à chaque ouverture.
  - Historique : 50 derniers mouvements, puis « Voir plus ».
- **Avant de coder :** expliquer simplement au propriétaire comment les règles vérifient le lien produit-mouvement.
- **Tests :** page `tests-regles.html` entièrement verte avec un compte de test :
  - opération correcte acceptée ; création avec stock initial acceptée ; création avec stock 0 acceptée ;
  - quantité modifiée sans mouvement : refusée ;
  - mouvement sans modification du produit : refusé ;
  - écart entre le mouvement et la quantité : refusé ;
  - même identifiant rejoué : refusé, sans double comptage ;
  - ancien mouvement réutilisé : refusé ;
  - mouvement modifié ou supprimé : refusé ;
  - accès aux données d'un autre compte : refusé.

**Compte rendu de la phase 4b (2026-11-16)**

Tests exécutés par l'assistant, dans le navigateur intégré, sur `http://localhost:8080/`, avec le compte de test et les règles version 5 publiées :

| Test | Résultat |
|---|---|
| `tests-regles.html` : 70 essais sur 70 | Réussi |
| Lot complet (entrée, sortie, ajustement) accepté, y compris sur un produit archivé | Réussi |
| Quantité augmentée exactement de la valeur du mouvement (lecture sur le serveur) | Réussi |
| Même numéro de mouvement renvoyé : refusé, quantité non comptée deux fois | Réussi |
| Mouvement sans changement de stock, changement sans mouvement, chiffres discordants, ancien mouvement réutilisé, autre numéro désigné : refusés | Réussi |
| Mouvement modifié ou supprimé : refusé | Réussi |
| Valeur 0, valeur à virgule, type inconnu ou incohérent, motif trop long, autre auteur, heure serveur choisie par l'appareil, champ inconnu : refusés | Réussi |
| Produit créé avec stock de départ et mouvement d'entrée : accepté ; sans mouvement, avec chiffres discordants ou négatif : refusé | Réussi |
| Application : entrée +10, sortie -2,5, ajustement -0,5 sur un produit à 0 : quantité 7, égale à la somme des mouvements sur le serveur | Réussi |
| Affichage immédiat « En attente de synchronisation », puis confirmation | Réussi |
| Produit « Ciment » créé avec un stock de départ de 12,5 : mouvement « Stock initial » présent | Réussi |
| Sortie de 15 sur 12,5 : avertissement avant l'envoi, puis « Stock négatif : à vérifier » | Réussi |
| Refus simulé : bloc « Opérations refusées » affiché, bouton « J'ai noté » | Réussi |
| Opération déjà enregistrée renvoyée : message « était déjà enregistrée », quantité inchangée | Réussi |
| Réouverture avec une opération notée « en attente » mais absente du serveur : signalée comme refusée ; une autre, présente sur le serveur : retirée sans message | Réussi |
| Historique : ordre, motif, heure ; 56 mouvements ajoutés, « Voir plus » passe de 50 à 65 lignes, sans doublon | Réussi |
| 56 mouvements alternés +1 / -1 : la quantité revient exactement à 7 | Réussi |
| Formulaire de mouvement à 360 pixels, cibles d'au moins 48 pixels | Réussi |

Tests non exécutés :

- Mouvement fait réellement hors ligne (mode avion), puis retour en ligne.
- Coupure de connexion entre l'envoi et la réponse (le renvoi automatique par Firebase n'a été que simulé).
- Deux appareils modifiant le même produit.
- « Voir plus » sans Internet (avertissement d'historique incomplet).
- Affichage des deux heures quand l'écart dépasse 5 minutes (aucun mouvement dans ce cas).
- Smartphone : impossible avant la mise en ligne.

Constats :

- **Point incertain n° 1 levé :** les règles voient bien la quantité après l'addition faite par le serveur (`increment`), dans `request.resource` comme dans `getAfter()`.
- **Point à vérifier n° 3 :** les lots de l'application (2 écritures) sont acceptés. La limite documentée par Firebase est de 20 appels de vérification par lot et 10 par écriture ; les appels répétés sur un même document ne comptent qu'une fois. Le nombre exact d'appels n'a pas été mesuré. La taille de lot sûre pour la suppression du compte reste à déterminer en phase 7.
- Les refus et le cas « déjà enregistrée » ont été provoqués en appelant les fonctions de l'application avec des données fabriquées, pas par une vraie coupure de réseau.
- L'historique du compte de test contient maintenant 65 mouvements, dont 56 « Essai du bouton Voir plus ». Ils ne peuvent pas être supprimés.
- Compte de test : « Riz 25 kg (Tchako) » à 7 sac, « Ciment » à -2,5 sac, trois produits archivés.
- Le suivi des opérations utilise `localStorage`, par compte (clé `operations-en-attente:{uid}`).
- Un passage complet de `tests-regles.html` dure environ une minute.

### Étape intermédiaire : dépôt public et GitHub Pages
- **Résultat :** recherche de secrets dans les fichiers et tout l'historique Git ; règles publiées ; dépôt passé en public ; GitHub Pages activé ; `saintfranckinder.github.io` dans les domaines autorisés de Firebase Authentication.
- **Test :** le lien s'ouvre sur le smartphone et la connexion fonctionne.

**Compte rendu partiel : recherche de secrets (2026-11-18)**

Faite avec l'accord du propriétaire **avant tout envoi sur GitHub** (le dépôt `minstock` était encore vide), avec le Git de GitHub Desktop, sur les 7 commits de la branche `main` (seule branche, aucune étiquette). Le commit de ce compte rendu a été revérifié après sa création.

| Vérification | Résultat |
|---|---|
| Tous les fichiers ayant existé dans l'historique (34) : aucun fichier inattendu | Réussi |
| `.env.test`, et tout fichier `.env*`, `.pem`, `.key`, compte de service, `.firebaserc` ou `.claude/` : jamais commité ; `.env.test` ignoré par Git | Réussi |
| Clés privées et jetons connus (GitHub, AWS, Slack, compte de service Google…), `vendor/` compris : aucun | Réussi |
| Clé d'API Google : seulement dans `js/firebase-config.js`, ce qui est normal (configuration web, pas un secret) | Réussi |
| Mots de passe écrits en clair : aucun (3 fausses alertes : case « Afficher le mot de passe », message d'erreur) | Réussi |
| Mot de passe du compte de test : absent des fichiers et des messages de commit (recherché sans être affiché) | Réussi |
| Adresses e-mail : seulement l'adresse fictive du compte de test dans `PLAN.md` ; aucune adresse `gmail.com` | Réussi |
| Auteur et validateur de tous les commits : uniquement l'adresse `noreply` de GitHub | Réussi |
| Messages de commit : ni secret ni adresse | Réussi |

Limites : la recherche porte sur des formes connues de secrets ; un secret de forme inhabituelle pourrait lui échapper. Les fichiers de `vendor/` sont des copies officielles (`vendor/LISEZMOI.md`) : ils n'ont été fouillés que pour les clés, les jetons et les adresses e-mail.

**Compte rendu partiel : protections avant la mise en public (2026-11-18)**

Décisions 40 et 41, validées par le propriétaire. Tests exécutés par l'assistant, dans le navigateur intégré, sur `http://localhost:8080/` :

| Test | Résultat |
|---|---|
| `tests-regles.html` avec `test-phase3@example.com` : 67 essais sur 67 (la création des produits d'essai n'est pas rejouée) | Réussi |
| Aucun compte connecté : bouton « Lancer les tests » bloqué | Réussi |
| Second compte de test `test-isolation@example.org` : bouton bloqué, message « Ce compte n'est pas un compte de test » | Réussi |
| Même compte, bouton débloqué de force puis cliqué : aucun essai lancé, rien d'écrit | Réussi |
| Second compte : écran « Créer votre entrepôt », puis « Aucun produit pour l'instant » ; il ne voit pas les données du premier | Réussi |
| Page de test à 360 pixels sans défilement horizontal ; aucune erreur dans la console | Réussi |
| Fichier vide `.nojekyll` créé à la racine | Fait |

Tests non exécutés :

- Le contrôle placé au début du lancement des essais ne peut pas être déclenché sans modifier la page ; il utilise la même fonction que les deux contrôles testés.
- Effet réel de `.nojekyll` : à vérifier sur GitHub Pages (les trois fichiers Firebase doivent se charger depuis `vendor/`).

Constats :

- Second compte de test : `test-isolation@example.org`, mot de passe dans `.env.test` (ignoré par Git), entrepôt « Entrepôt isolation (test) » sans produit. À supprimer en fin de projet, comme le premier.
- Compte de test principal : 68 mouvements après ce passage.

**Compte rendu partiel : mise en ligne (2026-11-18)**

Actions du propriétaire, guidé clic par clic : « Publish branch » dans GitHub Desktop ; `saintfranckinder.github.io` dans les domaines autorisés de Firebase Authentication ; dépôt passé en public ; GitHub Pages activé (branche `main`, dossier racine) ; protection contre l'envoi de secrets (Push protection) vérifiée dans les réglages GitHub.

Vérifications de l'assistant :

| Vérification | Résultat |
|---|---|
| Les 9 commits sont sur GitHub, identiques à la copie locale (dernier : `d5a7808`) | Réussi |
| Le dépôt est public et GitHub Pages est actif (vu sans connexion, par l'API publique de GitHub) | Réussi |
| `https://saintfranckinder.github.io/minstock/` : page, style, 13 modules `js/` et les 3 fichiers Firebase répondent (code 200) | Réussi |
| Les 3 fichiers de `vendor/` ont exactement la même taille qu'en local : `.nojekyll` fonctionne (décision 41) | Réussi |
| `.env.test` absent du site (404) et du dépôt public | Réussi |
| Dans Chrome, le site affiche l'écran « Connexion » avec le bouton Google ; tous les fichiers de l'application viennent de `/minstock/` ; aucun appel à `gstatic.com` ; aucune erreur de l'application dans la console | Réussi |

Tests non exécutés par l'assistant :

- Connexion sur le site en ligne : l'assistant ne saisit pas de mot de passe sur le site public. À faire par le propriétaire, sur smartphone ; la connexion Google confirmera aussi le domaine autorisé.
- Réglages GitHub (Push protection) et domaine autorisé dans Firebase : faits par le propriétaire, non vus par l'assistant.
- Affichage à 360 pixels sur le site en ligne : mêmes fichiers que sur `localhost`, où il a été testé ; à confirmer sur le smartphone.

Constat : juste après la mise en ligne, GitHub Pages a répondu 503 au lieu de 404 pour des fichiers inexistants ; quelques secondes plus tard, `.env.test` répondait bien 404. Défaut passager de GitHub Pages, sans conséquence.

**Premier test sur smartphone (2026-11-18), fait par le propriétaire**

Le propriétaire indique que tout fonctionne, sur `https://saintfranckinder.github.io/minstock/` :

- site ouvert sur le téléphone, affichage lisible ;
- connexion par e-mail avec le compte de test ;
- entrée de 1 sur « Riz 25 kg (Tchako) » (attendu : de 7 à 8 sac), puis ligne visible dans l'historique ;
- connexion avec Google : le domaine `saintfranckinder.github.io` est donc bien autorisé dans Firebase.

Non précisé : modèle du téléphone et navigateur ; type de clavier proposé pour la quantité ; création ou non d'un vrai entrepôt avec le compte Google du propriétaire. Non testé : message d'aide quand la fenêtre Google est bloquée.

**Étape terminée le 2026-11-18.**

### Phase 5 : tableau de bord
- **Résultat :** liste, recherche, quantité, seuil, prix, valeur « indicative », `+1` / `-1` (48 × 48 px), saisie d'une quantité précise, alertes `Stock bas` et `Rupture`.
- **Tests :** smartphone (360 px) et ordinateur ; alertes orange et rouge avec leur texte.

**Compte rendu de la phase 5 (2026-11-18)**

Choix validés par le propriétaire avant de coder : décisions 44 (`−1` qui rendrait le stock négatif : formulaire prérempli) et 45 (stock négatif compté en négatif dans le total). Les règles Firestore ne changent pas (version 5).

Tests exécutés par l'assistant, dans le navigateur intégré, sur `http://localhost:8080/`, avec le compte de test :

| Test | Résultat |
|---|---|
| `tests-nombres.html` : 104 essais sur 104, dont 6 nouveaux sur le total (entrepôt vide, stock négatif, somme des lignes arrondies, très grands nombres, affichage négatif) | Réussi |
| Alertes : Riz 8 / seuil 3 sans alerte ; 2 / seuil 5 « Stock bas » orange ; 5 / seuil 5 « Stock bas » ; 6 / seuil 5 sans alerte ; 0 / seuil 0 « Rupture » rouge ; -2,5 « Rupture » et « Stock négatif : à vérifier » | Réussi |
| Valeurs : 10 400,00 ; -2 375,00 ; 20,00 puis 50,00 ; 0,00 HTG ; total égal à la somme des lignes à chaque étape (8 025,00 ; 8 045,00 ; 8 075,00) | Réussi |
| Recherche : `riz`, `RIZ`, `cimént`, `  CIM  `, `zero`, `tchako)` trouvent le bon produit ; `zzz` affiche « Aucun produit ne correspond » ; le total ne change pas pendant une recherche | Réussi |
| `+1` : 10 appuis rapides (dont 1 au clavier) sur le Riz, de 8 à 18 sac ; sur le serveur : 18 000 millièmes et exactement 10 mouvements « Entrée +1 », sans doublon | Réussi |
| « En attente de synchronisation » puis confirmation ; aucune opération suivie restante après la synchronisation | Réussi |
| `−1` sur un stock à 0 : formulaire prérempli (Sortie, 1) avec « le stock deviendra négatif » ; « Annuler » : rien n'est envoyé, stock inchangé | Réussi |
| `−1` ordinaire : de 6 à 5 pièces, « Stock bas » réapparaît | Réussi |
| Formulaire « Mouvement de stock » après la mise en commun de l'envoi : Sortie de 10, le Riz revient à 8 sac | Réussi |
| Clavier : après un appui sur Entrée, le focus reste sur le bouton `+1` du même produit, contour visible | Réussi |
| 360 pixels : aucun défilement horizontal ; boutons `−1` / `+1` d'au moins 56 × 48 pixels, écartés de 12 pixels ; champ de recherche de 48 pixels de haut, police de 16 pixels | Réussi |
| Historique : les appuis rapides apparaissent comme « Entrée : +1 sac » ou « Sortie : -1 pièce » | Réussi |
| `tests-regles.html` : 67 essais sur 67 | Réussi |
| Aucune erreur dans la console | Réussi |

Tests non exécutés :

- *(Fait le 2026-11-18 par le propriétaire : voir plus bas.)* Smartphone.
- Appuis hors ligne réels (mode avion) : phase 8.
- Deux appareils qui appuient sur le même produit : phase 8 ou 12.
- Lecteur d'écran réel : l'annonce « Entrée +1 sac — … Quantité mise à jour sur cet appareil. » est bien écrite dans la zone prévue, mais n'a pas été écoutée avec un lecteur d'écran.

Constats :

- Le compte de test contient deux nouveaux produits, « Essai phase 5 (stock bas) » (5 pièces) et « Essai phase 5 (zéro) » (0 pièce), et 20 mouvements de plus (essais et 3 de `tests-regles.html`).
- Le mouvement « Test smartphone » du propriétaire est présent sur le serveur : son test de l'étape « dépôt public » est confirmé.
- La liste est reconstruite à chaque changement ; elle reste rapide avec quelques produits. À revoir si un entrepôt approche la taille à annoncer (question ouverte de la section 4).

**Test sur smartphone (2026-11-18), fait par le propriétaire**

Sur `https://saintfranckinder.github.io/minstock/`, version 0.6.0 affichée, avec le compte de test (captures d'écran envoyées à l'assistant) :

- `+1` au doigt : « Ciment » de -2,5 à -1,5 sac, toujours « Rupture » avec bordure rouge, « Stock négatif : à vérifier » et valeur -1 425,00 HTG ; « Essai phase 5 (stock bas) » de 5 à 7 pièces, sans étiquette au-dessus du seuil de 5, valeur 70,00 HTG ; « Essai phase 5 (zéro) » de 0 à 1 pièce.
- `−1` : « Essai phase 5 (zéro) » de 1 à 0 pièce, puis un second `−1` ouvre le formulaire prérempli (Sortie, 1, stock après l'opération -1 pièce, « Attention : le stock deviendra négatif. »).
- Recherche : seul « Ciment » reste affiché.
- « En attente de synchronisation » s'affiche brièvement après chaque appui, puis disparaît : comportement normal, le message disparaît quand le serveur a confirmé.

Défaut constaté à cette occasion, sans danger : la ligne « En attente de synchronisation » s'ajoute dans la fiche du produit ; pendant un instant, les boutons « Mouvement de stock » et « Modifier » et les produits placés en dessous descendent, puis remontent. Les boutons `−1` et `+1` du produit touché ne bougent pas ; au pire, un appui tombe sur « Modifier », qui s'annule. Correction prévue en phase 8, avec l'indicateur de synchronisation (section 5, point 7).

Non précisé : lisibilité des étiquettes en extérieur ; modèle du téléphone et navigateur.

**Phase terminée le 2026-11-18.**

### Phase 6 : formulaires, historique, paramètres
- **Résultat :** formulaire d'ajout et de modification ; historique lisible (les deux dates distinguées) ; bouton « Annuler cette opération » sur chaque ligne (décision 43) ; nom de l'entrepôt modifiable ; devise modifiable seulement sans produit.
- **Tests :** devise bloquée dès qu'un produit existe ; historique compréhensible après renommage d'un produit ; annulation : le stock revient exactement à sa valeur, l'opération d'origine est marquée « annulée », une seconde annulation de la même opération est refusée sans double comptage, une annulation ne propose pas d'être annulée.

**Compte rendu de la phase 6 (2026-11-18)**

Choix validés par le propriétaire avant de coder : décisions 47 (pas de filtre par produit dans l'historique), 48 (cas où le bouton « Annuler cette opération » n'apparaît pas) et 49 (devise vérifiée auprès du serveur). Les règles Firestore ne changent pas (version 5) ; aucune nouvelle donnée dans la base.

Ce qui a été fait :

- Historique : bouton « Annuler cette opération » sur chaque ligne qui le permet ; fenêtre de confirmation (opération, opération inverse, stock estimé après, avertissement si négatif) ; opération inverse `ajustement` d'identifiant `annulation-{id}` envoyée par `envoyerMouvement`, le seul chemin d'envoi ; mention « Annulée le … » sur l'opération d'origine ; « Produit archivé : cette opération ne peut plus être annulée » ; court texte d'aide en haut de l'historique ; le focus clavier reste sur la même ligne quand la liste est reconstruite.
- Message propre à une annulation déjà faite sur un autre appareil ; les messages « déjà enregistrée » s'affichent dans l'historique quand il est ouvert.
- Écran « Paramètres » (nouveau fichier `js/ecran-parametres.js`) : nom de l'entrepôt ; devise modifiable seulement si aucun produit n'existe (mémoire de l'appareil, puis serveur ; vérifiée de nouveau juste avant d'enregistrer ; délai maximal de 15 secondes) ; bouton « Vérifier de nouveau » sans Internet.
- Petites retouches : « le stock restera négatif » au lieu de « deviendra négatif » quand il l'est déjà (formulaire de mouvement et annulation) ; liste de devises bloquée gardée lisible (texte foncé sur fond gris clair).
- `tests-regles.html` : 5 essais d'annulation de plus (72 au total).
- Version `0.7.0`.

Tests exécutés par l'assistant, dans le navigateur intégré, sur `http://localhost:8080/`, avec les deux comptes de test :

| Test | Résultat |
|---|---|
| `tests-nombres.html` : 104 sur 104 | Réussi |
| `tests-regles.html` : 72 sur 72, dont annulation acceptée, quantité revenue exactement au départ, seconde annulation refusée, rien compté deux fois | Réussi |
| Fenêtre de confirmation, réponse « Annuler » : rien n'est envoyé | Réussi |
| Annuler une entrée de +1 (« Essai phase 5 (stock bas) ») : de 7 à 6 pièces sur le serveur ; ligne « Ajustement : -1 pièce », motif « Annulation : Entrée +1 pièce du 18/11/2026 10:49 » ; origine « Annulée le … » ; focus resté sur la ligne | Réussi |
| Annuler une sortie de -1 (« Essai phase 5 (zéro) ») : de 0 à 1 pièce sur le serveur | Réussi |
| Ajustement de -2,5 sur « Ciment » (de -1,5 à -4) : pas de bouton tant qu'il est en attente, bouton après confirmation ; annulation avec « le stock restera négatif » ; retour exact à -1,5 sac sur le serveur | Réussi |
| Seconde annulation de la même opération, envoyée comme par un autre appareil : refusée par le serveur, stock inchangé (-1,5), message « Cette opération avait déjà été annulée… Rien n'a été compté deux fois. », aucune opération refusée affichée | Réussi |
| Pas de bouton sur une annulation ni sur une opération déjà annulée ; « Produit archivé » sur les opérations des produits archivés | Réussi |
| Paramètres, compte avec produits : devise bloquée avec explication ; nom vide, nom de 101 caractères refusés ; même nom signalé ; nouveau nom enregistré sur le serveur et affiché sur l'écran des produits, puis nom d'origine remis ; tentative forcée de changer la devise : rien n'est envoyé | Réussi |
| Paramètres, second compte de test (aucun produit) : devise libre ; passage à USD puis retour à HTG, vérifiés sur le serveur et sur l'écran des produits | Réussi |
| Paramètres sans réseau (réseau Firestore coupé) : « Vérification impossible sans Internet », bouton « Vérifier de nouveau » ; réseau rétabli : devise libre, focus sur la liste des devises | Réussi |
| Produit renommé puis nom d'origine remis : l'historique garde l'ancien nom sur les anciennes lignes | Réussi |
| Archivage d'un produit avec du stock : la confirmation indique « il reste 6 pièce en stock » (réponse « Annuler ») | Réussi |
| 360 pixels : aucun défilement horizontal ; boutons et champs de 294 × 48 pixels ; police de 16 pixels | Réussi |

Tests non exécutés :

- *(Fait le 2026-11-18 par le propriétaire : voir plus bas.)* Smartphone.
- Coupure réelle d'Internet (mode avion) pendant la vérification de la devise : la vérification s'arrête au plus tard après 15 secondes ; phase 8.
- Deux vrais appareils qui annulent la même opération : remplacé par l'envoi direct de la même annulation (même chemin que l'application) et par `tests-regles.html`.
- Affichage des deux heures quand l'écart dépasse 5 minutes : aucun mouvement de ce type dans le compte de test ; phase 8 (essais hors ligne).
- Lecteur d'écran réel et vraie navigation au clavier (touche Tab) : focus vérifié par programme seulement.

Constats :

- Le compte de test contient 4 mouvements de plus dans l'application (deux annulations, un ajustement de -2,5 sur « Ciment » et son annulation), plus 5 à chaque passage de `tests-regles.html`.
- L'historique affiché au démarrage peut contenir plus de 50 lignes (les mouvements gardés en mémoire de l'appareil d'une session précédente, plus les 50 derniers du serveur). Comportement de la phase 4b, sans conséquence ; noté pour mémoire.

**Test sur smartphone (2026-11-18), fait par le propriétaire**

Sur le site en ligne, version 0.7.0, avec le compte de test : le propriétaire indique que tout fonctionne (annulation d'une opération dans l'historique, écran « Paramètres » : renommer l'entrepôt puis remettre son nom, devise bloquée). Non précisé : quelle opération a été annulée ; modèle du téléphone et navigateur.

**Phase terminée le 2026-11-18.**

### Phase 6b : carnet de fournisseurs
- **Résultat :** liste des fournisseurs, recherche simple, formulaire d'ajout et de modification (nom obligatoire ; téléphone, WhatsApp, e-mail, adresse, produits fournis, notes), suppression (décision 50, à la place de l'archivage) ; règles Firestore version 6 pour `users/{uid}/suppliers` ; texte de confidentialité complété (décision 42).
- **Avant de coder :** proposer les longueurs maximales de chaque champ ; trancher les questions de la section 4 sur les fournisseurs ; expliquer comment les fournisseurs sont lus (écoute permanente ou chargement à l'ouverture de l'écran) au regard du quota de lectures.
- **Tests :** `tests-regles.html` complété (champs inconnus, longueurs, types, accès à un autre compte refusés) ; ajout, modification, suppression dans l'application ; un compte ne voit pas les fournisseurs d'un autre ; affichage à 360 pixels et sur smartphone.

**Compte rendu de la phase 6b (2026-11-18)**

Choix validés par le propriétaire avant de coder : décisions 50 (suppression définitive au lieu de l'archivage ; `CLAUDE.md` et `DEMARRAGE.md` mis à jour), 51 (noms en double autorisés avec avertissement), 52 (liste écoutée seulement pendant que l'écran est ouvert), 53 (boutons « Appeler », « WhatsApp », « E-mail ») et 54 (limites des champs).

Ce qui a été fait :

- Règles Firestore **version 6** : `users/{uid}/suppliers` (lecture, création, modification, suppression par le propriétaire du compte ; neuf champs exactement ; limites de la décision 54 ; dates du serveur ; date de création inchangée). Le reste est identique à la version 5. **Publiées par le propriétaire le 2026-11-18**, vérifiées actives (90 essais sur 90).
- Nouveaux fichiers `js/fournisseurs.js` (lecture et écriture) et `js/ecran-fournisseurs.js` (liste, recherche, liens de contact, formulaire, suppression) ; bouton « Fournisseurs » sur l'écran des produits ; deux écrans dans `index.html`.
- Texte de confidentialité complété (coordonnées des fournisseurs, données de tiers).
- `normaliserPourRecherche` déplacée dans `js/interface.js`, partagée par les produits et les fournisseurs (aucun changement de comportement).
- `tests-regles.html` : 18 essais de plus (90 au total quand les produits d'essai existent déjà, 93 sinon).
- Version `0.8.0`.

Tests exécutés par l'assistant, dans le navigateur intégré, sur `http://localhost:8080/`, avec les deux comptes de test :

| Test | Résultat |
|---|---|
| Avant la publication des règles : l'écran « Fournisseurs » affiche « Impossible de charger les fournisseurs… règles de sécurité (version 6) ne sont peut-être pas encore publiées » ; le reste de l'application fonctionne | Réussi |
| `tests-regles.html` après publication : 90 sur 90, dont les 18 essais des fournisseurs (création, lecture, modification, suppression acceptées ; champ en trop, champ manquant, nom vide ou trop long, lettres dans un téléphone, WhatsApp trop long, téléphone en nombre, e-mail sans @, notes trop longues, dates choisies par l'appareil, accès à un autre compte refusés) | Réussi |
| Liste vide : « Chargement… » puis « Aucun fournisseur pour l'instant. » | Réussi |
| Formulaire : nom vide, nom de 101 caractères, lettres dans le téléphone, `#` dans WhatsApp, e-mail sans point, notes de 1 001 caractères refusés, avec un message clair et le curseur placé sur le champ | Réussi |
| Ajout de deux fournisseurs : « En attente de synchronisation » puis confirmation ; sur le serveur, exactement les neuf champs, champs vides enregistrés comme chaînes vides, nom sans espaces autour | Réussi |
| Liens : `tel:+50937123456`, `https://wa.me/50937123456` (nouvel onglet), `mailto:…` ; numéro WhatsApp sans indicatif : pas de bouton et phrase d'explication ; adresse sur deux lignes affichée sur deux lignes | Réussi |
| Nom en double (majuscules différentes) : avertissement avec le nom existant ; « Annuler » : rien n'est ajouté ; « OK » : ajouté | Réussi |
| Modification : notes changées sur le serveur, date de création inchangée ; pas d'avertissement de doublon pour son propre nom | Réussi |
| Suppression : « Annuler » ne fait rien ; confirmation : fournisseur effacé du serveur | Réussi |
| Recherche : `ciment` et `SABLE` (produits fournis), `  MARIE ` (nom), `zzz` (« Aucun fournisseur ne correspond ») | Réussi |
| Fournisseur supprimé « ailleurs » pendant que son formulaire est ouvert : retour à la liste avec un message | Réussi |
| Écoute arrêtée au retour à l'écran des produits : un fournisseur ajouté entre-temps n'apparaît qu'à la réouverture de l'écran | Réussi |
| Second compte de test : aucun fournisseur visible (0 sur le serveur pour ce compte) | Réussi |
| 360 pixels : aucun défilement horizontal ; « Appeler », « WhatsApp », « E-mail » côte à côte (environ 92 × 48 pixels) ; champs de 48 pixels, police de 16 pixels | Réussi |
| Aucune erreur dans la console | Réussi |

Tests non exécutés :

- *(Fait le 2026-11-18 par le propriétaire : voir plus bas.)* Smartphone.
- Liste des fournisseurs sans Internet (mode avion) : phase 8.
- Deux vrais appareils qui modifient le même fournisseur : non testé (dernière modification gagnante, comme les produits).
- Lecteur d'écran réel et vraie navigation au clavier (touche Tab).

Constats :

- Les fournisseurs d'essai ont tous été supprimés à la fin des essais : les comptes de test n'en contiennent aucun.
- L'entrepôt du compte de test s'appelle maintenant « NzuriDeal » (renommé par le propriétaire pendant son test de la phase 6). Laissé tel quel.

**Test sur smartphone (2026-11-18), fait par le propriétaire**

Sur le site en ligne, version 0.8.0, avec le compte de test : le propriétaire indique que tout fonctionne (ajout d'un fournisseur avec son propre numéro, « Appeler », « WhatsApp », recherche, modification, suppression). Non précisé : modèle du téléphone et navigateur.

Question du propriétaire à cette occasion : risque d'exposition des données des fournisseurs. Réponse donnée : données protégées par les règles (seul le compte propriétaire les lit ; vérifié par `tests-regles.html` et le second compte de test), aucune donnée dans le dépôt public, échanges chiffrés, affichage toujours en texte. Risques restants notés dans le README (« Appareil partagé », « Sécurité du compte ») et proposition en section 4 (effacer les données de l'appareil à la déconnexion).

**Phase terminée le 2026-11-18.**

### Étape intermédiaire : identité visuelle MinStock

Demandée par le propriétaire le 2026-11-18, avant la phase 7, avec son logo (fichier JPEG « MinStock Logo », 1536 × 1536) et sa maquette « MinStock – UI mobile glossy » (PDF de 8 pages : 7 écrans de téléphone et une planche pour ordinateur). Consigne du propriétaire : garder les options et réglages convenus, travail « propre et épuré ». Décisions 55 à 58.

**Compte rendu (2026-11-18)**

Ce qui a été fait :

- Nom « MinStock » : en-tête (symbole et nom en deux couleurs), onglet du navigateur, README.
- Symbole du logo redessiné en SVG (`images/logo-minstock.svg`, fond transparent), aussi utilisé comme icône d'onglet (pages de test comprises). Le JPEG d'origine n'est pas copié dans le dépôt.
- Police Montserrat téléchargée sur Google Fonts avec l'accord du propriétaire (`vendor/polices/montserrat-latin.woff2`, 37 956 octets, signature `wOF2` vérifiée, empreinte dans `vendor/LISEZMOI.md`) et sa licence `OFL-Montserrat.txt` ; `*.woff2` déclaré binaire dans `.gitattributes`.
- `css/style.css` réécrit avec les mêmes classes : couleurs en variables, fond dégradé léger, cartes claires très arrondies avec ombre douce, boutons principaux bleu nuit légèrement brillants, `+1` bleu plein, `−1` blanc, alertes sur fond teinté avec bordure de couleur et étiquette écrite, quantité colorée selon l'alerte, carte « Valeur du stock » bleu nuit, type de mouvement choisi entouré de bleu.
- Trois compteurs dans la carte de valeur (produits, « Stock bas », « Ruptures »), au singulier pour 0 et 1.
- Version `0.9.0`. Aucun changement des données ni des règles Firestore.

Tests exécutés par l'assistant, dans le navigateur intégré, sur `http://localhost:8080/`, avec le compte de test :

| Test | Résultat |
|---|---|
| Contrastes des couleurs proposées (calculés) : textes de 5,4 à 12,6, bordures d'alerte de 3,6 à 4,5 | Réussi |
| Police Montserrat chargée depuis le projet (aucun appel à Google pendant l'utilisation) | Réussi |
| Compteurs : 4 produits, 0 puis 1 « Stock bas » (produit d'essai passé de 7 à 5 pièces), 2 « Ruptures », conformes aux cartes affichées | Réussi |
| Écrans connexion, produits (carte normale, « Stock bas », « Rupture »), mouvement, historique (bouton d'annulation, « Annulée le »), paramètres, fournisseurs : affichage vérifié sur captures | Réussi |
| 360 pixels : aucun défilement horizontal sur les écrans produits, mouvement, fiche produit, historique, paramètres, fournisseurs ; boutons `−1` / `+1` de 56 × 48 pixels ; compteurs de 92 × 64 pixels | Réussi |
| En-tête aligné sur le contenu des écrans | Réussi (corrigé pendant les essais) |
| `tests-nombres.html` : 104 sur 104 | Réussi |
| Aucune erreur dans la console | Réussi |

Tests non exécutés : lecteur d'écran réel ; très grande taille de texte réglée dans le téléphone.

**Test sur smartphone (2026-11-18), fait par le propriétaire :** version 0.9.0 sur le site en ligne, avec le compte de test ; capture envoyée (en-tête MinStock, carte bleu nuit avec « 4 Produits », « 1 Stock bas », « 2 Ruptures », boutons). Le propriétaire indique que le résultat lui plaît, et demande que les compteurs soient cliquables pour afficher les produits concernés (décision 59). Non précisé : test en extérieur.

Constat : le produit « Essai phase 5 (stock bas) » du compte de test est revenu à 5 pièces (seuil 5), pour montrer l'alerte « Stock bas » (2 mouvements de plus).

**Compteurs cliquables (décision 59), 2026-11-18**

Demandés par le propriétaire après son test sur smartphone. Les trois compteurs de la carte de valeur sont devenus des boutons : « Stock bas » et « Ruptures » filtrent la liste, « Produits » et « Tout afficher » enlèvent le filtre. Version `0.9.1`. Fichiers : `index.html`, `css/style.css`, `js/ecran-produits.js`, `js/app.js`.

Tests exécutés par l'assistant, sur `http://localhost:8080/`, avec le compte de test :

| Test | Résultat |
|---|---|
| « Ruptures » : Ciment et Essai (zéro) seulement, « Filtre « Ruptures » : 2 produits affichés. », compteur mis en évidence, écran descendu jusqu'à la liste, total inchangé | Réussi |
| « Stock bas » : Essai (stock bas) seulement, « 1 produit affiché. » | Réussi |
| `+1` sur le produit filtré (5 → 6, sorti de l'alerte) : il reste affiché avec le focus sur `+1`, la ligne propose de retoucher « Stock bas » ; `−1` sur la même carte (6 → 5) : elle est toujours là | Réussi |
| Filtre vide : « Aucun produit en stock bas pour l'instant. », sans autre message | Réussi |
| Recherche dans un filtre (`cim` → Ciment ; `zzz` → « Aucun produit ne correspond ») ; choisir un filtre vide la recherche | Réussi |
| « Modifier » puis « Annuler » : le filtre reste ; « Ajouter un produit » : le filtre s'enlève | Réussi |
| « Tout afficher » et compteur « Produits » : les 4 produits, focus sur le titre « Produits », annonce pour les lecteurs d'écran | Réussi |
| Clavier : Entrée sur le compteur « Ruptures » applique le filtre, Tab mène à « Tout afficher » (contour visible) | Réussi |
| Déconnexion avec un filtre actif, puis reconnexion : plus de filtre | Réussi |
| 360 pixels : aucun défilement horizontal (écran des produits filtré, historique, fournisseurs, paramètres) ; compteurs de 92 × 64 pixels, « Tout afficher » de 48 pixels de haut | Réussi |
| Non-régression : `tests-nombres.html` 104 sur 104 ; `tests-regles.html` 90 sur 90 ; aucune erreur dans la console | Réussi |

Non testé : lecteur d'écran réel.

**Test sur smartphone (2026-11-18), fait par le propriétaire :** version 0.9.1 sur le site en ligne ; le propriétaire indique que les compteurs cliquables fonctionnent.

Question du propriétaire à cette occasion : pourquoi « Ciment » affiche des demi-sacs (7,5) après des `+1`. Vérifié sur le serveur, sans rien modifier : son stock de départ d'essai était de 12,5 sacs (phase 4b) ; chaque `+1` ajoute exactement 1 ; la somme des 14 mouvements du Ciment (7,5) et celle des 79 mouvements du Riz (4) sont égales aux quantités enregistrées. Correction possible pour un vrai produit : ajustement de `+0,5` ou `-0,5` avec un motif.

### Phase 7 : suppression du compte
- **Résultat :** double confirmation, rappel d'exporter, reconnexion demandée en premier, suppression en ligne uniquement, reprise automatique si `suppressionDemandee` est vrai. Les fournisseurs sont supprimés avec le reste (décision 42).
- **Tests (compte de test uniquement) :**
  - suppression complète ; données et compte disparus dans la console ;
  - suppression interrompue (fermer l'application au milieu), puis reprise à la connexion suivante ;
  - tentative hors ligne : refusée avec un message clair.

**Compte rendu de la phase 7 (2026-11-18)**

Choix validés par le propriétaire avant de coder : décisions 60 (double confirmation et reconnexion), 61 (règles version 7, dont le blocage des ajouts pendant une suppression), 62 (déroulement, effacement de la copie locale à la fin) et 63 (comptes jetables). Changement signalé au propriétaire après coup : les produits sont effacés **avant** les mouvements (et non après, comme dans le plan présenté), pour qu'un mouvement envoyé en retard par un autre appareil soit refusé sans ajouter de lecture à chaque mouvement (décision 62).

Ce qui a été fait :

- Règles Firestore **version 7** (publiées par le propriétaire le 2026-11-18) : demande de suppression `false → true` seule et sans retour ; entrepôt figé puis supprimable après la demande ; produits et mouvements supprimables seulement après la demande ; création de produit ou de fournisseur refusée si l'entrepôt n'existe pas ou si sa suppression est demandée.
- **Danger évité :** l'ancien essai « Demander la suppression du compte » de `tests-regles.html`, qui attendait un refus, aurait été accepté par la version 7 et aurait lancé la suppression du compte de test principal. Il a été retiré de la série habituelle avec « Supprimer son entrepôt » ; les deux sont refaits dans une série réservée aux comptes jetables. La série habituelle refuse en plus de tourner sur un compte en cours de suppression.
- `tests-regles.html` : série « suppression du compte » de 20 essais, lancée seulement avec un compte `test-suppression…@example.com` ; la série habituelle compte désormais 88 essais (91 si les produits d'essai sont à créer).
- Nouveaux fichiers `js/suppression-compte.js` (demande par transaction, effacement par paquets de 100, effacement de la copie locale) et `js/ecran-suppression.js` (écrans de confirmation et d'avancement, reprise, reconnexion pour la dernière étape) ; `js/auth.js` (reconnexion par mot de passe ou Google, suppression du compte de connexion) ; `js/app.js` (reprise automatique dès que `suppressionDemandee` est vrai, message après le rechargement) ; trois messages d'erreur ajoutés ; bloc « Supprimer mon compte » dans Paramètres et message sur l'écran de connexion.
- Version `0.10.0`.

Tests exécutés par l'assistant, sur `http://localhost:8080/`, avec le compte de test principal et trois comptes jetables créés pour l'occasion (accord du propriétaire) :

| Test | Résultat |
|---|---|
| Série habituelle de `tests-regles.html` avec les règles version 7 (compte principal) : 88 sur 88 | Réussi |
| Série « suppression du compte » (compte jetable 1) : 20 sur 20 — effacements refusés sans demande, demande accompagnée d'un autre changement refusée, demande acceptée, retour en arrière refusé, renommage refusé pendant la suppression, création de produit et de fournisseur refusée, effacement chez un autre compte refusé, lot de 4 effacements accepté, entrepôt supprimé après la demande, plus aucune création possible sans entrepôt | Réussi |
| Taille sûre des paquets (section 3, n° 3) : 120 produits créés, demande de suppression, **un lot de 100 suppressions accepté en une seconde** (la lecture de l'entrepôt faite par les règles n'est comptée qu'une fois par lot) ; paquets de 100 retenus | Réussi |
| Formulaire (compte jetable 2) : case non cochée, mot mal tapé, mot de passe vide, mauvais mot de passe : refusés avec « Rien n'a été supprimé », curseur sur le champ ; sur le serveur, aucune demande enregistrée ; « Annuler » ramène aux Paramètres | Réussi |
| Suppression complète (compte jetable 2, mot `supprimer` en minuscules accepté) : avancement Produits → Historique → Fournisseurs → Entrepôt → compte de connexion, 10 éléments (3 produits, 5 mouvements, 1 fournisseur, l'entrepôt) ; rechargement ; « Votre compte et toutes vos données ont été supprimés. » ; copie locale Firestore et marques locales effacées ; nouvelle connexion avec ce compte refusée | Réussi |
| Suppression interrompue (compte jetable 3) : arrêt dès le début, message « La suppression s'est arrêtée… » et bouton « Réessayer » ; page rechargée comme après une fermeture : l'application revient d'elle-même sur l'écran de suppression, termine (9 éléments et l'entrepôt), affiche le message final ; nouvelle connexion refusée | Réussi |
| Sans Internet (compte jetable 1) : navigateur hors ligne → « Pas de connexion Internet… Rien n'a été supprimé » ; réseau en panne pendant la reconnexion → même refus ; sur le serveur, aucune demande enregistrée | Réussi |
| 360 pixels : aucun défilement horizontal (Paramètres, confirmation, avancement) ; bouton « Supprimer définitivement » et champs de 48 pixels de haut | Réussi |
| Compte de test principal intact (« NzuriDeal », 4 produits, aucune demande de suppression) | Réussi |

Tests non exécutés :

- Smartphone du propriétaire, **avec un compte jetable uniquement**.
- Reconnexion par la fenêtre Google : aucun compte Google de test.
- Reconnexion demandée par Firebase pour la dernière étape (`auth/requires-recent-login`) : ne se produit qu'après plusieurs minutes ; écran prévu mais non déclenché.
- Coupure d'Internet réelle (mode avion) pendant la suppression ; deux appareils connectés au même compte pendant la suppression ; reprise « Terminer la suppression » quand seul le compte de connexion reste.
- Constat d'essai : couper le réseau de Firestore depuis la page n'empêche pas les transactions ; le premier essai « sans réseau » a donc réellement envoyé la demande du compte jetable 3, ce qui a servi d'essai de suppression interrompue. Le refus sans Internet a ensuite été vérifié autrement (voir le tableau).

**Test sur smartphone (2026-11-18), fait par le propriétaire :** version 0.10.0 sur le site en ligne, avec un compte jetable créé sur le téléphone ; le propriétaire indique que tout fonctionne (création du compte et de l'entrepôt, ajout d'un produit, suppression complète, retour à l'écran de connexion avec le message). Non précisé : adresse exacte du compte jetable utilisé.

**Phase terminée le 2026-11-18.**

### Phase 8 : hors ligne et indicateur
- **Résultat :** indicateur à quatre états, présenté comme approximatif ; messages pour les opérations refusées et « déjà enregistrées » ; avertissement avant déconnexion s'il reste des écritures en attente ; demande de stockage persistant au navigateur ; mention « En attente de synchronisation » qui ne fait plus bouger les boutons placés en dessous (défaut constaté au test sur smartphone de la phase 5).
- **Tests :** étapes 1 à 7 et 9 à 11 de `DEMARRAGE.md` section 9 (application restée ouverte). L'étape 8 (rouvrir en mode avion) est testée en phase 10.

**Plan présenté au propriétaire le 2026-11-18, accepté le 2026-11-19 (« Oui, commence ») : décisions 64 à 68**

Quatre choix recommandés par l'assistant, à valider :

1. **Indicateur dans l'en-tête**, à droite du logo (comme la maquette) : mot écrit et pastille de couleur — « Synchronisé », « En attente de synchronisation », « Hors ligne » (avec une ligne « des modifications attendent d'être envoyées », sans nombre), « Erreur de synchronisation » (un toucher mène au bloc « Opérations refusées »). Un toucher affiche une courte explication : indicateur approximatif. Une à deux secondes d'attente avant de changer d'état, pour éviter le clignotement. Calcul prévu : erreur si une opération est refusée ; sinon hors ligne si `navigator.onLine` est faux ou si les données ne viennent que de la mémoire de l'appareil (de façon durable) ; sinon en attente si `hasPendingWrites` ; sinon synchronisé.
2. **« En attente » à la place du mot « Quantité »** dans la fiche du produit (même ligne), au lieu de la ligne ajoutée qui fait bouger les boutons (section 5, point 7).
3. **Avertissement avant « Se déconnecter »** s'il reste des modifications non envoyées : elles restent sur l'appareil et partiront à la prochaine connexion ici, mais seraient perdues si les données du navigateur étaient effacées.
4. **Nouvelle option dans Paramètres : « Effacer les données de cet appareil et me déconnecter »** (appareils partagés, section 4), refusée tant que des modifications attendent ; réutilise l'effacement de la copie locale de la phase 7.

En plus, sans changement visible : demande de stockage persistant au navigateur (`navigator.storage.persist()`). Aucune modification des règles Firestore. Fichiers prévus : nouveau `js/indicateur-synchro.js` ; `index.html`, `css/style.css`, `js/app.js`, `js/ecran-produits.js`, `js/ecran-mouvements.js`, `js/produits.js`, `js/mouvements.js`, `js/ecran-parametres.js` ; version `0.11.0`. Essais : coupures simulées sur l'ordinateur (attention : `disableNetwork` de Firestore ne bloque pas les transactions, voir 8.5) ; vrai essai en mode avion par le propriétaire sur son téléphone, avec un guide pas à pas.

**Compte rendu de la phase 8 (2026-11-19)**

Choix validés par le propriétaire le 2026-11-19 : décisions 64 à 68. Le même jour, il a demandé et accepté la phase 8b (décision 69) et l'écartement du PEPS par lots, de la rotation, de l'EOQ et des notifications (décision 70). Les règles Firestore ne changent pas (version 7).

Ce qui a été fait :

- Nouveau `js/indicateur-synchro.js` : quatre états, délai d'affichage (1,5 s ; 3 s pour un « Hors ligne » déduit de la mémoire de l'appareil), explication au toucher, accès direct au bloc « Opérations refusées » en cas d'erreur. Sources : `navigator.onLine`, métadonnées des écoutes existantes (entrepôt, produits, mouvements, fournisseurs), file d'envoi de Firebase (`waitForPendingWrites`, vérifiée toutes les 3 secondes, opération locale et gratuite : elle couvre aussi un archivage ou une suppression de fournisseur, que les écoutes ne voient plus). Aucune lecture de plus.
- En-tête : indicateur de hauteur fixe (48 pixels) à droite du logo ; explication sous l'en-tête.
- Fiche produit : « En attente » à la place de « Quantité » (décision 65) ; la ligne ajoutée est supprimée. L'historique et les fournisseurs gardent leur ligne « En attente de synchronisation » (leurs boutons ne sont pas touchés au même moment).
- « Se déconnecter » : vérification de la file d'envoi (2 secondes au plus), puis question si des modifications attendent (décision 66).
- Paramètres, bloc « Appareil partagé » placé avant « Supprimer mon compte » : effacement refusé si des modifications de ce compte attendent, ou si un autre compte a des opérations notées « en attente » sur l'appareil (sa copie serait effacée aussi) ; sinon question, arrêt des écoutes, déconnexion, effacement de la copie (fonction de la phase 7), rechargement et message sur l'écran de connexion (décision 67).
- Stockage durable demandé une fois l'entrepôt chargé (décision 68) ; résultat noté dans la console.
- `js/operations-en-attente.js` : plusieurs fonctions peuvent suivre les changements de la liste (bloc des refus et indicateur) ; nouvelle fonction qui repère les opérations en attente des autres comptes.
- Version `0.11.0`.

Tests exécutés par l'assistant, dans le navigateur intégré, sur `http://localhost:8080/`, avec le compte `test-phase3@example.com`, à 360 pixels de large :

| Test | Résultat |
|---|---|
| Connexion : indicateur « Synchronisé » ; caché sur les écrans sans compte | Réussi |
| En-tête : hauteur fixe de 48 pixels pour les quatre états ; « En attente de synchronisation » sur deux lignes ; aucun défilement horizontal | Réussi |
| Réseau de Firestore coupé (`disableNetwork`) : « Hors ligne » au bout de 3 secondes | Réussi |
| `+1` sur « Ciment » sans réseau : « En attente » à la place de « Quantité », de 7,5 à 8,5 sac ; positions des boutons `−1`, `+1`, « Mouvement de stock », « Modifier » et de la carte suivante **identiques au pixel près** ; indicateur « Hors ligne », « Envoi en attente » | Réussi |
| Toucher l'indicateur : explication avec « Des modifications attendent d'être envoyées » ; second toucher : fermée | Réussi |
| « Se déconnecter » avec une modification non envoyée : « Vérification… », puis question ; réponse « Annuler » : toujours connecté | Réussi |
| « Effacer les données de cet appareil » avec une modification non envoyée : refusé avec explication, aucune question posée | Réussi |
| Réseau rétabli : « Synchronisé » au bout de 3 secondes ; « Quantité » revient ; 8 500 millièmes sur le serveur | Réussi |
| `navigator.onLine` forcé à faux : « Hors ligne » au bout de 1,5 seconde ; retour à « Synchronisé » après rétablissement | Réussi |
| Refus simulé (opération sur un document inexistant) : « Erreur de synchronisation » ; toucher depuis l'historique : écran des produits, bloc « Opérations refusées » en haut, focus sur son titre ; « J'ai noté » : retour à « Synchronisé » | Réussi |
| `−1` avec Internet : l'indicateur reste sur « Synchronisé » (pas de clignotement), la fiche affiche « En attente » un instant ; « Ciment » revenu à 7,5 sac | Réussi |
| Effacement de l'appareil sans modification en attente : question, déconnexion, rechargement, message « Les données de cet appareil ont été effacées… » ; base locale Firestore supprimée du navigateur | Réussi |
| Opération « en attente » simulée pour un autre compte : effacement refusé avec explication ; sans elle, la question s'affiche et « Annuler » ne fait rien | Réussi |
| « Se déconnecter » sans modification en attente : aucune question | Réussi |
| Paramètres à 360 pixels : bloc « Appareil partagé », bouton de 70 pixels de haut (deux lignes), aucun défilement horizontal | Réussi |
| Non-régression : `tests-nombres.html` 104 sur 104 ; `tests-regles.html` 88 sur 88 | Réussi |
| Console : aucune erreur de l'application (seulement l'erreur du refus simulé, provoquée par l'essai) | Réussi |

Tests non exécutés (à faire par le propriétaire, guide donné le 2026-11-19) :

- Vrai mode avion sur le téléphone (`DEMARRAGE.md`, section 9, étapes 1 à 7 et 9 à 11), dont l'affichage des deux heures quand l'écart dépasse 5 minutes, la liste des fournisseurs et « Voir plus » sans Internet.
- Wi-Fi sans Internet (délai réel avant « Hors ligne »).
- Deux appareils sur le même compte.
- Stockage durable : refusé par le navigateur intégré (« non » dans la console) ; résultat sur le téléphone inconnu.
- Lecteur d'écran réel.

Constats :

- Le compte de test contient 2 mouvements de plus sur « Ciment » (+1 puis −1), plus 5 de `tests-regles.html`. La copie locale du navigateur intégré a été effacée par l'essai, puis rechargée.
- La liste « en attente » simulée pour un autre compte et l'opération refusée simulée ont été retirées après les essais.
- `disableNetwork` a suffi pour ces essais (aucune transaction en jeu) ; il ne remplace pas le vrai mode avion.

**Essai en mode avion sur smartphone (2026-11-19), fait par le propriétaire**

Sur `https://saintfranckinder.github.io/minstock/`, version 0.11.0 affichée, avec le compte de test (six captures d'écran envoyées à l'assistant) :

- Mode avion : l'indicateur affiche « Hors ligne » ; l'écran « Fournisseurs » et l'historique restent affichés depuis la mémoire du téléphone.
- `+1` sur « Essai phase 5 (zéro) » sans Internet : « En attente » à la place de « Quantité », 8 pièces ; écran des produits avec « Hors ligne » et « Envoi en attente » ; compteurs et valeur du stock (12 403,00 HTG) affichés.
- Paramètres sans Internet : « Effacer les données de cet appareil » refusé avec le message prévu.
- Retour d'Internet : l'indicateur affiche « Synchronisé » ; l'historique montre « Entrée : +1 pièce », « Fait le 19/11/2026 01:59 » **et** « Reçu par le serveur le 19/11/2026 02:11 » (écart de plus de 5 minutes : les deux heures sont affichées, test en attente depuis la phase 4b), avec le bouton « Annuler cette opération ».

Confirmé ensuite par le propriétaire : la question avant « Se déconnecter » est apparue sur le téléphone ; téléphone **Moto G Stylus 2024**, navigateur **Chrome**. Non précisé : `−1` final ; « Voir plus » sans Internet ; retour visible de « Quantité » sur la fiche. Le produit d'essai « Essai phase 5 (zéro) » est à 8 pièces (il était déjà à 7 avant l'essai, à la suite d'essais précédents du propriétaire).

**Phase terminée le 2026-11-19.**

### Phase 6c : carnet de clients
- **Demandée par le propriétaire le 2026-11-20**, avant la phase 8b (décisions 72 et 73). Choix du propriétaire : bouton « Clients », pas de case VIP.
- **Résultat :** copie du carnet de fournisseurs sans « produits fournis » ; recherche par nom ou dans les notes ; règles version 8 ; la suppression du compte efface aussi les clients ; texte de confidentialité complété.
- **Tests :** `tests-regles.html` (série habituelle et série « suppression ») ; ajout, modification, suppression dans l'application ; effacement des clients par la suppression du compte ; 360 pixels ; smartphone.

**Compte rendu de la phase 6c (2026-11-20)**

Ce qui a été fait :

- Nouveaux fichiers `js/clients.js` et `js/ecran-clients.js`, copiés et adaptés de ceux des fournisseurs, **sans modifier le code des fournisseurs** (seules les constantes `CARACTERES_TELEPHONE` et `FORME_EMAIL` sont importées de `js/fournisseurs.js`).
- `index.html` : bouton « Clients » sous « Fournisseurs », écrans « Clients » et « Ajouter / Modifier un client », aide « écrivez VIP dans les notes, puis cherchez vip » ; texte de confidentialité, « Appareil partagé », « Supprimer mon compte » et liste de l'écran de suppression complétés.
- Règles Firestore **version 8** : bloc `users/{uid}/clients` (huit champs exactement, limites de la décision 54, dates du serveur, création refusée si le compte est supprimé ou en cours de suppression, suppression par le propriétaire). Le reste est identique à la version 7. **Publiées par le propriétaire le 2026-11-20.**
- `js/suppression-compte.js` : étape « Clients » ajoutée après « Fournisseurs ».
- `js/app.js` : branchement des écrans clients ; version `0.12.0`. L'indicateur de synchronisation suit aussi la liste des clients.
- `tests-regles.html` : 17 essais de plus dans la série habituelle (105, ou 108 quand les produits d'essai sont à créer) et 2 dans la série « suppression » (22).
- `CLAUDE.md` mis à jour avec l'accord du propriétaire (sections 4, 5, 8, 10 et 12) ; README.

Tests exécutés par l'assistant, dans le navigateur intégré, sur `http://localhost:8080/` :

| Test | Résultat |
|---|---|
| Avant la publication des règles : écran « Clients » avec « Impossible de charger les clients… règles de sécurité (version 8)… » ; fournisseurs et reste de l'application normaux | Réussi |
| Formulaire : nom vide, nom de 101 caractères, lettres dans le téléphone, `#` dans WhatsApp, e-mail sans point, notes de 1 001 caractères refusés, curseur sur le champ ; longueurs maximales des champs | Réussi |
| `tests-regles.html` (compte `test-phase3@example.com`) : **105 sur 105**, dont les 17 essais des clients (champ des fournisseurs, champ manquant, nom, téléphone, e-mail, notes, dates, autre compte refusés) | Réussi |
| `tests-regles.html` (compte jetable `test-suppression-1@example.com`) : **22 sur 22**, dont création d'un client refusée pendant la suppression et effacement d'un client dans le lot | Réussi |
| Ajout de deux clients : « En attente de synchronisation » puis confirmation ; sur le serveur, exactement les huit champs, nom sans espaces autour, champs vides en chaînes vides, adresse sur deux lignes | Réussi |
| Liens : `tel:+50937123456`, `https://wa.me/50937123456`, `mailto:…` ; WhatsApp sans indicatif : pas de bouton, phrase d'aide | Réussi |
| Nom en double (majuscules et accent différents) : avertissement avec le nom existant ; « Annuler » : rien n'est ajouté | Réussi |
| Recherche : `vip` et `  VÍP ` (notes), `jean` (nom), `zzz` (« Aucun client ne correspond ») | Réussi |
| Modification : notes et WhatsApp changés sur le serveur, date de modification mise à jour, pas d'avertissement pour son propre nom | Réussi |
| Client supprimé « ailleurs » pendant que son formulaire est ouvert : retour à la liste avec un message | Réussi |
| Suppression : « Annuler » ne fait rien ; confirmation : client effacé du serveur (0 client restant) | Réussi |
| Effacement par le module de suppression du compte (`demanderSuppression` puis `supprimerLesDonnees`, compte jetable, sans supprimer le compte de connexion) : étapes Produits → Historique → Fournisseurs → **Clients** → Entrepôt ; 3 clients, 1 fournisseur, 1 produit et l'entrepôt effacés ; plus aucun client sur le serveur | Réussi |
| 360 pixels : boutons « Historique », « Fournisseurs », « Clients » de 48 pixels de haut ; liens de contact de 48 pixels ; aucun défilement horizontal | Réussi |
| Non-régression : `tests-nombres.html` 104 sur 104 ; fournisseurs affichés normalement | Réussi |
| Console après rechargement : aucune erreur (les deux refus notés plus tôt venaient de l'écran Clients avant la publication des règles) | Réussi |

Tests non exécutés :

- Smartphone (après **Push origin**).
- Second compte qui ouvre l'écran « Clients » : l'isolation est vérifiée par les règles (lecture et création chez un autre compte refusées), pas dans l'écran.
- Parcours complet « Supprimer mon compte » dans l'application avec des clients : le module d'effacement a été essayé directement (voir le tableau) pour ne pas consommer de compte jetable ; le parcours complet a été essayé en phase 7.
- Clients sans Internet et sur deux appareils : même code que les fournisseurs.

Constats :

- Le compte de test principal n'a aucun client (les clients d'essai ont été supprimés). Le compte jetable `test-suppression-1@example.com` n'a plus d'entrepôt (remis à zéro par les essais) ; son compte de connexion est intact.
- Pour ne pas déclencher la reprise automatique de la suppression (qui effacerait aussi le compte de connexion), le compte jetable a été connecté directement dans la page `tests-regles.html`, jamais dans l'application.

**Test sur smartphone (2026-11-20), fait par le propriétaire :** version 0.12.0 sur le site en ligne (Moto G Stylus 2024, Chrome), avec le compte de test ; le propriétaire indique que le test est réussi (guide donné : ajout d'un client avec son propre numéro et « VIP » dans les notes, « Appeler », « WhatsApp », recherche `vip`, modification, suppression). Non précisé : détail de chaque étape.

**Phase terminée le 2026-11-20.**

### Étape intermédiaire : accueil épuré

Demandée par le propriétaire le 2026-11-20, avec sa maquette « MinStock, accueil épuré » (PDF de 2 pages : accueil, fiche d'un produit). Consigne : garder l'identité visuelle exactement. Décision 74 (ajustements acceptés : boutons de 48 pixels, nom sur deux lignes, « Achat » devant le prix, alertes et « En attente » sans faire bouger la ligne, barre en bas ; modifie la décision 56).

**Compte rendu (2026-11-20)**

Ce qui a été fait :

- En-tête : bouton ⚙ (Paramètres) à droite de l'indicateur ; libellés courts de l'indicateur (« Synchronisé », « En attente », « Hors ligne » / « À envoyer », « Erreur ») pour garder 48 pixels de haut à 360 pixels de large ; noms complets dans l'explication et pour les lecteurs d'écran.
- Accueil : carte de valeur avec ⓘ (explication repliée), recherche avec loupe, une ligne par produit dans une seule carte, bouton rond « + », barre de navigation en bas. Devise, adresse, version et « Se déconnecter » retirés de l'accueil ; adresse, « Se déconnecter » et version ajoutés dans Paramètres (bloc « Compte »).
- Fiche du produit : `<dialog>` qui monte du bas (`−1` / `+1`, alertes, seuil, prix d'achat, valeur, « Mouvement de stock », « Modifier ») ; fermeture par ✕, le fond, Échap ; le focus revient sur la ligne du produit. **Pas d'animation** : dans un onglet en arrière-plan, l'animation restait bloquée au départ et le panneau restait hors de l'écran.
- Navigation : les boutons de la barre reprennent les identifiants des anciens boutons de l'accueil (`bouton-historique`, `bouton-fournisseurs`, `bouton-clients`), le bouton ⚙ celui de `bouton-parametres` : les écrans s'ouvrent comme avant. Quitter les fournisseurs ou les clients par la barre ou par ⚙ arrête l'écoute de leur liste (nouvelles fonctions `quitterEcranFournisseurs` et `quitterEcranClients`). `afficherVue` prévient la barre par un événement `vue-changee`.
- Icônes dessinées en SVG dans `index.html` (aucune bibliothèque).
- Les écrans Mouvements, Fournisseurs, Clients et Paramètres gardent leur bouton « Retour aux produits ».
- Version `0.13.0`. Aucun changement des données ni des règles Firestore.

Tests exécutés par l'assistant, dans le navigateur intégré, sur `http://localhost:8080/`, avec le compte de test, à 360 pixels de large :

| Test | Résultat |
|---|---|
| En-tête : 48 pixels de haut pour les cinq affichages de l'indicateur (dont « Hors ligne » + « À envoyer ») ; ⚙ de 48 × 48 ; aucun défilement horizontal | Réussi (corrigé pendant les essais : « Envoi en attente » passait sur deux lignes et faisait descendre la page de 6 pixels) |
| Accueil : 4 produits sur une page (85 à 106 pixels par ligne au lieu d'environ 320) ; `−1` / `+1` de 48 × 48 ; recherche de 48 pixels ; barre de 4 boutons de 88 × 60 ; bouton rond de 56 × 56 ; dernière ligne visible au-dessus du bouton rond et de la barre en bas de page | Réussi |
| `+1` sans réseau : « En attente de synchronisation » à la place de « Achat … » ; positions et hauteurs de **toutes** les lignes et des boutons **identiques au pixel près** | Réussi |
| Indicateur : « Hors ligne » à 3 s, « À envoyer » ensuite, « Synchronisé » au retour du réseau | Réussi |
| Fiche : ouverture, contenu (titre, quantité, « sac en stock », seuil, prix, valeur) ; `+1` dans la fiche : « pièce · en attente », la ligne derrière se met à jour, les boutons de la fiche ne bougent pas ; `−1` : retour à la valeur de départ | Réussi |
| Fermeture par ✕ (focus sur la ligne, même reconstruite), par le fond gris, par Échap ; un toucher dans le panneau ne le ferme pas | Réussi |
| 5 appuis rapides sur `+1` puis 5 sur `−1` : de 7 à 12 puis 7 ; focus resté sur le bouton ; sur le serveur, 7 000 millièmes | Réussi |
| Alerte « Stock bas » (7 → 5) : fond orangé, trait à gauche, étiquette « Stock bas », compteur à 1 ; les boutons de la ligne ne bougent pas, la ligne s'agrandit vers le bas ; quantité remise à 7 | Réussi |
| ⓘ : explication ouverte puis fermée (`aria-expanded`) ; filtres « Ruptures » et « Produits » ; recherche `cim` et `zzz` | Réussi |
| Bouton rond : formulaire « Ajouter un produit », barre et ⚙ cachés ; « Annuler » : retour à l'accueil | Réussi |
| Barre : Fournisseurs → Clients (la liste des fournisseurs est vidée : écoute arrêtée) → Mouvements → Stock ; bouton actif mis en évidence | Réussi |
| ⚙ : Paramètres avec l'adresse du compte, « Se déconnecter », la version ; barre et ⚙ cachés ; pied de page caché une fois connecté | Réussi |
| « Se déconnecter » (Paramètres) avec une modification non envoyée : question de la décision 66 ; « Annuler » : toujours connecté | Réussi |
| Non-régression : `tests-nombres.html` 104 sur 104 ; console d'une page neuve sans erreur | Réussi |

Tests non exécutés :

- Smartphone (après **Push origin**) : notamment le bouton retour du téléphone pour fermer la fiche (Chrome sur Android le gère pour les `<dialog>`, non vérifié ici).
- `tests-regles.html` : inutile, aucune règle ni donnée ne change.
- Lecteur d'écran réel.

Constats :

- Le bouton rond passe par-dessus la droite de la liste (comme dans la maquette) : une ligne juste derrière lui a son `+1` caché ; faire défiler un peu. Noté dans le README.
- Dans un onglet en arrière-plan du navigateur intégré, les minuteries et les événements sont ralentis : les essais doivent se faire dans l'onglet au premier plan.

**Haut figé et bouton retour (décision 75), 2026-11-20**

Demandés par le propriétaire après son essai de la version 0.13.0 sur son téléphone (capture : l'en-tête, le nom de l'entrepôt, la carte et la recherche défilaient avec la liste). Choix validés : tout figé sur l'accueil (en connaissant la limite d'environ 4 produits visibles sur 412 × 800, mesurée avant de coder), bouton retour du téléphone et flèche ← à la place de « Retour aux produits ».

Ce qui a été fait :

- En-tête en `position: sticky` ; bloc `.haut-fixe` collé sous l'en-tête sur l'accueil (nom, carte, recherche), Fournisseurs et Clients (titre, « Ajouter », recherche avec loupe), Mouvements et Paramètres (titre). Fond en dégradé qui prolonge celui de la page ; légère ombre en bas. Les messages et le bloc « Opérations refusées » sont passés sous la partie figée. La hauteur de l'en-tête est suivie (`ResizeObserver`, variable `--hauteur-entete`) pour l'explication de l'indicateur.
- Flèche ← (`bouton-icone`) à gauche du titre, avec les identifiants des anciens boutons « Retour aux produits ».
- Bouton retour du téléphone (`js/app.js`) : écrans de niveau 0 (accueil, connexion…), 1 (Mouvements, Fournisseurs, Clients, Paramètres, formulaires produit et mouvement, inscription, mot de passe oublié, confidentialité) et 2 (formulaires fournisseur et client, « Supprimer mon compte ») ; une entrée d'historique par niveau, ajoutée au moment du toucher (Chrome ignore au retour les entrées ajoutées sans geste de l'utilisateur) ; le retour « touche » le bouton de retour de l'écran (← ou « Annuler ») ; revenir à un écran moins profond par un bouton de l'application retire les entrées en trop.
- « Choisir un filtre » et le toucher sur « Erreur » remontent simplement en haut de la page (la liste commence sous la partie figée).
- Version `0.14.0`. Aucun changement des données ni des règles.

Tests exécutés par l'assistant, sur `http://localhost:8080/`, avec le compte de test (412 × 800 et 360 × 780) :

| Test | Résultat |
|---|---|
| Défilement de l'accueil : en-tête à 0, partie figée de 68 à 401 pixels, la liste passe dessous ; aucun défilement horizontal | Réussi |
| Retour : Fournisseurs → accueil (liste des fournisseurs vidée : écoute arrêtée) ; formulaire fournisseur → liste → accueil (rien d'enregistré) ; Fournisseurs puis Clients → accueil ; ⚙ puis « Supprimer mon compte » → Paramètres → accueil ; bouton rond → accueil | Réussi |
| Historique du navigateur : état vide sur l'accueil après chaque retour, ou après « Stock » de la barre et la flèche ← ; il ne grandit pas d'un aller-retour à l'autre | Réussi |
| Flèche ← de 48 × 48 sur Fournisseurs, Clients, Mouvements, Paramètres ; aucun défilement horizontal à 360 pixels | Réussi |
| Console d'une page neuve sans erreur | Réussi |

Tests non exécutés : vrai bouton retour d'Android (simulé ici par `history.back()`), dont la fermeture de la fiche d'un produit par le retour (gérée par Chrome pour les `<dialog>`) ; clavier ouvert sur la recherche avec tout figé.

Le propriétaire a essayé la version 0.14.0 sur son téléphone : « ça fonctionne », mais la partie figée prend trop de place ; options analysées et mesurées, A + B + C choisies (décision 76).

**Moins de place pour la partie figée (décision 76), 2026-11-20**

Ce qui a été fait (styles, `index.html`, une ligne dans `js/ecran-produits.js`) :

- A : marge du haut de l'en-tête (68 → 60 pixels) ; marges sous le nom, la carte et la recherche ; ligne du titre de la carte de 48 à 32 pixels (ⓘ toujours de 48 × 48, en débordant sur la marge) ; compteurs de 64 à 55 pixels (toujours au moins 48).
- B : classe `recherche-active` sur l'accueil tant que la recherche contient du texte : la carte de valeur est masquée. Elle ne dépend ni du focus ni du clavier, pour que la liste ne bouge pas quand on touche `+1` dans les résultats.
- C : « Ajouter un fournisseur » et « Ajouter un client » deviennent le bouton rond « + » (mêmes identifiants : rien ne change dans leurs fichiers) ; texte d'aide des listes vides adapté.
- Version `0.15.0`.

Tests exécutés par l'assistant (412 × 800, puis 360 × 780) :

| Test | Résultat |
|---|---|
| Place pour la liste sur l'accueil : **387 pixels au lieu de 316** (412 × 800), 368 à 360 × 780 ; partie figée de 275 pixels au lieu de 333 | Réussi |
| ⓘ de 48 × 48 ; compteurs de 109 × 55 | Réussi |
| Recherche : champ touché sans texte → carte visible ; une lettre → carte repliée, liste dès 173 pixels du haut ; `+1` touché dans les résultats → rien ne bouge ; champ vidé → carte revenue | Réussi |
| Fournisseurs : partie figée de 119 pixels au lieu de 193 ; Clients : 61 ; bouton rond de 56 × 56, un seul visible à la fois ; il ouvre le formulaire ; retour → liste | Réussi |
| Aucun défilement horizontal ; console d'une page neuve sans erreur | Réussi |

**Test sur smartphone (2026-11-20), fait par le propriétaire :** version 0.15.0 sur le site en ligne (Moto G Stylus 2024, Chrome) ; le propriétaire indique que le test est réussi (guide donné : place gagnée, recherche avec le clavier et carte repliée, bouton rond sur Fournisseurs et Clients, bouton retour du téléphone, fiche d'un produit fermée par le retour). Non précisé : détail de chaque étape.

**Étape terminée le 2026-11-20** (accueil épuré, haut figé, bouton retour, partie figée réduite : décisions 74 à 76).

### Étape intermédiaire : boutons de contact en icônes (décision 77)

Demande du propriétaire du 2026-11-21, avant la phase 8b : remplacer les mots « Appeler », « WhatsApp » et « E-mail » des carnets de fournisseurs et de clients par des icônes, avec le nom écrit dessous, dans un style minimaliste et épuré fidèle à l'identité visuelle.

**Compte rendu (2026-11-21)**

Ce qui a été fait :

- `index.html` : une réserve d'icônes invisible (`<svg class="sprite-icones">`, au début de `<body>`) avec trois dessins faits pour l'application, dans le style des autres icônes (traits arrondis) : combiné de téléphone (`icone-appeler`), bulle avec un combiné (`icone-whatsapp`), enveloppe (`icone-email`). Rien n'est chargé depuis Internet.
- `js/ecran-fournisseurs.js` et `js/ecran-clients.js` : seule la fonction `lienContact` change (icône + nom dessous, classe `lien-contact`). Inchangés : adresses des liens (`tel:`, `https://wa.me/`, `mailto:`), règle du bouton WhatsApp (indicatif du pays), noms complets pour les lecteurs d'écran (`aria-label`), ouverture de WhatsApp dans un nouvel onglet.
- `css/style.css` : icône bleue (`--accent`) dans une pastille bleu clair, comme l'écran actif de la barre de navigation ; nom en bleu nuit, 13 pixels, gras ; boutons alignés à gauche, sans bordure.
- Version `0.15.1`. Aucune donnée, aucune règle Firestore, aucun autre écran touché.
- Libellés gardés tels qu'ils étaient : « Appeler », « WhatsApp », « E-mail » (le propriétaire avait écrit « Appelez » et « Email » ; l'assistant a gardé les mots déjà utilisés dans l'application, modifiables en une ligne si le propriétaire préfère).

Tests exécutés par l'assistant, dans le navigateur intégré, sur `http://localhost:8080/`, avec le compte de test, à 360 × 780 puis sur grand écran :

| Test | Résultat |
|---|---|
| Fournisseur existant (téléphone et WhatsApp) : icônes « Appeler » et « WhatsApp » avec leur nom | Réussi |
| Client d'essai avec téléphone, WhatsApp `+509…` et e-mail : trois boutons côte à côte, chacun de 93 × 72 pixels (pastille de 64 × 40) | Réussi |
| Adresses des liens identiques à avant : `tel:37000000`, `https://wa.me/50937000000` (nouvel onglet, `noopener noreferrer`), `mailto:essai@example.com` ; noms complets pour les lecteurs d'écran conservés | Réussi |
| WhatsApp sans indicatif : bouton absent et phrase d'aide affichée ; « Appeler » et « E-mail » restent | Réussi |
| Contour de focus visible au clavier (touche Tab) | Réussi |
| Contraste : icône `#2E618D` sur pastille `#E4EBF2` : 5,4 (au moins 3 pour un dessin) ; nom en `#213547` sur fond blanc | Réussi |
| Aucun défilement horizontal ; en-tête toujours en haut ; réserve d'icônes de 0 × 0 pixel ; console sans erreur | Réussi |
| Client d'essai « Essai icônes (à supprimer) » supprimé ensuite : le compte de test n'a toujours aucun client | Réussi |

Tests non exécutés :

- Smartphone : à faire par le propriétaire (toucher chaque icône ouvre Téléphone, WhatsApp, E-mail).
- Lecteur d'écran réel : noms vérifiés par programme seulement.

**Correction de la disposition (2026-11-21, version 0.15.2)**

Le propriétaire a envoyé une capture de la version 0.15.1 sur son téléphone (fournisseur avec téléphone, WhatsApp et e-mail) : les trois boutons, alignés à gauche, laissaient un vide à droite et paraissaient déséquilibrés. Il a demandé une grille de trois colonnes égales, des boutons de même taille centrés dans leur colonne, un écart constant, une largeur maximale du groupe et aucun débordement, sans toucher aux couleurs, aux icônes ni aux formes.

Ce qui a été fait :

- `css/style.css` : `.liens-contact` devient une grille `repeat(3, minmax(0, 1fr))`, écart `clamp(0.5rem, 4vw, 1.5rem)` (8 à 24 pixels selon la largeur), 20rem (320 pixels) au plus, centrée dans la carte ; chaque bouton : largeur de sa colonne, 6rem (96 pixels) au plus, centré ; colonne fixe par bouton (`lien-contact-appeler` 1, `lien-contact-whatsapp` 2, `lien-contact-email` 3).
- `js/ecran-fournisseurs.js` et `js/ecran-clients.js` : une ligne chacun, la classe de la colonne ajoutée au bouton.
- Version `0.15.2`.

Tests exécutés par l'assistant, sur `http://localhost:8080/`, avec le compte de test (fournisseur du propriétaire avec les trois boutons) :

| Test | Résultat |
|---|---|
| 412 × 800 (téléphone du propriétaire) : groupe de 320 pixels centré (30 pixels de chaque côté dans la carte) ; boutons de 96 × 72 ; « WhatsApp » exactement au centre de la carte ; écart de 16 pixels | Réussi |
| 360 × 780 : groupe de 294 pixels (toute la largeur utile), boutons de 89 × 72, écart de 14 pixels, « WhatsApp » au centre | Réussi |
| Grand écran (1280 pixels) : groupe limité à 320 pixels, centré ; écart de 24 pixels | Réussi |
| Chaque nom centré exactement sous sa pastille | Réussi |
| Sans bouton WhatsApp (masqué pour l'essai) : « Appeler » reste à gauche et « E-mail » à droite, de façon symétrique | Réussi |
| Aucun défilement horizontal ; console sans erreur ; « Version 0.15.2 » dans Paramètres | Réussi |

Tests non exécutés : smartphone (version 0.15.2), à faire par le propriétaire.

**Même équilibre avec deux boutons (2026-11-21, version 0.15.3)**

Demande du propriétaire : garder le même principe d'alignement quand il n'y a que deux boutons. Avec la version 0.15.2, chaque bouton gardait sa colonne : deux boutons laissaient une colonne vide (au milieu ou à droite).

Ce qui a été fait :

- `css/style.css` : la grille crée une colonne par bouton présent (`grid-auto-flow: column`, `grid-auto-columns: minmax(0, 6rem)`), toutes de la même largeur, et centre le groupe (`justify-content: center`) ; même écart qu'avant (8 à 24 pixels). Les règles de colonne fixe sont retirées.
- `js/ecran-fournisseurs.js` et `js/ecran-clients.js` : la classe de colonne ajoutée en 0.15.2 est retirée (classe `lien-contact` seule, comme en 0.15.1).
- Version `0.15.3`.

Tests exécutés par l'assistant, sur `http://localhost:8080/`, avec le fournisseur du propriétaire (trois boutons ; les cas à un et deux boutons sont obtenus en masquant des boutons dans la page, sans toucher aux données) :

| Test | Résultat |
|---|---|
| 412 × 800, trois boutons : 96 × 72 chacun, centres à -112, 0 et +112 pixels du centre de la carte, marges de 30 pixels | Réussi |
| 412 × 800, deux boutons (« Appeler » + « E-mail », puis « Appeler » + « WhatsApp ») : centres à -56 et +56, même écart de 112 pixels entre les centres, marges de 86 pixels de chaque côté | Réussi |
| 412 × 800, un bouton : exactement au centre de la carte | Réussi |
| 360 × 780 : trois boutons de 89 × 72 (centres à -103, 0, +103) ; deux boutons centrés (-55, +55) ; aucun débordement | Réussi |
| Grand écran (1280 pixels) : écart de 24 pixels ; groupe de 336 pixels pour trois boutons, 216 pour deux, toujours centré | Réussi |
| Console sans erreur ; « Version 0.15.3 » dans Paramètres | Réussi |

Constat : sur un écran de 360 pixels, les zones de toucher font 89 pixels de large avec trois boutons et 96 avec deux ; les pastilles et les icônes gardent exactement la même taille.

Tests non exécutés : smartphone (version 0.15.3), à faire par le propriétaire.

### Phase 8b : code SKU, type de stock, quantité à commander, prix de vente
- **Demandée par le propriétaire le 2026-11-19** (décision 69). Fonctions écartées de la première version : décision 70. Prix d'achat inchangé, toujours saisi à la main, sans coût moyen (décision 71) : le prix de vente ne sert jamais à la valeur du stock.
- **Résultat :** quatre champs facultatifs dans la fiche produit, affichés sur la carte ; recherche par code SKU ; filtre par type de stock (sans lecture de plus) ; règles Firestore version 9 (la version 8 sert au carnet de clients, phase 6c) qui contrôlent ces champs et acceptent aussi les produits qui ne les ont pas ; `CLAUDE.md` mis à jour (sections 4 et 5).
- **Avant de coder :** trancher avec le propriétaire : code SKU obligatoire ou non ; liste exacte des types ; affichage de la marge par unité ; avertissement si le prix de vente est plus bas que le prix d'achat ; valeur du stock au prix de vente (indicative).
- **Tests :** `tests-regles.html` complété (types, longueurs, liste des types, produit sans les nouveaux champs accepté, modification d'un produit ancien) ; `tests-nombres.html` si un calcul est ajouté (marge, valeur au prix de vente) ; code SKU en double signalé ; produits existants affichés sans erreur ; ordre de publication : règles d'abord, code ensuite ; smartphone.

**Compte rendu partiel de la phase 8b (2026-11-21) : étape 1, décisions et règles**

Réponse du propriétaire aux questions de détail : « Oui, mais le SKU est obligatoire », puis précision : l'**option** doit exister dans l'application, le champ reste facultatif à remplir. La décision 78, d'abord notée « code obligatoire à remplir », a été corrigée le jour même, avant toute écriture du code de l'application (les règles version 9 et les essais n'en dépendaient pas : seul un commentaire des règles a changé). Décisions 78 à 83 notées ; `CLAUDE.md` mis à jour (sections 4, 5, 8, 10 et 12). Écart avec le plan de départ : pas de filtre par type, la recherche trouve aussi le type (décision 79, question 6 ajoutée le 2026-11-21).

Ce qui a été fait :

- `firestore.rules`, **version 9** : fonctions `typeStockValide` et `champsPhase8bValides` ; les quatre champs ajoutés à la liste des champs permis d'un produit (pas à celle des champs obligatoires) ; rien d'autre ne change.
- `js/tests-regles.js` : série « phase 8b » (17 essais au premier passage, 16 ensuite) sur un troisième produit d'essai, `essai-regles-sku`, créé une seule fois puis archivé ; le premier produit d'essai garde la forme ancienne (sans les nouveaux champs), pour que les essais habituels vérifient qu'un produit ancien reste accepté. Série habituelle attendue : 122 essais au premier passage, 121 ensuite.
- La page `tests-regles.html` s'ouvre sans erreur avec le compte de test (vérifié le 2026-11-21) ; les essais ne sont pas encore lancés : ils exigent les règles version 9 publiées.

**Compte rendu de la phase 8b (2026-11-21) : étape 2, application**

Règles version 9 publiées dans la console par le propriétaire le 2026-11-21.

Ce qui a été fait (version `0.16.0`) :

- `js/produits.js` : `TYPES_STOCK` (liste identique à `firestore.rules`), `TYPE_STOCK_PAR_DEFAUT`, `libelleTypeStock`, `LONGUEUR_MAX_CODE_SKU`, `FORME_CODE_SKU` ; création : `typeStock` toujours écrit, les trois autres champs seulement s'ils sont remplis ; modification : un champ facultatif vidé est retiré du document (`deleteField`).
- `js/nombres.js` : `calculerMargeCentimes` (prix de vente moins prix d'achat).
- `index.html` : formulaire (« Code SKU (facultatif) » sous le nom, « Type de stock » sous l'unité, « Quantité à commander (facultatif) » sous le seuil, « Prix de vente unitaire (facultatif) » sous le prix d'achat) ; fiche du produit (code, type, à commander, prix de vente, marge ; les lignes vides sont masquées) ; recherche « Nom, code ou type ».
- `js/ecran-produits.js` : contrôles du formulaire (forme et unicité du code, type dans la liste, quantité à commander et prix de vente) ; question « Enregistrer quand même ? » si le prix de vente est plus bas que le prix d'achat, posée à la création ou quand l'un des deux prix change ; « À commander : … » sur la ligne en « Stock bas » ou « Rupture » (espaces insécables : le nombre reste avec l'unité) ; fiche ; recherche dans le nom, le code et le type.
- `css/style.css` : style de « À commander » (couleur de « Stock bas »).
- Une quantité à commander de 0 est comprise comme « pas de rappel » (champ absent), comme un champ vide.

Tests exécutés par l'assistant, dans le navigateur intégré, sur `http://localhost:8080/`, avec `test-phase3@example.com` et les règles version 9 :

| Test | Résultat |
|---|---|
| `tests-regles.html` : **122 essais sur 122**, dont les 17 de la phase 8b (premier passage) | Réussi |
| `tests-nombres.html` : **111 sur 111**, dont 7 sur la marge (positive, nulle, négative, maximale, affichage « -25,50 HTG ») | Réussi |
| Produits existants (sans les nouveaux champs) affichés sans erreur ; leur fiche indique « Type de stock : Non classé », sans ligne de code ni de prix de vente | Réussi |
| `+1` puis `−1` sur un ancien produit (Riz, 4 → 5 → 4 sacs) : acceptés par les règles version 9, synchronisés | Réussi |
| Code « RIZ 25 » (espace) refusé ; code de 51 caractères refusé (le champ en limite la saisie à 50) ; code « essai-8b » refusé car « ESSAI-8B » existe déjà (message qui nomme le produit) ; quantité à commander à 4 décimales et prix de vente négatif refusés | Réussi |
| Création de « Essai phase 8b (code SKU) » : code `ESSAI-8B`, Produit fini, seuil 5, à commander 20, achat 100, vente 80 ; question « Enregistrer quand même ? » affichée ; sur le serveur : `codeSku`, `typeStock: produit-fini`, `quantiteACommanderMilliemes: 20000`, `prixVenteCentimes: 8000` | Réussi |
| Ligne de l'accueil : « Rupture » et « À commander : 20 pièce » ; fiche : 8 lignes, marge « -20,00 HTG » | Réussi |
| Recherche : « fini », « essai-8b », « 8B » trouvent le produit d'essai ; « non classé » et « non classe » trouvent les 4 anciens produits ; « riz » trouve le Riz ; « zzz » : message « Aucun produit ne correspond » | Réussi |
| Modifier un ancien produit sans remplir les nouveaux champs : enregistré, seul `typeStock: non-classe` ajouté, quantité inchangée, aucune question | Réussi |
| Vider la quantité à commander et le prix de vente : champs retirés sur le serveur, « À commander » disparaît de la ligne | Réussi |
| Question du prix de vente : posée quand le prix de vente (80 < 100) ou le prix d'achat (80 < 90) change ; pas posée quand seul le seuil change, ni quand le prix de vente est au-dessus ; réponse « Annuler » : formulaire resté ouvert, rien d'enregistré | Réussi |
| `+1` puis `−1` sur le produit d'essai (lot produit + mouvement avec les nouveaux champs) : 0 → 1 → 0 sur le serveur | Réussi |
| Formulaire à 360 pixels : 7 champs de 328 × 48, police de 16 pixels, aucun défilement horizontal ; console sans erreur | Réussi |
| Produit d'essai archivé à la fin (il ne peut pas être supprimé) | Fait |

Tests non exécutés :

- Smartphone : à faire par le propriétaire (guide donné le 2026-11-21).
- Création ou modification hors ligne d'un produit avec les nouveaux champs, puis retour en ligne : même chemin d'envoi que les autres produits ; phase 12.
- Deux appareils hors ligne qui donnent le même code : limite acceptée (décision 78), non simulée.

Constats :

- À 360 × 780, quand les huit lignes de la fiche sont remplies, il faut faire défiler un peu le panneau pour voir « Modifier » (le panneau défilait déjà ; rien n'est caché).
- À 360 pixels, « À commander : 20 pièce » passe sur deux lignes sous « Rupture » (« À commander : » puis « 20 pièce ») : la ligne du produit est un peu plus haute, seulement pour les produits en alerte qui ont une quantité à commander.
- Le compte de test contient un produit archivé de plus, « Essai phase 8b (code SKU) », et 4 mouvements de plus (2 sur le Riz, 2 sur le produit d'essai, sommes nulles) ; « Essai phase 5 (zéro) » a maintenant `typeStock: non-classe`. `tests-regles.html` a créé le produit archivé « Produit d'essai (code SKU) » (`essai-regles-sku`).

**Test sur smartphone (2026-11-21), fait par le propriétaire :** version 0.16.0 sur le site en ligne, après **Push origin** ; le propriétaire indique que l'essai est réussi (guide donné : version 0.16.0 dans Paramètres ; produit d'essai avec code `TEST-1`, type « Produit fini », quantité à commander 10, achat 100 et vente 80, avec la question « Enregistrer quand même ? » ; marge de -20,00 HTG dans la fiche ; recherche par le code puis par « fini » ; ancien produit modifié sans rien remplir ; produit d'essai archivé). Non précisé : détail de chaque étape.

**Phase terminée le 2026-11-21.**

### Étape intermédiaire : recherche dans l'historique (décision 84)

Demande du propriétaire du 2026-11-21 : filtrer les mouvements comme les produits. Deux options présentées avec leurs risques : (1) recherche dans les mouvements déjà chargés, sans lecture de plus ; (2) recherche dans tout l'historique sur le serveur, avec un index à créer dans la console. **Option 1 choisie.**

**Compte rendu (2026-11-21, version 0.17.0)**

Ce qui a été fait :

- `index.html` : champ « Produit, type ou motif » avec la loupe, dans la partie figée de l'écran Mouvements (même présentation que Fournisseurs) ; ligne de bilan `recherche-historique-bilan` (annoncée aux lecteurs d'écran).
- `js/ecran-mouvements.js` : `correspondALaRecherche` (nom du produit, type, motif) et `afficherBilanRecherche` ; `afficherHistorique` filtre seulement les lignes affichées, chaque ligne étant toujours construite avec tout l'historique chargé (`annulationDe`, `peutEtreAnnule` inchangés) ; la recherche est vidée à la déconnexion. Aucun changement des données, des règles, des écoutes ni de « Voir plus ».
- Version `0.17.0`.

Tests exécutés par l'assistant, sur `http://localhost:8080/`, avec le compte de test, à 360 × 780 :

| Test | Résultat |
|---|---|
| Sans recherche : 50 mouvements, aucun bilan affiché | Réussi |
| « riz » : les 2 mouvements du Riz ; « sortie » : 27 sorties ; « AJUSTEMENT » : 4 ajustements ; « annulation » : les 2 annulations (motif) ; bilan « N mouvements trouvés parmi les 50 derniers mouvements chargés. Pour chercher plus loin, touchez « Voir plus »… » | Réussi |
| « zzz » et « cimént » (aucun mouvement du Ciment parmi les 50 derniers) : « Aucun mouvement ne correspond à … parmi les 50 derniers mouvements chargés », avec l'invitation à toucher « Voir plus » | Réussi |
| « Voir plus » avec « ciment » tapé : la recherche reste, 11 mouvements du Ciment trouvés parmi les 100 chargés | Réussi |
| Annulation : avec « essai des regles », les annulations sont cachées, mais les opérations d'origine restent marquées « Annulée le … », sans bouton « Annuler cette opération » ; mêmes marques qu'avant la recherche | Réussi |
| Champ de 328 × 48, police de 16 pixels ; partie figée de 129 pixels ; aucun défilement horizontal ; console sans erreur | Réussi |

Tests non exécutés : smartphone (à faire par le propriétaire) ; « Voir plus » sans Internet avec une recherche active (même chemin que sans recherche, avertissement d'historique incomplet inchangé).

Constat : l'historique du compte de test contient des mouvements d'un produit « Prenium Water Bottle », créés par le propriétaire pendant son essai sur téléphone de la phase 8b.

**Test sur smartphone (2026-11-21), fait par le propriétaire :** version 0.17.0 sur le site en ligne, après **Push origin** ; le propriétaire indique que l'essai est réussi (guide donné : « Version 0.17.0 » dans Paramètres ; recherche d'un produit, puis « sortie » ; mot absent des mouvements récents, puis « Voir plus »). Non précisé : détail de chaque étape.

**Étape terminée le 2026-11-21.**

### Phase 9 : export Excel
- **Résultat :** `stock_AAAA-MM-JJ.xlsx`, feuilles `Stock`, `Historique` et `Fournisseurs` (décision 42), SheetJS local (pris sur le site officiel de l'éditeur, version fixe), avertissements hors ligne / en attente.
- **Tests :** ouverture dans Excel, décimales correctes ; export hors ligne avec avertissement ; téléchargement sur smartphone.

**Compte rendu de la phase 9 (2026-11-21)**

Choix validés par le propriétaire avant de coder : réponses « Oui » aux trois recommandations, option A pour le filtre (filtres d'Excel, export toujours complet), inspirations tirées de son export de mouvements (section 8.7). Décisions 85 à 88. Les règles Firestore ne changent pas (version 9) ; l'export ne fait que lire.

Ce qui a été fait (version `0.18.0`) :

- `js/export-excel.js` (nouveau) : chargement de SheetJS à la demande (`chargerSheetJS`, nouvel essai possible après un échec) ; `lireDonneesExport` (quatre collections avec `getDocs` : serveur si possible, sinon copie de l'appareil, `depuisCache` et `enAttente`) ; `construireClasseur` (feuilles `Stock`, `Historique`, `Fournisseurs`, `Clients` ; formats `#,##0.00` pour les montants et `dd/mm/yyyy hh:mm` pour les dates ; largeurs de colonnes ; filtres d'Excel `!autofilter` sur toute la plage) ; `nomDuFichier` ; bouton : message pendant la préparation, question « Créer le fichier quand même ? » sans réponse du serveur, message final (nombre de lignes, emplacement, copie à garder, avertissements hors ligne et modifications en attente).
- `js/nombres.js` : `milliemesVersNombre`, `centimesVersNombre` (accepte un grand entier), `dateVersSerieExcel` (à l'heure de l'appareil, sans décalage de fuseau) ; 15 essais de plus dans `tests-nombres.html`.
- `index.html` : bloc « Sauvegarde » en haut de Paramètres (bouton « Exporter le stock (Excel) », rappel de la seule sauvegarde et des filtres d'Excel) ; bouton « Exporter mes données (Excel) » sur l'écran « Supprimer mon compte » (texte « sera ajouté dans une prochaine version » retiré).
- `js/app.js` : `brancherExport`, `demarrerExport` (avec l'entrepôt, pour la devise), `arreterExport` ; version `0.18.0`.

Tests exécutés par l'assistant, dans le navigateur intégré, sur `http://localhost:8080/`, avec `test-phase3@example.com`. Pour ne rien télécharger sur l'ordinateur, la fonction d'enregistrement de SheetJS était remplacée dans la page par une capture du classeur, puis le classeur était écrit en mémoire et relu par SheetJS (comme Excel le lirait) :

| Test | Résultat |
|---|---|
| `tests-nombres.html` : **126 sur 126**, dont 15 conversions pour Excel (2500 → 2,5 ; 1 → 0,001 ; 12550 → 125,5 ; grand entier ; dates du 01/01/2026 = 46023, 29/02/2028 = 46812 ; 07/11/2026 21:23:41 = 46333,891447, la valeur du fichier du propriétaire) | Réussi |
| Paramètres à 360 pixels : bloc « Sauvegarde » en premier ; SheetJS **pas chargé** à l'ouverture de l'application, chargé une seule fois au premier export, depuis `localhost` | Réussi |
| Export : « stock_2026-11-21.xlsx », en un peu plus d'une seconde ; message « 10 produits, 225 mouvements, 1 fournisseur, 0 client… Téléchargements… seule sauvegarde… » ; bouton réactivé | Réussi |
| Fichier relu : 4 feuilles dans l'ordre Stock, Historique, Fournisseurs, Clients ; titres attendus (devise HTG dans les titres de prix) ; filtres d'Excel sur `A1:M11`, `A1:I226`, `A1:G2`, `A1:F1` (feuille Clients vide : titres seuls) ; largeurs de colonnes conservées | Réussi |
| `Stock` : 5 produits actifs triés par nom, puis 5 archivés (« Archivé : Oui ») ; alertes « Stock bas » et « Rupture » ; code SKU et type de stock repris ; quantités en nombres (7,5) ; **somme des valeurs des produits actifs = 87 375, égale au total affiché par l'application** | Réussi |
| `Historique` : 225 lignes, du plus récent au plus ancien ; dates affichées « 21/11/2026 10:56 » ; code SKU du produit ; quantité signée ; statuts « Terminé » (210) et « Annulé » (15) ; une opération annulée par le propriétaire sur son téléphone apparaît avec « Annulé », son annulation avec « Terminé » | Réussi |
| `Fournisseurs` : le fournisseur du compte, numéros gardés comme du texte (`+509…`) | Réussi |
| Bouton « Exporter mes données (Excel) » de l'écran « Supprimer mon compte » (case non cochée, rien supprimé) : même fichier, message sous le bouton | Réussi |
| Sans réseau (`disableNetwork`) : question « Pas de connexion au serveur… Créer le fichier quand même ? » ; réponse « Annuler » : aucun fichier, « Export annulé… » ; réponse « OK » : fichier créé depuis la copie de l'appareil (225 mouvements), message « fait sans Internet, il peut être incomplet » | Réussi |
| `+1` sur le Riz sans réseau, puis export : la première ligne de l'historique a le statut « En attente d'envoi », sans heure du serveur ; le message signale les modifications non confirmées ; réseau rétabli : synchronisé, Riz remis à 4 sacs par un `−1` | Réussi |
| Onglet neuf : console sans erreur | Réussi |

Tests non exécutés :

- Ouverture du fichier dans Microsoft Excel ou sur le téléphone : à faire par le propriétaire (le fichier a seulement été relu par SheetJS).
- Téléchargement réel sur le téléphone (dossier « Téléchargements ») : à faire par le propriétaire.
- Export sans Internet sur un téléphone où SheetJS n'a jamais été chargé : échec attendu avec le message « La bibliothèque Excel n'a pas pu être chargée… » ; non simulé. Sera réglé par la phase 10.
- iPhone : non essayé (limite notée dans le README).

Constats :

- Le compte de test a 2 mouvements de plus (Riz +1 puis −1). L'historique contient les essais du propriétaire sur son téléphone (produit « Prenium Water Bottle », code `PWB-001`, dont une sortie annulée).
- Dans la console de l'ancien onglet, des erreurs réseau anciennes (`ERR_CONNECTION_CLOSED`, `ERR_NAME_NOT_RESOLVED`) venaient de coupures de la connexion de Firestore pendant la longue session ; elles n'apparaissent pas dans un onglet neuf (section 8.5, point 19).

**Test sur smartphone (2026-11-21), fait par le propriétaire :** version 0.18.0 sur le site en ligne, après **Push origin** ; le propriétaire indique que l'essai est réussi (guide donné : « Version 0.18.0 » dans Paramètres ; « Exporter le stock (Excel) » ; fichier ouvert depuis « Téléchargements » ; quatre feuilles ; flèche de filtre sur « Produit » dans « Historique » ; copie gardée ailleurs). Non précisé : application utilisée pour ouvrir le fichier, détail de chaque étape.

**Phase terminée le 2026-11-21.**

### Étape 9b : bon imprimable d'un mouvement (décisions 89 à 91)

Demande du propriétaire du 2026-11-21, avant la phase 10 : imprimer un mouvement de stock, comme le bon de réception d'Odoo qu'il a fourni (`Kinder Saint Franc _ Réception.pdf`, dans ses Téléchargements, non copié dans le dépôt). Analyse présentée : possible sans risque pour les données (le bon ne fait que lire) ; repris : titre, référence, date, produit avec code, quantité, entrepôt, motif ; écartés : fournisseur ou client (décisions 42 et 73 ; nom à écrire dans le motif), plusieurs produits par bon, numéros qui se suivent, « Commandé / Livré », logo et adresse, prix. Réponse : « Oui d'accord », avec une mise en page **épurée et symétrique sur n'importe quel appareil**. Rappel « ne pas trop compliquer » fait : un mouvement = un bon.

Ce qui a été fait (version `0.19.0`) :

- `js/bon-mouvement.js` (nouveau) : `referenceDuBon` (8 premiers caractères de l'identifiant en majuscules, `A-…` pour une annulation) ; construction du bon en éléments DOM (textes posés comme du texte) ; `imprimerBon` (remplit `#zone-impression`, pose la classe `impression-bon` sur `<body>`, met le titre et la référence dans le titre de la page pour le nom du PDF, appelle `window.print()` ; tout est remis à l'événement `afterprint`) ; `effacerBon` à la déconnexion. Renvoie `false` si le navigateur ne sait pas imprimer (message dans l'historique).
- `js/ecran-mouvements.js` : bouton « Imprimer » (pastille avec icône, `data-action="imprimer"`) dans un haut de ligne `mouvement-entete` à côté du nom du produit ; `imprimerMouvement` rassemble le mouvement, le code SKU actuel (produit non archivé), l'annulation éventuelle et l'état « en attente » ; le focus clavier revient sur le bon bouton après la reconstruction de la liste (`data-action`) ; nom de l'entrepôt reçu par `demarrerEcranMouvements(db, uid, entrepot)`.
- `css/style.css` : pastille `.bouton-imprimer` (style des boutons de contact) ; partie « Bon imprimable » : zone invisible à l'écran, seule montrée à l'impression quand `body.impression-bon` ; page nommée `@page bon { margin: 0 }` (pas de mentions du navigateur), marges égales à l'intérieur du bon, titre centré avec filet doré, deux colonnes égales (référence et date, signatures), tableau produit / quantité, aucun fond coloré.
- `index.html` : icône `icone-imprimer` dans la réserve d'icônes ; `<div id="zone-impression">` ; phrase d'aide de l'historique complétée.
- `js/app.js` : entrepôt passé à l'écran des mouvements ; version `0.19.0`.

Tests exécutés par l'assistant, sur `http://localhost:8080/`, avec `test-phase3@example.com` :

| Test | Résultat |
|---|---|
| Historique : 50 lignes, 50 boutons « Imprimer » ; pastille à 8,8 pixels du haut et du bord droit de la carte, centrée sur la hauteur du nom du produit | Réussi |
| Largeur 320 pixels : nom long sur deux lignes à côté de la pastille, aucun défilement horizontal | Réussi |
| Appui sur « Imprimer » (fenêtre d'impression remplacée dans la page par une capture) : classe d'impression posée, titre de la page « Bon de sortie P2HWJ9HI », bon complet (NzuriDeal, Bon de sortie, référence, date, Riz 25 kg (Tchako), 1 sac sans signe, « Remis par / Reçu par », « Imprimé le … avec MinStock ») ; après `afterprint` : classe retirée, titre « MinStock » | Réussi |
| **PDF réels** faits par Chrome sans fenêtre (`--print-to-pdf`, rendu d'impression réel), avec une page d'essai temporaire supprimée ensuite : entrée en A4 (code SKU, motif « Livraison Komès Nò ») ; même bon en Letter ; sortie avec un nom de produit et un nom d'entrepôt très longs ; ajustement annulé (mention encadrée « Opération annulée le … (référence A-…) », « Établi par / Vérifié par », −3 sac) ; annulation pas encore confirmée (référence `A-P2HWJ9HI`, mention, +1 sac) : une seule page à chaque fois, marges gauche et droite égales, aucune date ni adresse ajoutée par le navigateur | Réussi |
| Impression habituelle après un bon (après `afterprint`) : la page s'imprime comme avant, avec les mentions du navigateur, sans le bon | Réussi |
| Console sans erreur | Réussi |

Tests non exécutés :

- Fenêtre d'impression réelle d'Android (aperçu, « Enregistrer au format PDF », nom du fichier proposé, imprimante) : à faire par le propriétaire.
- Fenêtre d'impression réelle sur ordinateur (l'appel a été remplacé par une capture pour ne rien bloquer).
- iPhone : non essayé.

### Phase 10 : PWA
- **Résultat :** manifeste, icônes, service worker (fichiers de l'application seulement, jamais les échanges avec Firebase), bouton « Nouvelle version disponible ».
- **Tests :** installation sur le téléphone ; réouverture en mode avion après une visite en ligne ; connexion Google dans l'application installée ; mise à jour visible après une nouvelle publication.

### Phase 11 : données de démonstration
- **Résultat :** bouton visible seulement si l'entrepôt est vide ; un lot par produit, par le même chemin que les vraies opérations.
- **Tests :** bouton absent dès qu'un produit existe ; historique cohérent avec les quantités.

### Phase 12 : audit final
- **Résultat :** rapport classé par gravité (règles, doublons, nombres, suppression, hors ligne, export, mobile, secrets). App Check et autres protections avancées évalués à ce moment.
- **Tests :** rejouer `tests-regles.html` et `tests-nombres.html` ; test à deux appareils sur le même produit.

### Phase 13 : documentation et publication finale
- **Résultat :** README complet en français (limites connues, sauvegarde par export, paramètres de déploiement, changement d'hébergeur).
- **Tests :** lien final testé sur ordinateur et smartphone.

## 3. Points à vérifier par un essai réel

Ces points viennent de l'analyse et n'ont pas été testés.

1. *(Vérifié le 2026-11-16.)* Avec la méthode moderne de persistance, un échec n'est pas signalé à l'application. Solution en place : test du stockage local au démarrage (voir le compte rendu de la phase 2).
2. *(Vérifié en partie le 2026-11-16.)* Avec la protection contre l'énumération : l'inscription avec une adresse existante est refusée avec un message précis ; une mauvaise connexion donne un message générique ; « Mot de passe oublié » ne signale jamais d'adresse inconnue. Reste à tester par le propriétaire : le passage d'un compte par mot de passe à Google avec la même adresse.
3. *(Vérifié le 2026-11-18 pour les suppressions : un lot de 100 suppressions dont chaque règle lit l'entrepôt est accepté ; paquets de 100 retenus en phase 7.)* **Phase 11 :** taille de lot sûre pour les créations (produit et mouvement d'entrée, avec `getAfter`) à vérifier au moment voulu.

## 4. Propositions de l'analyse pas encore validées

À trancher avec le propriétaire au début de la phase concernée.

- *(Tranché : décision 32.)* Trier l'historique par `dateServeur` et afficher `dateAppareil` comme « fait le » (phase 4b).
- *(Tranché : décision 22.)* N'écouter en temps réel que les produits non archivés (phase 4a).
- *(Tranché : décision 47, pas pour l'instant.)* Filtre par produit dans l'historique : prévu par `DEMARRAGE.md` (phase 6) mais absent de `CLAUDE.md` ; il exige un index à créer dans la console.
- Annoncer une taille raisonnable d'entrepôt (environ 500 produits) à cause du quota de lectures.
- Facultatif : numéro de version affiché ; regroupement des appuis rapides sur `+1` ; vérification dans les règles que le compte n'est pas en cours de suppression.
- *(Tranché : décisions 23 et 24.)* Peut-on désarchiver un produit ? Un produit archivé compte-t-il dans la valeur du stock ?
- Les produits archivés doivent-ils figurer dans l'export Excel (feuille `Stock`) ? À trancher en phase 9.
- Appareil partagé (question du propriétaire, 2026-11-18) : la mémoire hors ligne du navigateur garde les données après « Se déconnecter » (vérifié : 68 documents encore présents après la déconnexion du compte de test). Proposition à étudier en phase 8 ou 12 : un bouton « Se déconnecter et effacer les données de cet appareil », qui refuserait d'effacer tant que des modifications attendent d'être envoyées (`CLAUDE.md` section 9 : ne jamais supprimer en silence des écritures en attente). Limite notée dans le README en attendant.
- *(Tranché : décision 18.)* Liste des devises proposées au premier lancement.
- *(Tranché : décisions 50 et 51.)* Fournisseurs (phase 6b) : suppression définitive plutôt qu'archivage, puisque ce sont des données personnelles de tiers et que rien ne s'y rattache ? Deux fournisseurs du même nom autorisés ? Fournisseurs archivés dans l'export Excel (question devenue sans objet) ?

## 5. Problèmes connus

1. *(Résolu le 2026-11-16.)* Le dépôt est cloné dans `C:\GitHub\Inventory Management\inventorymanagement` et relié à `saintfranckinder/minstock`. Renommé sur GitHub le 2026-11-18 (ancien nom : `inventorymanagement`) ; GitHub Desktop a mis à jour l'adresse du dépôt tout seul (vérifié le 2026-11-18).
2. **La commande `git` n'est pas dans le terminal, mais ce n'est pas bloquant.** Git for Windows est absent ; le Git interne de GitHub Desktop fonctionne (version 2.53, vérifié le 2026-11-16) et sert aux commits locaux. Chemin : `%LOCALAPPDATA%\GitHubDesktop\app-*\resources\app\git\cmd\git.exe` (le numéro de version change à chaque mise à jour de GitHub Desktop : toujours le rechercher). Le nom et une adresse `noreply` sont déjà réglés : l'adresse personnelle n'apparaîtra pas dans les commits.
3. **Node.js, Java et Python ne sont pas installés** : pas d'émulateur Firebase, serveur local par script PowerShell.
4. **Une ancienne copie des fichiers existe dans `C:\Inventory Management`.** Elle n'est plus utilisée et ne contient ni ce plan ni les nouvelles décisions. Le propriétaire peut la supprimer.
5. **Le dépôt sur GitHub était vide au moment du premier commit local (phase 0).** La première publication se fait dans GitHub Desktop avec le bouton **Publish branch** ; les suivantes avec **Push origin**.
6. **Le fichier facultatif `.claude/settings.json`** proposé dans `DEMARRAGE.md` (phase 0) n'a pas été créé : le propriétaire ne l'a pas demandé.
7. *(Corrigé le 2026-11-19, phase 8, décision 65 : « En attente » remplace le mot « Quantité » ; positions des boutons vérifiées identiques.)* La ligne « En attente de synchronisation » faisait bouger un instant les boutons placés en dessous (constaté le 2026-11-18 sur smartphone, après un appui sur `+1` ou `−1`).

## 6. Écarts corrigés entre les décisions validées et les autres fichiers

Corrigés le 2026-11-16 avec l'accord du propriétaire. Ce tableau garde la trace de ce qui a changé dans `CLAUDE.md` et `DEMARRAGE.md`.

| Fichier | Ancien texte | Nouveau texte |
|---|---|---|
| `CLAUDE.md` §3 et `DEMARRAGE.md` §8, phase 13 | Dépôt privé jusqu'à la publication, après l'audit | Public dès la fin de la phase 4b (décision 10) |
| `CLAUDE.md` §8 et §12 | Règles vérifiées avec le simulateur | Page `tests-regles.html` ; simulateur pour les refus simples (décision 8) |
| `CLAUDE.md` §8, suppression du compte | Reconnexion demandée à la fin si nécessaire | Reconnexion en premier, en ligne, avec reprise (décision 13) |
| `DEMARRAGE.md` phase 4 | Une seule phase | Phases 4a et 4b (décision 14) |
| `DEMARRAGE.md` phase 8 | Test de réouverture en mode avion | Test déplacé en phase 10 (décision 14) |
| `DEMARRAGE.md` §3 | Git for Windows installé, dépôt cloné | Déplacé dans « Reste à faire sur l'ordinateur » (section 5) |
| `DEMARRAGE.md` phase 0 | Créer `PLAN.md` vide | Ne pas remplacer `PLAN.md`, qui existe depuis la phase 1 |
| `CLAUDE.md` §3, §5, §6 | — | Ajouts : import du SDK corrigé et serveur local (décision 11), `dernierMouvementId` vide si stock 0 (décision 12), règles tolérantes au hors-ligne et liste locale (décision 9) |
| `CLAUDE.md` §4, §5, §8, §10, §12 et `DEMARRAGE.md` §4 (2026-11-18) | — | Ajouts validés par le propriétaire : carnet de fournisseurs, phase 6b, 3e feuille d'export, suppression du compte et confidentialité (décision 42) ; « Annuler cette opération » en phase 6, règle 12 de la section 6 (décision 43) ; ordre de priorité : fournisseurs avant les données de démonstration |
| `CLAUDE.md` §4 (point 15), §5, §8, §12 et `DEMARRAGE.md` phase 6b (2026-11-18) | Fournisseurs : « ajouter, modifier et archiver », champ `archive`, longueurs « fixées au début de la phase 6b » | Accord du propriétaire : « ajouter, modifier et supprimer », recherche et boutons de contact, champ `archive` retiré, longueurs de la décision 54 (décisions 50 à 54) |

## 7. Résumé de l'analyse des risques (phase 1)

Gravité élevée :
1. Le simulateur de règles ne teste qu'une écriture à la fois : il ne peut pas valider un lot produit + mouvement.
2. GitHub Pages gratuit exige un dépôt public : pas de test sur smartphone tant que le dépôt est privé.
3. Une écriture faite hors ligne puis refusée par le serveur après fermeture de l'application disparaît sans message.
4. Les fichiers du SDK Firebase copiés tels quels continuent d'appeler Internet.

Gravité moyenne : trous dans les règles du lien produit-mouvement ; suppression du compte interrompue ; même e-mail avec deux méthodes ; écritures en attente perdues (déconnexion, nettoyage du navigateur, iPhone non installé) ; règles et code publiés séparément ; quotas (relecture après 30 minutes de coupure, export complet, abus par inscription publique) ; date de tri de l'historique ; popup Google dans l'application installée sur iPhone ; échec de persistance non signalé ; écran figé si l'on attend la confirmation du serveur hors ligne.

Gravité faible : ajustement calculé sur une quantité ancienne ; dernier arrivé gagne sur le nom et le prix ; très grands nombres ; source de SheetJS ; devise contrôlée seulement dans l'interface ; changement d'hébergeur (données locales non transférées) ; adresse e-mail visible dans les commits publics ; téléchargement Excel sur iPhone.

Règles de conception retenues pour le code :
- Ne jamais attendre la confirmation du serveur pour mettre à jour l'écran ; afficher « en attente ».
- Les règles ne refusent jamais un mouvement à cause d'un état qui a pu changer sur un autre appareil (nom, archivage).
- Après la mise en service, ne publier que des changements de règles compatibles avec les versions déjà installées.

## 8. Note de passation

*Mise à jour le 2026-11-21, après l'étape « boutons de contact en icônes » (décision 77) et avant la phase 8b. Elle remplace la note du 2026-11-18. Ne pas recommencer le projet ni réécrire le code qui fonctionne : reprendre à la section 8.7.*

### 8.1 Phase actuelle

- **Phase 8b terminée le 2026-11-21** (décisions 78 à 83 : code SKU toujours présent dans le formulaire, facultatif à remplir ; type de stock ; quantité à commander ; prix de vente et marge ; recherche par code et par type). Règles version 9 publiées par le propriétaire ; tous les tests sur l'ordinateur réussis ; version 0.16.0 essayée sur smartphone par le propriétaire : réussi.
- **Recherche dans l'historique terminée le 2026-11-21** (décision 84, version 0.17.0) : tests sur l'ordinateur réussis ; essai sur smartphone réussi selon le propriétaire.
- **Phase 9 (export Excel) terminée le 2026-11-21** (décisions 85 à 88, version 0.18.0) : tests sur l'ordinateur réussis ; essai sur smartphone réussi selon le propriétaire.
- **Étape 9b (bon imprimable d'un mouvement) faite le 2026-11-21** (décisions 89 à 91, version 0.19.0), demandée par le propriétaire avant la phase 10 : tests sur l'ordinateur réussis, PDF réels vérifiés ; **essai sur smartphone à faire par le propriétaire**.
- **Prochaine étape : phase 10, application installable (PWA).** Rien n'est codé ; explication et questions présentées au propriétaire le 2026-11-21 (section 8.7), réponse attendue (mise en attente par la demande de l'étape 9b).
- **Étape « boutons de contact en icônes » faite le 2026-11-21** (décision 77 : « Appeler », « WhatsApp », « E-mail » deviennent une icône avec son nom dessous). Tests sur l'ordinateur réussis ; **test sur smartphone à faire par le propriétaire**.
- **Étape « accueil épuré » terminée le 2026-11-20** (décisions 74 à 76 : une ligne par produit, fiche dans un panneau, bouton rond, barre de navigation, ⚙ ; haut des écrans figé ; bouton retour du téléphone ; partie figée réduite). Tests sur l'ordinateur réussis ; version `0.15.0` essayée sur smartphone par le propriétaire : réussi.
- Déjà terminées le 2026-11-19 et le 2026-11-20 : **phase 8** (hors ligne et indicateur de synchronisation, mode avion réussi sur smartphone) et **phase 6c** (carnet de clients, smartphone réussi).
- **Prochaine étape : phase 8b** (code SKU, type de stock, quantité à commander, prix de vente : décision 69 ; règles version 9). **Rien n'est codé.** Les cinq questions de détail ont été posées au propriétaire le 2026-11-20 avec les recommandations de l'assistant (section 8.7) ; **sa réponse est attendue**.
- Version de l'application : `0.19.0`. Règles Firestore : **version 9**, publiée dans la console par le propriétaire le 2026-11-21 ; `tests-regles.html` 122 sur 122 (série habituelle) le même jour. La série « suppression » (22 essais, compte jetable) n'a pas été rejouée : les règles de suppression n'ont pas changé.
- Dépôt GitHub : `saintfranckinder/minstock`, **public**. Site : `https://saintfranckinder.github.io/minstock/` (GitHub Pages, branche `main`, dossier racine).
- Dépôt Git, branche `main` : `cecf8d3` (phases 0 et 1), `48d55b3` (phase 2), `f09bf30` (phase 3), `96f2a3d` (phase 4a), `d8f1b5b` (phase 4b), `2f53da4` (note de passation), `b26abb6` (dépôt renommé), `e166a30` (recherche de secrets), `d5a7808` (décisions 40 et 41), `86d4eb4` (mise en ligne), `e1a5c70` (fin de l'étape « dépôt public »), `e202b2a` (décisions 42 et 43), `7e156a3` (phase 5), `eb40c59` (test sur smartphone de la phase 5), `456dff6` (phase 6), `de2ef92` (test sur smartphone de la phase 6), `14e00c9` (phase 6b), `36f5d20` (test sur smartphone de la phase 6b), `6eeb438` (identité visuelle), `c95d942` (compteurs cliquables), `f60525d` (test sur smartphone des compteurs), `d952342` (phase 7), `b2cc014` (test sur smartphone de la phase 7), `84b6e87` (note de passation), `e6e178b` (phase 8, version 0.11.0), `44567e0` (décision 71), `3ca1084` (note), `83ac5be` (phase 8 terminée), `7dc5476` (téléphone du propriétaire), `d6ce5a1` (phase 6c, version 0.12.0), `50e206b` (phase 6c terminée), `2367763` (accueil épuré, version 0.13.0), `5e33443` (décision 75, version 0.14.0), `dcb2a30` (décision 76, version 0.15.0), `ad63621` (accueil épuré terminé), une note de passation, `1b1063f` (icônes de contact, décision 77, version 0.15.1), `02b74ab` (grille de trois colonnes, version 0.15.2), `a523018` (même équilibre avec deux boutons, version 0.15.3), `984d73d` (phase 8b, étape 1 : décisions et règles version 9), `1ba861b` (décision 78 corrigée), `b4aabd2` (phase 8b, étape 2 : application, version 0.16.0), `a687971` (phase 8b terminée), `720789f` (recherche dans l'historique, décision 84, version 0.17.0), `c232f8c` (note de fin de cette étape), `7493685` (questions et analyse de la phase 9), `1bc7117` (phase 9, export Excel, version 0.18.0), `ed24cc9` (phase 9 terminée, questions de la phase 10), puis le commit de l'étape 9b (bon imprimable, version 0.19.0, avec cette note). Le propriétaire envoie chaque commit avec **Push origin** dans GitHub Desktop ; le site se met à jour quelques minutes après.
- **État de l'envoi sur GitHub (vu dans la copie locale le 2026-11-20, sans interroger GitHub) :** le propriétaire a envoyé jusqu'à `dcb2a30` (version `0.15.0` en ligne, identique au code). *(Le 2026-11-21, la capture du téléphone du propriétaire montre la version 0.15.1 en ligne : les commits jusqu'à `1b1063f` ont donc été envoyés.)* *(Le 2026-11-21, le propriétaire a essayé la version 0.16.0 en ligne : les commits jusqu'à `b4aabd2` ont donc été envoyés.)* *(Le 2026-11-21, le propriétaire a essayé la version 0.17.0 en ligne : les commits jusqu'à `720789f` ont donc été envoyés.)* *(Le 2026-11-21, le propriétaire a essayé la version 0.18.0 en ligne : les commits jusqu'à `1bc7117` ont donc été envoyés.)* Reste à envoyer : la note de fin de la phase 9 (`ed24cc9`, documentation seulement) et le commit de l'étape 9b (version 0.19.0).
- **Dossier de la session :** l'outil de travail peut s'ouvrir sur le dossier parent `C:\GitHub\Inventory Management` ; le dépôt reste `C:\GitHub\Inventory Management\inventorymanagement` (utiliser des chemins complets, et `git -C <dépôt>`).

### 8.2 Travail terminé

| Phase | Résultat | Preuve |
|---|---|---|
| 0 | `.gitignore`, `README.md`, dépôt relié à `saintfranckinder/minstock` (ancien nom : `inventorymanagement`) | commit `cecf8d3` |
| 1 | Analyse des risques, plan, décisions 8 à 15, `CLAUDE.md` et `DEMARRAGE.md` alignés | commit `cecf8d3` |
| 2 | Structure, SDK Firebase 13.4.0 et SheetJS 0.20.3 dans `vendor/` (import corrigé), mémoire hors ligne avec avertissement, serveur local | compte rendu de la phase 2 |
| 3 | Connexion Google et e-mail, inscription, mot de passe oublié, premier lancement, confidentialité, règles version 3 | `tests-regles.html` : 14 sur 14 |
| 4a | Conversion des nombres, produits (ajout, modification, archivage), règles version 4 | `tests-nombres.html` : 98 sur 98 ; `tests-regles.html` : 39 sur 39 |
| 4b | Mouvements (entrée, sortie, ajustement), stock de départ, historique (50 derniers puis « Voir plus »), suivi local des opérations refusées, règles version 5 | `tests-regles.html` : 70 sur 70 ; essais dans l'application (compte rendu de la phase 4b) |
| Dépôt public | Recherche de secrets, dépôt renommé `minstock`, page de test réservée aux comptes de test, `.nojekyll`, dépôt public, GitHub Pages | comptes rendus de l'étape « dépôt public » (section 2) |
| 5 | Tableau de bord : valeur du stock indicative et total, recherche, alertes « Stock bas » / « Rupture », boutons `−1` / `+1` | `tests-nombres.html` : 104 sur 104 ; `tests-regles.html` : 67 sur 67 ; compte rendu de la phase 5 ; test sur smartphone réussi |
| 6 | « Annuler cette opération » dans l'historique, écran « Paramètres » (nom de l'entrepôt, devise tant qu'aucun produit n'existe) | `tests-regles.html` : 72 sur 72 ; compte rendu de la phase 6 ; test sur smartphone réussi |
| 6b | Carnet de fournisseurs : liste, recherche, « Appeler » / « WhatsApp » / « E-mail », ajout, modification, suppression ; règles version 6 | `tests-regles.html` : 90 sur 90 ; compte rendu de la phase 6b ; test sur smartphone réussi |
| Identité | Nom MinStock, symbole SVG, police Montserrat, couleurs et style de la maquette, compteurs de la carte de valeur (cliquables) | compte rendu de l'étape « identité visuelle » ; tests sur smartphone réussis |
| 7 | Suppression du compte et de toutes ses données : double confirmation, reconnexion, effacement par paquets, reprise automatique, effacement de la copie locale ; règles version 7 | `tests-regles.html` : 88 sur 88 et 20 sur 20 (compte jetable) ; suppressions complète et interrompue réussies ; compte rendu de la phase 7 |
| 8 | Indicateur de synchronisation, « En attente » à la place de « Quantité », avertissement de déconnexion, « Effacer les données de cet appareil », stockage durable demandé | `tests-nombres.html` : 104 sur 104 ; `tests-regles.html` : 88 sur 88 ; coupures simulées (compte rendu de la phase 8) ; mode avion sur smartphone réussi |
| 6c | Carnet de clients (copie du carnet de fournisseurs, sans case VIP) ; règles version 8 ; clients effacés avec le compte | `tests-regles.html` : 105 sur 105 et 22 sur 22 ; compte rendu de la phase 6c ; test sur smartphone réussi |
| Accueil épuré | Une ligne par produit, fiche dans un panneau, bouton rond, barre en bas, ⚙ ; haut figé, bouton retour du téléphone, partie figée réduite (décisions 74 à 76) ; aucune donnée ni règle changée | compte rendu de l'étape « accueil épuré » ; test sur smartphone réussi (version 0.15.0) |
| Icônes de contact | « Appeler », « WhatsApp », « E-mail » : une icône et son nom dessous (décision 77) ; aucune donnée ni règle changée | compte rendu de l'étape « boutons de contact en icônes » ; smartphone à faire |
| 8b | Code SKU (facultatif, unique), type de stock, quantité à commander, prix de vente et marge ; recherche par code et par type ; règles version 9 | `tests-regles.html` : 122 sur 122 ; `tests-nombres.html` : 111 sur 111 ; compte rendu de la phase 8b ; test sur smartphone réussi (version 0.16.0) |
| Recherche historique | Recherche par produit, type ou motif dans les mouvements chargés (décision 84) | compte rendu de l'étape ; test sur smartphone réussi (version 0.17.0) |
| 9 | Export Excel complet (Stock, Historique, Fournisseurs, Clients), filtres d'Excel, bouton dans Paramètres et sur « Supprimer mon compte » | `tests-nombres.html` : 126 sur 126 ; fichier relu par SheetJS ; compte rendu de la phase 9 ; essai sur smartphone réussi (version 0.18.0) |
| 9b | Bouton « Imprimer » sur chaque ligne de l'historique : bon du mouvement (imprimante ou PDF), épuré et symétrique, pensé pour le papier ; ne fait que lire | compte rendu de l'étape 9b (PDF réels en A4 et Letter vérifiés) ; smartphone à faire |

Les tests des phases 2 à 8, 6c et de l'accueil épuré ont été exécutés par l'assistant dans le navigateur intégré, sur `http://localhost:8080/`, avec les comptes de test (et des comptes jetables pour la phase 7). Tests sur smartphone faits par le propriétaire (Moto G Stylus 2024, Chrome), sur le site en ligne, tous réussis : le 2026-11-18, étape « dépôt public », phases 5, 6 et 6b, identité visuelle, compteurs cliquables, phase 7 (avec un compte jetable) ; le 2026-11-19, phase 8 en mode avion ; le 2026-11-20, phase 6c et accueil épuré (versions 0.13.0 à 0.15.0).

### 8.3 Travail restant

**Tests du propriétaire en attente (phase 3) :**

1. *(Connexion Google réussie sur smartphone le 2026-11-18, selon le propriétaire.)* Reste : message d'aide si la fenêtre Google (popup) est bloquée.
2. Réception de l'e-mail « Mot de passe oublié », en français.
3. Même adresse e-mail par les deux méthodes, dans les deux ordres.

**Tests non faits, à reprendre dans la phase indiquée :**

| Test | Phase |
|---|---|
| *(Fait pour les phases 5, 6, 6b, l'identité, 7, 8, 6c et l'accueil épuré.)* Affichage sur smartphone, à refaire pour chaque nouvel écran | Phases 8b, 9, 10 |
| *(Fait le 2026-11-18 par le propriétaire ; lisibilité en extérieur non précisée.)* Tableau de bord sur smartphone : recherche, boutons `−1` / `+1` au doigt, alertes | Phase 5 (propriétaire) |
| *(Fait le 2026-11-18 avec le second compte de test.)* Second compte réel qui ne voit pas les données du premier | Étape « dépôt public » |
| *(Fait le 2026-11-19 en mode avion sur smartphone : « Fait le 01:59 », « Reçu par le serveur le 02:11 ».)* Affichage des deux heures quand l'écart dépasse 5 minutes | Phase 8 |
| *(Fait le 2026-11-19 par le propriétaire sur Moto G Stylus 2024 avec Chrome, question de déconnexion comprise ; sauf l'étape 11, deuxième appareil.)* Mode avion réel sur le téléphone : `DEMARRAGE.md` section 9, étapes 1 à 7 et 9 à 11 | Phase 8 |
| Wi-Fi sans Internet (délai réel avant « Hors ligne ») | Phase 12 |
| *(Fait le 2026-11-18 par le propriétaire.)* Historique et Paramètres sur smartphone : annuler une opération au doigt, renommer l'entrepôt, devise bloquée | Phase 6 (propriétaire) |
| *(Fait le 2026-11-18 par le propriétaire.)* Fournisseurs sur smartphone : ajouter, rechercher, « Appeler » et « WhatsApp » avec son propre numéro, modifier, supprimer | Phase 6b (propriétaire) |
| *(Fait le 2026-11-19 : l'écran s'affiche en mode avion.)* Liste des fournisseurs sans Internet (mode avion) | Phase 8 |
| *(Fait le 2026-11-18 par le propriétaire.)* Suppression du compte sur smartphone, **avec un compte jetable** | Phase 7 (propriétaire) |
| Suppression d'un compte Google (reconnexion par la fenêtre Google) ; reconnexion exigée par Firebase pour la dernière étape ; coupure réelle pendant la suppression ; deux appareils pendant la suppression | Phases 8 et 12 |
| *(Mouvement en mode avion puis retour en ligne : fait le 2026-11-19.)* Hors ligne réel : ajout de produit ; coupure entre l'envoi et la réponse ; « Voir plus » sans Internet ; premier chargement sans Internet sur un nouvel appareil | Phase 12 |
| Deux appareils qui modifient le même produit ; deux appareils sur le même compte (étape 11 du mode avion) | Phase 12 |
| *(Fait le 2026-11-20 par le propriétaire, version 0.15.0.)* Bouton retour d'Android (écrans, formulaires, fiche d'un produit) ; recherche avec le vrai clavier | Accueil épuré |
| Lecteur d'écran réel (annonces, fiche d'un produit, barre de navigation) | Phase 12 |
| Réouverture de l'application en mode avion | Phase 10 |

Les vérifications de la phase 2 sont réglées : `demarrer.bat` a été lancé par le propriétaire pendant la phase 3, et le test « Serveur injoignable » n'a plus d'objet (la page de vérification a été remplacée en phase 3 ; le comportement hors ligne se teste en phases 8 et 10).

**Étapes du plan :** phases 8b, 9 (export Excel), 10 (application installable), 11 (données de démonstration), 12 (audit final), 13 (documentation et publication finale) : section 2. La phase 8b commence par cinq questions de détail au propriétaire (section 8.7).

**Questions encore ouvertes (section 4) :** taille d'entrepôt raisonnable à annoncer (environ 500 produits) ; produits archivés dans l'export Excel (phase 9) ; options facultatives. *(« Effacer les données de cet appareil » : tranché, décision 67.)*

*(Fait en phase 9 le 2026-11-21.)* **À ajouter en phase 9 :** un bouton « Exporter » sur l'écran « Supprimer mon compte » (décision 60) ; les feuilles `Fournisseurs` (décision 42) et `Clients` (décision 72) ; les colonnes de la phase 8b (code SKU, type, quantité à commander, prix de vente) ; le motif de chaque mouvement (prix d'arrivage noté dans le motif, décision 71).

**À ajouter en phase 11 :** les nouveaux champs de la phase 8b dans les données de démonstration.

**Pistes notées pour après la première version (non retenues pour l'instant) :** PEPS par lots, seuils selon la rotation, EOQ, notifications (décision 70) ; prix d'achat sur chaque entrée et coût moyen calculé à l'export (décision 71, option B puis C) ; carte réduite à une ligne ou haut qui se cache en défilant, recherche derrière une loupe (décision 76) ; valeur au prix de vente (question 5 de la phase 8b, si le propriétaire suit la recommandation).

**Retard de documentation :** `DEMARRAGE.md` ne décrit ni le carnet de clients (phase 6c), ni la phase 8b, ni l'accueil épuré ; `CLAUDE.md` est à jour pour les clients, pas encore pour la phase 8b (à faire au début de la phase 8b, avec l'accord du propriétaire).

**Point à vérifier (section 3, n° 3) :** taille de lot sûre pour les données de démonstration (phase 11). Pour les suppressions, vérifié en phase 7 (paquets de 100).

**À nettoyer en fin de projet (phases 12 et 13) :** supprimer les comptes de test `test-phase3@example.com`, `test-isolation@example.org` et `test-suppression-1@example.com` (et tout autre compte jetable restant) par le parcours de suppression de la phase 7, ou dans la console Firebase (Authentication) avec leurs données ; supprimer `.env.test`. Le propriétaire peut supprimer dès maintenant l'ancienne copie `C:\Inventory Management`, inutilisée.

### 8.4 Fichiers du projet

| Fichier | Rôle | Phases |
|---|---|---|
| `index.html`, `css/style.css` | Tous les écrans de l'application ; identité visuelle (couleurs en variables au début de `style.css`) ; indicateur de synchronisation et ⚙ dans l'en-tête ; accueil épuré : lignes de produits, panneau de la fiche (`<dialog>`), bouton rond, barre de navigation, icônes SVG ; réserve d'icônes des boutons de contact (`sprite-icones`, décision 77) | 2, 3, 4a, 4b, 5, 6, 6b, identité, 7, 8, 6c, accueil épuré, icônes de contact |
| `images/logo-minstock.svg` | Symbole du logo MinStock, aussi icône d'onglet | identité |
| `js/app.js` | Démarrage, enchaînement des écrans, connexion ; reprise de la suppression du compte ; avertissement de déconnexion, « Effacer les données de cet appareil », stockage durable ; barre de navigation et ⚙ (`mettreAJourNavigation`, `quitterLesCarnets`) ; **bouton retour du téléphone** (`BOUTONS_RETOUR`, niveaux d'écran, `ajusterHistorique`, `surRetourDuTelephone`) ; hauteur de l'en-tête figé (`--hauteur-entete`) ; numéro de version (`VERSION_APP`) | 2, 3, 4a, 4b, 5, 6, 6b, identité, 7, 8, 6c, accueil épuré |
| `js/indicateur-synchro.js` | Indicateur de synchronisation (quatre états, approximatif, libellés courts dans l'en-tête) ; « des modifications attendent-elles ? » pour la déconnexion et l'effacement | 8, accueil épuré |
| `js/fournisseurs.js` | Lecture et écriture des fournisseurs ; limites des champs (décision 54) ; constantes `CARACTERES_TELEPHONE` et `FORME_EMAIL` reprises par les clients | 6b |
| `js/ecran-fournisseurs.js` | Carnet de fournisseurs : liste, recherche, liens de contact, formulaire, suppression ; `quitterEcranFournisseurs` (arrêt de l'écoute quand on quitte par la barre ou ⚙) | 6b, accueil épuré |
| `js/clients.js`, `js/ecran-clients.js` | Carnet de clients : copie adaptée des deux fichiers des fournisseurs (sans « produits fournis », recherche dans les notes) ; limites des champs ; `quitterEcranClients` | 6c, accueil épuré |
| `js/firebase-config.js` | Configuration web Firebase (ce n'est pas un secret) | 2 |
| `js/firebase-init.js` | Démarrage de Firebase, mémoire hors ligne, test du stockage local | 2, 3 |
| `js/auth.js` | Connexion, inscription, mot de passe oublié, déconnexion ; reconnexion et suppression du compte de connexion | 3, 7 |
| `js/messages-erreur.js` | Erreurs Firebase traduites en français | 3, 7 |
| `js/suppression-compte.js` | Suppression du compte : demande (transaction), effacement par paquets de 100 (produits, mouvements, fournisseurs, **clients**), effacement de la copie locale | 7, 6c |
| `js/ecran-suppression.js` | Écrans « Supprimer mon compte » et « Suppression en cours », reprise automatique | 7 |
| `js/entrepot.js` | Document `users/{uid}`, liste des devises ; changement du nom et de la devise | 3, 6 |
| `js/ecran-parametres.js` | Écran « Paramètres » : nom de l'entrepôt, devise tant qu'aucun produit n'existe (décision 49) ; ouvert par ⚙ (`bouton-parametres`) | 6, accueil épuré |
| `js/interface.js` | Fonctions d'affichage partagées ; texte comparable pour les recherches ; `afficherVue` envoie l'événement `vue-changee` (barre de navigation, historique) | 4a, 6b, accueil épuré |
| `js/nombres.js` | **Seule** conversion saisie ↔ entiers ; valeur d'une ligne et total du stock ; marge par unité (`calculerMargeCentimes`) ; conversions pour Excel (`milliemesVersNombre`, `centimesVersNombre`, `dateVersSerieExcel`) | 4a, 5, 8b, 9 |
| `js/export-excel.js` | Export Excel : chargement de SheetJS à la demande, lecture des quatre collections, classeur (feuilles, formats, largeurs, filtres), boutons de Paramètres et de « Supprimer mon compte » ; ne fait que lire | 9 |
| `js/bon-mouvement.js` | Bon imprimable d'un mouvement : référence courte (`referenceDuBon`), construction du bon dans `#zone-impression`, classe `impression-bon` et titre de la page pendant l'impression, `effacerBon` ; ne fait que lire | 9b |
| `js/produits.js` | Lecture et écriture des produits ; stock de départ ; « l'entrepôt contient-il un produit ? » ; liste des types de stock (`TYPES_STOCK`, identique à `firestore.rules`), forme du code SKU, champs facultatifs de la phase 8b | 4a, 4b, 6, 8b |
| `js/ecran-produits.js` | Tableau de bord : valeurs, recherche, alertes, `−1` / `+1`, compteurs et leurs filtres ; **une ligne par produit** (`carteProduit`), « En attente de synchronisation » à la place de « Achat … » ; **fiche du produit** dans un `<dialog>` (`ouvrirFiche`, `remplirFiche`, `fermerFiche`) ; carte repliée pendant une recherche (`recherche-active`) ; formulaire des produits | 4a, 4b, 5, identité, 8, accueil épuré |
| `js/mouvements.js` | Lot d'une opération de stock ; lecture de l'historique ; identifiant `annulation-…` | 4b, 6 |
| `js/operations-en-attente.js` | Suivi local des opérations non confirmées (`localStorage`, clé `operations-en-attente:{uid}`) ; opérations en attente des autres comptes | 4b, 8 |
| `js/ecran-mouvements.js` | Formulaire de mouvement, `envoyerMouvement` (seul chemin d'envoi d'un mouvement), historique avec « Annuler cette opération », opérations refusées ; recherche dans l'historique chargé (décision 84 : `correspondALaRecherche`, `afficherBilanRecherche`) ; bouton « Imprimer » de chaque ligne (`boutonImprimer`, `imprimerMouvement`) | 4b, 5, 6, recherche historique, 9b |
| `firestore.rules` | Règles de sécurité, version 9 | 2, 3, 4a, 4b, 6b, 7, 6c, 8b |
| `tests-regles.html`, `js/tests-regles.js` | **Ne jamais y ajouter d'essai qui touche à `suppressionDemandee` ou supprime l'entrepôt dans la série habituelle** (danger évité en phase 7). Série habituelle : 121 essais des règles sur le vrai serveur quand les trois produits d'essai existent déjà (122 au passage du 2026-11-21, qui a créé `essai-regles-sku`) (compte de test en `@example.com` uniquement, décision 40 ; environ une minute). Série « suppression du compte » : 22 essais, seulement avec un compte jetable `test-suppression…@example.com` (décision 63) ; **connecter ce compte dans la page de test, jamais dans l'application** (la reprise automatique de la suppression effacerait son compte de connexion) | 3, 4a, 4b, dépôt public, 6, 6b, 7, 6c |
| `tests-nombres.html`, `js/tests-nombres.js` | 104 essais de conversion et de calcul, sans connexion | 4a, 5 |
| `vendor/` | SDK Firebase 13.4.0 (import corrigé), SheetJS 0.20.3, police Montserrat et sa licence (`polices/`), `LISEZMOI.md` | 2, identité |
| `demarrer.bat`, `outils/serveur-local.ps1` | Serveur local sur `http://localhost:8080/` | 2 |
| `.gitignore`, `.gitattributes` | Fichiers exclus de Git ; `vendor/*.js` jamais modifiés par Git ; `*.woff2` en binaire | 0, 2, identité |
| `.nojekyll` | Fichier vide : GitHub Pages publie tout tel quel (décision 41) | dépôt public |
| `CLAUDE.md`, `DEMARRAGE.md` | Cahier des charges et méthode de travail ; modifiés avec l'accord du propriétaire (fournisseurs, annulation, suppression au lieu d'archivage des fournisseurs : section 6 de ce fichier ; carnet de clients dans `CLAUDE.md`, phase 6c). `DEMARRAGE.md` n'a pas été mis à jour depuis la phase 6b | 1, évolutions 42 et 43, 6b, 6c |
| `PLAN.md`, `DECISIONS.md`, `README.md` | Suivi, décisions 1 à 91, documentation | Toutes |

**Hors Git :** `.env.test` contient l'adresse et le mot de passe des deux comptes de test et des comptes jetables `test-suppression-1` à `-3@example.com` (2 et 3 supprimés par les essais de la phase 7 ; 1 actif, sans entrepôt, réservé à la série « suppression » de `tests-regles.html`). Il est ignoré par Git et n'apparaît dans aucun commit (vérifié le 2026-11-18). Également hors Git : `C:\GitHub\Inventory Management\.claude\launch.json` (serveur local pour l'outil de travail, section 8.5 point 13).

**État du compte de test dans Firebase :** entrepôt « NzuriDeal » (HTG ; ancien nom « Entrepôt de test », renommé par le propriétaire pendant son test de la phase 6), aucune suppression demandée (vérifié après les essais de la phase 7) ; un fournisseur ajouté par le propriétaire pendant ses essais sur téléphone ; aucun client (vérifié le 2026-11-20) ; 4 produits actifs — dernières quantités vues dans l'application le 2026-11-20 (le propriétaire fait aussi des essais sur son téléphone, elles peuvent avoir changé) : « Ciment » 7,5 sac (stock de départ d'essai de 12,5), « Riz 25 kg (Tchako) » 4 sac, « Essai phase 5 (stock bas) » 5 pièces (seuil 5 : « Stock bas »), « Essai phase 5 (zéro) » 0 pièce (seuil 0 : « Rupture ») ; produits archivés « Huile » et deux « Produit d'essai (règles) » ; plus de 120 mouvements au total (nombre exact non recompté), plus 5 à chaque passage de `tests-regles.html` et 2 à chaque aller-retour `+1` / `−1` des essais. Les mouvements ne peuvent pas être supprimés. Second compte de test `test-isolation@example.org` (créé le 2026-11-18) : entrepôt « Entrepôt isolation (test) » (HTG), aucun produit ; sa devise a été passée à USD puis remise à HTG pendant les essais de la phase 6. Il doit rester sans produit pour pouvoir refaire l'essai du changement de devise. Compte jetable `test-suppression-1@example.com` : plus d'entrepôt depuis les essais du 2026-11-20 (compte de connexion intact) ; réservé à la série « suppression » de `tests-regles.html`, qui recrée et efface ses propres données à chaque passage. **Ne jamais le connecter dans l'application** : seulement dans `tests-regles.html`. Comptes jetables 2 et 3 supprimés par les essais ; le compte jetable créé par le propriétaire sur son téléphone a été supprimé par son essai.

### 8.5 Erreurs rencontrées

1. **Règles publiées mais pas actives tout de suite (phase 3).** Le serveur a refusé l'accès (`permission-denied`) pendant plusieurs minutes après l'annonce de la publication, alors que la connexion, le projet et la base étaient corrects. La version 3 est ensuite devenue active ; la cause n'est pas identifiée. Conduite à tenir : faire vérifier la ligne « Version des regles » dans la console, attendre quelques minutes, relancer `tests-regles.html`. Les versions 4 et 5 n'ont pas posé ce problème.
2. **Mauvais dossier au départ.** L'audit a commencé dans `C:\Inventory Management`, qui n'est pas un dépôt Git. Le vrai dépôt est `C:\GitHub\Inventory Management\inventorymanagement`. Une session ouverte dans l'ancien dossier charge une ancienne version de `CLAUDE.md`.
3. **Git for Windows demandé à tort.** Le Git de GitHub Desktop suffit (section 5, point 2).
4. **Port 8080 déjà occupé.** Quand le propriétaire a lancé `demarrer.bat`, un second serveur ne démarre pas (« Impossible de demarrer le serveur sur le port 8080 ») : sans gravité, il suffit d'utiliser celui qui tourne. Arrêter le serveur lancé par l'assistant fait apparaître une tâche « échouée » : sans gravité.
5. **Outils du navigateur intégré.** Un passage de `tests-regles.html` dure environ une minute, plus que le délai d'un appel de script (45 secondes) : lancer les essais, puis lire le bilan dans un second appel. Un onglet qui affiche un fichier local ne peut pas changer d'adresse : un nouvel onglet s'ouvre, sans conséquence.
6. *(Le défaut de la ligne « En attente de synchronisation » qui faisait bouger les boutons est corrigé en phase 8.)* Retouches mineures faites pendant les tests : message « adresse déjà utilisée » (phase 3) ; effacement du message d'erreur du formulaire de produit (phase 4a) ; « le stock restera négatif » (phase 6) ; longueurs écrites « 1 000 » et nom du fournisseur existant dans l'avertissement de doublon (phase 6b) ; alignement de l'en-tête (identité) ; tournure du message d'arrêt de la suppression (phase 7).
7. **Danger évité dans `tests-regles.html` (phase 7).** L'essai « Demander la suppression du compte », qui attendait un refus, aurait été accepté par les règles version 7 et aurait lancé la suppression du compte de test principal. Il a été retiré avant la publication des règles. Leçon : tout essai qui touche à `suppressionDemandee` ou supprime l'entrepôt se fait uniquement avec un compte jetable (décision 63).
8. **Couper le réseau de Firestore depuis la page (`disableNetwork`) n'arrête pas les transactions** (phase 7) : un essai « sans réseau » a réellement envoyé une demande de suppression (compte jetable 3, sans conséquence). Pour simuler l'absence d'Internet, forcer `navigator.onLine` à faux, ou faire échouer `fetch` vers `identitytoolkit` ; le vrai essai se fait en mode avion sur le téléphone.
9. **Commandes Git : « Exit code 255 » alors que le commit est fait.** Git écrit des avertissements de fins de ligne (LF/CRLF) sur la sortie d'erreur ; l'outil le signale comme une erreur. Toujours vérifier avec `git log --oneline -1`. Un message de commit contenant des guillemets droits casse la commande PowerShell : écrire les messages sans guillemets.
10. **Navigateur intégré.** Quand le panneau est caché, captures d'écran et clics échouent parfois (« tab not ready ») : réessayer, ou passer par la lecture de la page et le JavaScript. Juste après le démarrage du serveur local, une navigation peut échouer : réessayer après une seconde. En largeur 360 pixels simulée, les captures peuvent être rognées : mesurer les éléments plutôt que se fier à l'image.
11. **PDF de la maquette illisible directement** (programme `pdftoppm` absent) : les 8 images JPEG ont été extraites du PDF par un petit script PowerShell (lecture seule), dans le dossier temporaire de la session. *(Le 2026-11-20, le PDF « MinStock, accueil épuré » a pu être lu directement par l'outil de lecture.)*
12. **Saisir le mot de passe de test sans l'écrire dans la conversation (phase 8).** Dans le navigateur intégré, coller (Ctrl+V) et lire le presse-papiers ne fonctionnent pas. Méthode utilisée : un petit script PowerShell (`servir-mdp.ps1`, paramètre `-Cle`, par exemple `TEST_MOT_DE_PASSE` ou `TEST_SUPPRESSION_1_MOT_DE_PASSE`), gardé dans le dossier temporaire de la session, lit la valeur dans `.env.test` et la sert **une seule fois** sur `http://localhost:8091/` à la page `http://localhost:8080/` (en-tête CORS), puis s'arrête (au plus 120 secondes) ; la page la place dans le champ et envoie le formulaire. La valeur n'apparaît ni à l'écran ni dans la conversation. Le dossier temporaire change d'une session à l'autre : recréer le script (`HttpListener` sur `http://localhost:8091/`, une requête, en-tête `Access-Control-Allow-Origin: http://localhost:8080`).
13. **Fichier `.claude/launch.json` (phase 8).** Le serveur local est lancé depuis le dossier parent `C:\GitHub\Inventory Management` par `.claude/launch.json` (configuration `minstock-local` : `powershell -File inventorymanagement/outils/serveur-local.ps1 -SansNavigateur`, port 8080). Ce fichier est hors du dépôt Git.
14. **Simuler une coupure sur l'ordinateur (phase 8).** Dans la page, `import('/vendor/firebase-firestore.js')` et `getFirestore(getApp())` donnent la même instance que l'application : `disableNetwork` / `enableNetwork` suffisent pour l'indicateur et les écritures en attente (pas pour les transactions, point 8). Forcer `navigator.onLine` à faux et envoyer l'événement `offline` teste l'autre source de l'indicateur.
15. **Onglet en arrière-plan du navigateur intégré (accueil épuré).** Dans un onglet qui n'est pas au premier plan, les animations restent bloquées, les minuteries sont ralenties et certains événements (`close` d'un `<dialog>`) n'arrivent pas : le panneau de la fiche restait hors de l'écran (animation figée au départ) et l'indicateur ne changeait plus d'état. Corrections : animation du panneau retirée ; fermeture du panneau gérée directement (sans attendre l'événement `close`). Conduite à tenir : fermer les onglets en trop et mettre l'onglet d'essai au premier plan (`tabs_select`) avant de tester.
16. **Bouton retour et historique du navigateur (décision 75).** Chrome ignore au retour les entrées d'historique ajoutées sans geste de l'utilisateur : une première version qui remettait une entrée après un retour aurait fait quitter le site au retour suivant. Solution : une entrée par niveau d'écran (0, 1 ou 2), ajoutée au moment du toucher ; les entrées en trop sont retirées par `history.go()` quand on remonte par un bouton de l'application.
17. **Indicateur sur trois lignes (décision 76).** « Hors ligne » avec « Envoi en attente » passait sur trois lignes à côté de ⚙ et faisait descendre toute la page de 6 pixels : remplacé par « À envoyer ». Toujours mesurer la hauteur de l'en-tête dans les cinq affichages de l'indicateur après un changement de l'en-tête.
18. **Compte jetable et reprise automatique de la suppression (phase 6c).** Connecter `test-suppression-1@example.com` dans l'application pourrait déclencher la reprise automatique d'une suppression demandée, qui effacerait aussi son compte de connexion. Il a été connecté uniquement dans `tests-regles.html` (connexion par `signInWithEmailAndPassword` dans la page), puis déconnecté.
19. **Erreurs anciennes dans la console.** Les refus « Missing or insufficient permissions » affichés avant la publication des règles version 8 restent dans l'historique de la console de l'onglet. Pour vérifier qu'il n'y a pas d'erreur, ouvrir un onglet neuf.
20. **Ordre des décisions.** La décision 74 a d'abord été insérée avant la 73 dans `DECISIONS.md` ; l'ordre a été rétabli. Toujours ajouter une décision à la fin du fichier.
21. **Vérifier une impression sans imprimante (étape 9b).** Chrome sans fenêtre fait un vrai PDF avec le rendu d'impression : `chrome.exe --headless=new --user-data-dir=<dossier temporaire> --virtual-time-budget=4000 --print-to-pdf=<fichier.pdf> <adresse>` (Chrome est dans `C:\Program Files\Google\Chrome\Application\`). La page doit être servie par `http://localhost:8080/` (modules JavaScript) ; une page d'essai temporaire, non publiée, prépare le bon puis est supprimée. Ce mode ajoute d'habitude la date et l'adresse en haut et en bas de page : leur absence sur le bon prouve que la marge de page nulle les retire. Pour la connexion dans le navigateur intégré, le script du point 12 a été recréé sous le nom `servir-compte.ps1` (sert l'adresse et le mot de passe du compte de test en une seule réponse).

### 8.6 Décisions prises

Toutes sont dans `DECISIONS.md` (91 décisions, aucune effacée) :

- **1 à 7 (choix initiaux) :** Firestore en plan Spark ; connexion Google et e-mail ; quantités et prix en entiers ; `dernierMouvementId` ; GitHub Pages ; publication du code par le propriétaire.
- **8 à 15 (audit) :** page `tests-regles.html` à la place du simulateur ; règles tolérantes au hors-ligne et suivi local des opérations ; dépôt public dès la fin de la phase 4b ; SDK local corrigé et serveur local ; règles produit-mouvement complétées ; suppression du compte avec reconnexion d'abord ; phase 4 coupée en deux ; dossier de travail.
- **16 et 17 (phase 2) :** versions fixes Firebase 13.4.0 et SheetJS 0.20.3 ; port 8080 toujours le même.
- **18 à 21 (phase 3) :** devises HTG, USD, EUR, DOP, CAD ; pas de vérification de l'adresse e-mail ; premier lancement seulement si le serveur confirme qu'aucun entrepôt n'existe ; mot de passe de 8 caractères au moins.
- **22 à 31 (phase 4a) :** écoute des seuls produits non archivés ; archivage définitif ; produits archivés hors de la valeur du stock ; archivage possible avec du stock ; noms de produits uniques dans le formulaire ; unité obligatoire ; règles de saisie des nombres ; limites des nombres ; calcul de la valeur en grands entiers ; `updatedAt` à l'heure du serveur exigé.
- **32 à 39 (phase 4b) :** historique trié par heure du serveur ; types Entrée, Sortie, Ajustement ; stock négatif autorisé et signalé ; signe cohérent avec le type ; mouvements acceptés sur un produit archivé ; suivi des mouvements et des créations de produit ; stock de départ par un mouvement ; identifiants contrôlés.
- **40 et 41 (étape « dépôt public ») :** page `tests-regles.html` réservée aux comptes en `@example.com` ; fichier `.nojekyll` pour GitHub Pages.
- **42 et 43 (évolutions demandées par le propriétaire) :** carnet de fournisseurs en phase 6b ; « Annuler cette opération » par opération inverse en phase 6.
- **44 à 46 (phase 5) :** boutons `+1` / `−1` (formulaire prérempli si le stock deviendrait négatif) ; total du stock égal à la somme des lignes, stock négatif compté en négatif ; recherche sans majuscules ni accents, alertes « Stock bas » et « Rupture ».
- **47 à 49 (phase 6) :** pas de filtre par produit dans l'historique pour l'instant ; cas où « Annuler cette opération » n'apparaît pas (annulation, déjà annulée, en attente, produit archivé) ; devise modifiable seulement si le serveur confirme qu'aucun produit n'existe.
- **50 à 54 (phase 6b) :** fournisseur supprimé définitivement (plus d'archivage, décision 42 modifiée) ; noms en double autorisés avec avertissement ; liste écoutée seulement pendant que l'écran est ouvert ; boutons « Appeler », « WhatsApp », « E-mail » ; limites des champs.
- **55 à 58 (identité visuelle) :** nom « MinStock » ; identité appliquée sans ajouter ni retirer de fonction (couleurs vérifiées, éléments de la maquette hors périmètre non repris) ; police Montserrat locale ; symbole SVG et trois compteurs dans la carte de valeur.
- **59 (demande du propriétaire) :** compteurs cliquables qui filtrent la liste des produits ; la liste filtrée ne bouge pas sous le doigt.
- **60 à 63 (phase 7) :** double confirmation et reconnexion avant la suppression ; règles version 7 (demande sans retour, effacements seulement après la demande, ajouts bloqués pendant la suppression) ; déroulement par paquets de 100 (produits avant mouvements), reprise automatique, effacement de la copie locale ; essais avec des comptes jetables.
- **64 à 68 (phase 8) :** indicateur de synchronisation à quatre états dans l'en-tête, approximatif ; « En attente » à la place de « Quantité » ; avertissement avant « Se déconnecter » ; « Effacer les données de cet appareil et me déconnecter » ; stockage durable demandé au navigateur.
- **69 à 71 (demandes du propriétaire du 2026-11-19) :** phase 8b (code SKU, type de stock, quantité à commander, prix de vente, tous facultatifs ; règles version 9 depuis la décision 72) ; PEPS par lots, rotation, EOQ et notifications écartés de la première version ; prix d'achat saisi à la main conservé, sans coût moyen pondéré (option A ; prix de l'arrivage noté dans le motif).
- **72 et 73 (demande du propriétaire du 2026-11-20) :** carnet de clients en phase 6c, copie du carnet de fournisseurs sans case VIP (« VIP » dans les notes), règles version 8 ; carnet indépendant du stock, sans gestion des ventes.
- **74 (demande du propriétaire du 2026-11-20) :** accueil épuré d'après sa maquette, identité inchangée : lignes de produits, fiche dans un panneau, bouton rond, barre de navigation en bas (modifie la décision 56), ⚙ vers Paramètres, libellés courts de l'indicateur.
- **75 (demande du propriétaire du 2026-11-20) :** en-tête et haut des écrans figés (sur l'accueil : nom, carte, recherche) ; flèche ← à la place de « Retour aux produits » ; bouton retour du téléphone dans l'application.
- **76 (demande du propriétaire du 2026-11-20) :** partie figée réduite : espaces resserrés, carte repliée tant que la recherche contient du texte, bouton rond « + » sur Fournisseurs et Clients.
- **77 (demande du propriétaire du 2026-11-21) :** boutons « Appeler », « WhatsApp », « E-mail » des fournisseurs et des clients affichés comme une icône avec son nom dessous (précise la décision 53).
- **78 à 83 (phase 8b, réponses du propriétaire du 2026-11-21) :** code SKU toujours présent dans le formulaire, facultatif à remplir, unique quand il est rempli ; types de stock (liste fixe, « Non classé » par défaut), recherche par type au lieu d'un filtre ; quantité à commander facultative, affichée en « Stock bas » ou « Rupture » ; prix de vente facultatif avec avertissement s'il est plus bas que le prix d'achat, jamais dans la valeur du stock ; marge par unité dans la fiche ; règles version 9.
- **84 (demande du propriétaire du 2026-11-21) :** recherche dans l'historique (produit, type, motif) sur les mouvements déjà chargés, sans lecture de plus ; elle ne filtre que l'affichage (annulation inchangée) ; précise la décision 47.
- **85 à 88 (phase 9, réponses du propriétaire du 2026-11-21) :** export Excel toujours complet, filtré dans Excel (flèches de filtre) ; bloc « Sauvegarde » en haut de Paramètres et bouton sur « Supprimer mon compte » ; contenu des quatre feuilles (archivés compris, statut des mouvements, code SKU) ; lecture serveur ou copie de l'appareil avec question, SheetJS chargé à la demande.
- **89 à 91 (étape 9b, demande du propriétaire du 2026-11-21) :** bouton « Imprimer » sur chaque ligne de l'historique, bon d'un seul mouvement ouvert dans la fenêtre d'impression (imprimante ou PDF), ne fait que lire ; contenu (entrepôt, titre, référence courte, date, produit et code, quantité, motif, mentions annulée / en attente, deux signatures ; ni prix, ni fournisseur, ni numéros suivis) ; mise en page épurée et symétrique pensée pour le papier, sans mentions du navigateur.

Les règles de conception de la section 7 restent à respecter dans toute la suite.

### 8.7 Prochaine action précise

*(Mise à jour du 2026-11-21, après la phase 9.)* Phases 8b, recherche dans l'historique et 9 faites ; seule la phase 9 attend encore l'essai du propriétaire sur son téléphone. **Prochaine action :** (1) le propriétaire fait **Push origin** et essaie l'export sur son téléphone (guide : « Version 0.18.0 » dans Paramètres ; bloc « Sauvegarde » ; « Exporter le stock (Excel) » ; ouvrir le fichier depuis « Téléchargements » ; vérifier les quatre feuilles, les dates, les nombres et les flèches de filtre, par exemple filtrer l'historique sur un produit) ; (2) ensuite, **phase 10, application installable (PWA)** : commencer par expliquer au propriétaire ce qui va changer (manifeste, icônes, service worker qui garde les fichiers de l'application, dont SheetJS, jamais les échanges avec Firebase ; bouton « Nouvelle version disponible ») et les questions éventuelles (icône d'application à partir du logo, nom court « MinStock »), puis attendre son accord.

*(Mise à jour du 2026-11-21, après l'étape 9b.)* **Étape 9b (bon imprimable) faite, version 0.19.0 ; essai sur le téléphone à faire par le propriétaire** : **Push origin** (aucune règle à publier), puis « Version 0.19.0 » dans Paramètres ; Mouvements ; « Imprimer » sur une ligne ; dans la fenêtre d'impression, « Enregistrer au format PDF » ; ouvrir le PDF et vérifier que le bon est centré, sur une page, sans adresse de site ; essayer aussi une ligne annulée. Ensuite, reprendre la phase 10 ci-dessous (ses trois questions attendent toujours la réponse du propriétaire ; décisions **92 et suivantes**).

*(Mise à jour du 2026-11-21 : phase 9 terminée, essai sur smartphone réussi.)* **Phase 10 : explication et questions présentées au propriétaire le 2026-11-21, réponse attendue.**

Ce qui est prévu : `manifest.webmanifest` (nom « MinStock », `start_url` et `scope` relatifs `./`, affichage plein écran sans barre d'adresse, couleurs de l'identité) ; icônes PNG tirées du symbole `images/logo-minstock.svg` (192 et 512 pixels, une version « maskable » pour Android, 180 pixels pour iPhone) ; `service-worker.js` à la racine qui garde **seulement les fichiers de l'application** (HTML, CSS, JS, `vendor/` dont SheetJS et la police, images), **jamais les échanges avec Firebase** ; cache nommé avec la version de l'application ; bandeau « Nouvelle version disponible ». Rien ne change dans les données ni dans les règles.

| # | Question | Recommandation de l'assistant |
|---|---|---|
| 1 | Icône de l'application sur le téléphone ? | Le symbole MinStock (bleu nuit et doré) sur le fond blanc cassé de l'identité (`#ECE9E4`), avec une marge pour qu'Android puisse l'arrondir ; nom « MinStock » sous l'icône (décision 55). |
| 2 | Un bouton « Installer l'application » dans MinStock ? | Non : Chrome propose lui-même l'installation (menu ⋮ > « Installer l'application » ou « Ajouter à l'écran d'accueil ») ; une courte explication dans Paramètres et dans le README. Moins de code, rien à maintenir. |
| 3 | Mise à jour après une nouvelle publication ? | Un bandeau « Nouvelle version disponible » avec un bouton « Mettre à jour », que l'utilisateur touche quand il veut ; jamais de rechargement automatique (il ferait perdre un formulaire en cours de saisie). |

Risques à expliquer : une ancienne version qui reste affichée (évité par le cache nommé avec la version et le bandeau) ; connexion Google dans l'application installée, à essayer sur le téléphone ; iPhone (installation par Safari, mémoire séparée) non essayé ; la toute première ouverture demande toujours Internet.

**Questions de la phase 9 (répondues le 2026-11-21, décisions 85 à 88 ; gardées pour mémoire) :**

| # | Question | Recommandation de l'assistant |
|---|---|---|
| 1 | Produits archivés dans la feuille `Stock` ? | Oui, après les produits actifs, avec une colonne « Archivé » (Oui / Non) : l'export est la seule sauvegarde, il doit tout contenir. Coût : une lecture par produit archivé à chaque export. |
| 2 | Où placer le bouton « Exporter le stock (Excel) » ? | En haut de Paramètres (⚙), dans un bloc « Sauvegarde » qui rappelle que c'est la seule sauvegarde ; et un bouton « Exporter » sur l'écran « Supprimer mon compte » (décision 60). Pas sur l'accueil (place, décision 76). |
| 3 | Colonnes de chaque feuille ? | `Stock` : nom, code SKU, type, unité, quantité, seuil, alerte (Stock bas / Rupture), quantité à commander, prix d'achat, prix de vente, marge par unité, valeur (indicative), archivé. `Historique` (du plus récent au plus ancien) : fait le, reçu par le serveur le, produit, type, quantité (+ / −), unité, motif, annulée (Oui / Non). `Fournisseurs` : nom, téléphone, WhatsApp, e-mail, adresse, produits fournis, notes. `Clients` : les mêmes, sans produits fournis. |

**Réponse du propriétaire (2026-11-21) : « Oui » aux trois recommandations**, avec deux nouvelles demandes : (a) pouvoir filtrer ce qu'on exporte (par produit…) sans nuire à l'application ; (b) s'inspirer d'un export de mouvements qu'il a fourni (fichier `Kinder Saint Franc _ Mouvements de produit (Ligne de mouvement de stock).xlsx`, dans ses Téléchargements, non copié dans le dépôt). Analyse du fichier : une feuille « Sheet1 », colonnes Date (date et heure Excel), Référence (numéros suivis par type : `…/IN/00001`, `…/OUT/00001`, `…/INT/00001`), Produit (`[code] nom`), De, Vers (emplacements « Etagère A/B », « Vendors », « Customers »), Quantité (sans signe), Statut (« Terminé ») ; une ligne de regroupement par produit avec le nombre de lignes et la somme des quantités ; titres en gras, largeur de colonnes réglée. Options présentées le 2026-11-21 (**option A choisie** par le propriétaire) : **A (recommandée)** export toujours complet, avec les boutons de filtre d'Excel sur la ligne de titres de chaque feuille ; **B** choix d'un produit et/ou d'une période dans l'application avant l'export (filtre après lecture, aucun index ni règle ; fichier nommé autrement et marqué « export partiel, pas une sauvegarde »). Inspirations proposées : colonne « Code SKU » dans `Historique` ; colonne « Statut » (Terminé / Annulé / En attente d'envoi) à la place de « Annulée » ; dates avec l'heure ; largeurs de colonnes. Écartées : numéros de référence suivis (compteur partagé, conflits hors ligne entre appareils, règles à changer), De / Vers et emplacements (un seul entrepôt, pas de lien mouvement-fournisseur ou client : décisions 42 et 73, `CLAUDE.md` section 4), lignes de regroupement avec sommes (somme de quantités sans signe trompeuse ; Excel sait trier et filtrer), titres en gras (impossible avec la version gratuite de SheetJS).

Réglages prévus par défaut : montants et quantités en vrais nombres (Excel peut les additionner), devise dans le titre des colonnes de prix ; dates en vraies dates Excel ; SheetJS (930 Ko) chargé seulement au moment de l'export, pas à l'ouverture de l'application ; avertissement hors ligne ou avec des opérations en attente (`CLAUDE.md`, section 10) ; fichier `stock_AAAA-MM-JJ.xlsx`. Limite à dire : avant la phase 10 (service worker), l'export sans Internet peut échouer si la bibliothèque Excel n'est pas déjà dans la mémoire du navigateur. Rappeler le coût en lectures (une par mouvement, produit, fournisseur et client à chaque export) et que l'export est la seule sauvegarde.

**Questions de la phase 8b** (répondues le 2026-11-21, décisions 78 à 83 ; gardées pour mémoire) :

| # | Question | Recommandation |
|---|---|---|
| 1 | Code SKU obligatoire ? | Non, facultatif ; lettres, chiffres et tirets, 50 caractères au plus ; code déjà utilisé signalé dans le formulaire (comme les noms, décision 26) ; trouvable par la recherche. |
| 2 | Liste des types de stock ? | Matière première / composant, En-cours de fabrication, Produit fini, Consommable, et « Non classé » par défaut (produits existants) ; filtre par type sans lecture de plus. |
| 3 | Marge par unité ? | Oui, dans la fiche du produit (panneau), seulement si le prix de vente est rempli ; calcul sur l'appareil. |
| 4 | Avertir si le prix de vente est plus bas que le prix d'achat ? | Oui, une question « Enregistrer quand même ? », jamais un refus. |
| 5 | Valeur du stock au prix de vente ? | Non pour l'instant (piste pour plus tard). |

Par défaut, sauf avis contraire : « quantité à commander » affichée seulement quand le produit est en « Stock bas » ou « Rupture » ; code, type, prix de vente et marge dans la fiche du produit, pour garder les lignes de l'accueil compactes ; prix de vente en centimes, comme le prix d'achat (décision 4).

1. **Propriétaire :** **Push origin** (version 0.18.0, aucune règle à publier), puis essai de l'export sur le téléphone (guide ci-dessus). *(Faits le 2026-11-21 : règles version 9 publiées ; essais sur le téléphone des phases 8b et de la recherche dans l'historique réussis.)* Non confirmé explicitement : l'essai des icônes de contact centrées (versions 0.15.x), utilisées depuis dans les versions suivantes. Toujours en attente : les deux tests de la phase 3 et le message d'aide quand la fenêtre Google est bloquée. Conseillé : activer la validation en deux étapes du compte Google qui gère la console Firebase.
2. **Assistant, au début de la prochaine session** (ouverte dans `C:\GitHub\Inventory Management\inventorymanagement` ou dans son dossier parent) : lire `CLAUDE.md`, `PLAN.md` et `DECISIONS.md`. Demander le résultat de l'essai de l'export sur le téléphone s'il n'est pas noté ici, et le noter. Demander aussi le résultat de l'essai du bon imprimable (étape 9b). Puis préparer la phase 10 (section 2) : explication au propriétaire, questions, accord ; noter les **décisions 92 et suivantes** à la fin de `DECISIONS.md` (89 à 91 : étape 9b). Points à prévoir en phase 10 : le service worker met en cache `vendor/xlsx.full.min.js` (export sans Internet) ; chemins relatifs (`./`) pour rester compatible avec un autre hébergeur ; test « rouvrir l'application en mode avion » (décision 14) ; bouton « Nouvelle version disponible ». Tester sur `http://localhost:8080/` avec `test-phase3@example.com` (mot de passe servi par le script du point 12 de la section 8.5, jamais dans la conversation).
3. **Rappels pour la suite :** rappeler au propriétaire de ne pas trop compliquer l'application quand une demande ajoute de la complexité (son souhait du 2026-11-19) ; ne jamais faire de `git push` ; ne jamais essayer la suppression du compte avec un vrai compte ; ne connecter le compte jetable que dans `tests-regles.html` ; ne jamais ajouter d'essai touchant à `suppressionDemandee` dans la série habituelle de `tests-regles.html` ; après la mise en service, ne publier que des règles compatibles avec les versions de l'application déjà ouvertes sur les téléphones (section 7) ; tester dans l'onglet au premier plan du navigateur intégré (section 8.5, point 15).
