# MinStock

Application web de gestion de stock pour un entrepôt, utilisable sur ordinateur et smartphone, y compris avec une connexion Internet instable.

Le projet est en cours de construction. L'avancement est suivi dans `PLAN.md`.

## Ce que l'application fait pour l'instant

- Créer un compte et se connecter, avec Google ou avec une adresse e-mail et un mot de passe.
- Demander un nouveau mot de passe (« Mot de passe oublié »).
- Créer son entrepôt au premier lancement : nom et devise.
- Afficher le texte de confidentialité depuis l'écran de connexion.
- Ajouter, modifier et archiver un produit : nom, unité, seuil d'alerte, prix d'achat, stock de départ ; et, facultatifs, code SKU, type de stock, quantité à commander, prix de vente (phase 8b).
- Enregistrer des mouvements de stock : entrée, sortie, ajustement, avec un motif facultatif.
- Consulter l'historique : les 50 derniers mouvements, puis « Voir plus » ; y chercher par produit, par type d'opération (« sortie »…) ou par motif. La recherche porte sur les mouvements déjà chargés : pour chercher plus loin, touchez « Voir plus » (décision 84). Pour tout l'historique, utilisez l'export Excel.
- Exporter tout le stock, l'historique, les fournisseurs et les clients dans un fichier Excel (Paramètres > Sauvegarde) : c'est la seule sauvegarde.
- Annuler une opération faite par erreur, depuis l'historique.
- Signaler les opérations que le serveur a refusées, même après fermeture de l'application.
- Tableau de bord : valeur du stock (indicative), recherche par nom, alertes « Stock bas » et « Rupture », boutons rapides `−1` et `+1`.
- Paramètres : changer le nom de l'entrepôt ; changer la devise tant que l'entrepôt ne contient aucun produit ; supprimer son compte et toutes ses données.
- Carnet de fournisseurs : ajouter, modifier, supprimer, rechercher, et appeler ou écrire en un appui.
- Carnet de clients : même fonctionnement que les fournisseurs, pour les clients réguliers (« VIP » s'écrit dans les notes).
- Indicateur de synchronisation en haut de l'écran ; avertissement avant de se déconnecter s'il reste des modifications non envoyées ; effacement des données de l'appareil (appareil partagé).
- Accueil épuré : une ligne par produit, fiche du produit dans un panneau qui monte du bas, barre de navigation en bas (Stock, Mouvements, Fournisseurs, Clients), Paramètres derrière l'icône ⚙.

## Identité visuelle

- **Nom :** MinStock (« Min » en bleu nuit, « Stock » en bleu).
- **Symbole :** `images/logo-minstock.svg`, redessiné en format vectoriel d'après le logo du propriétaire ; il sert aussi d'icône dans l'onglet du navigateur.
- **Couleurs :** bleu nuit `#213547`, bleu `#2E618D`, doré `#C09D63` (toujours avec un texte foncé ; `#7A5F2C` quand le doré sert de texte), fond `#ECE9E4`. Toutes sont définies au début de `css/style.css`, et leurs contrastes ont été vérifiés pour rester lisibles en plein soleil.
- **Police :** Montserrat pour le nom, les titres et les grands chiffres (licence libre SIL OFL, fichier copié dans `vendor/polices/` avec sa licence) ; la police du téléphone pour le reste du texte.
- La maquette du propriétaire contient d'autres idées (scanner, rapports, notifications…) qui ne font pas partie de cette version : voir la décision 56. La barre de navigation en bas a été ajoutée ensuite, avec l'accueil épuré (décision 74).
- **Icônes** (⚙, ⓘ, loupe, barre du bas) : dessinées directement dans `index.html`, sans bibliothèque ni fichier chargé depuis Internet.

## Tableau de bord

Disposition « accueil épuré » (décision 74), d'après la maquette du propriétaire :

- **En haut :** le nom MinStock, l'indicateur de synchronisation et l'icône ⚙ (Paramètres : nom de l'entrepôt, devise, compte, « Se déconnecter », version).
- **Carte bleu nuit :** valeur du stock et compteurs ; l'icône ⓘ affiche l'explication du calcul.
- **Une ligne par produit :** nom (deux lignes au plus), « Achat … · seuil … », alertes écrites, puis `−1`, la quantité avec son unité, `+1`. Tant que le serveur n'a pas confirmé, « En attente de synchronisation » remplace « Achat … » sans changer la hauteur de la ligne.
- **Toucher le nom d'un produit** ouvre sa fiche dans un panneau qui monte du bas : `−1` / `+1`, code SKU, type de stock, seuil, quantité à commander, prix d'achat, prix de vente et marge, valeur, « Mouvement de stock », « Modifier » (les lignes vides ne sont pas affichées). Il se ferme avec ✕, en touchant le fond gris, avec Échap ou avec le bouton retour du téléphone.
- **Bouton rond `+`** en bas à droite : ajouter un produit (à ne pas confondre avec `+1` sur une ligne, qui ajoute une unité).
- **Barre en bas :** Stock, Mouvements, Fournisseurs, Clients. Elle n'apparaît que sur ces quatre écrans, pas dans les formulaires ni dans Paramètres.
- **Haut figé (décisions 75 et 76) :** l'en-tête reste toujours en haut. Sur l'accueil, le nom de l'entrepôt, la carte de valeur et la recherche restent aussi en haut : seule la liste défile (environ 5 produits visibles à la fois sur un téléphone moyen). **Pendant une recherche** (dès qu'une lettre est tapée), la carte de valeur se replie pour laisser voir les produits trouvés au-dessus du clavier ; elle revient quand le champ est vidé. Sur Fournisseurs et Clients, le titre et la recherche restent en haut, et « Ajouter » est le bouton rond « + » en bas à droite ; sur Mouvements et Paramètres, le titre reste en haut.
- **Revenir en arrière :** la flèche ← à gauche du titre, ou le **bouton retour du téléphone**. Depuis un formulaire, le retour fait comme « Annuler » (ce qui était tapé n'est pas enregistré). Sur l'accueil, le bouton retour du téléphone quitte l'application, comme d'habitude ; si la fiche d'un produit est ouverte, il la ferme.

- **Valeur du stock (indicative)** : pour chaque produit, quantité × prix d'achat **actuel** ; en haut de l'écran, le total de l'entrepôt, égal à la somme des lignes, avec trois compteurs (nombre de produits, « Stock bas », « Ruptures ») calculés sur l'appareil.
- **Compteurs cliquables** : toucher « Stock bas » ou « Ruptures » n'affiche que les produits concernés (l'écran descend jusqu'à la liste) ; « Produits » ou « Tout afficher » montrent de nouveau tout. Un produit qui sort de l'alerte pendant que vous travaillez reste affiché jusqu'au prochain choix de filtre, pour que la liste ne bouge pas sous le doigt. Choisir un filtre vide la recherche ; le filtre s'enlève en ajoutant un produit et à la déconnexion. Modifier un prix d'achat change la valeur de tout le stock de ce produit. Un stock négatif compte en négatif. Les produits archivés ne comptent pas.
- **Recherche** : par nom de produit, par code SKU ou par type de stock (taper « fini » affiche les produits finis), sans tenir compte des majuscules ni des accents (`cimént` trouve « Ciment »). Elle ne porte que sur les produits de la liste et ne consomme aucune lecture du quota gratuit. Le total reste celui de tout l'entrepôt.
- **Alertes**, toujours écrites et pas seulement colorées :
  - « Stock bas » (orange) quand la quantité est inférieure ou égale au seuil d'alerte ;
  - « Rupture » (rouge) quand la quantité est à 0 ou en dessous.
- **Boutons `+1` et `−1`** : chaque appui enregistre aussitôt une entrée ou une sortie d'une unité du produit (un sac, un kg…), sans motif, exactement comme un mouvement saisi dans le formulaire. Chaque appui laisse une ligne dans l'historique et coûte deux écritures du quota gratuit : pour une grande quantité, utiliser « Mouvement de stock ». Si un `−1` rendait le stock négatif, le formulaire s'ouvre déjà rempli, avec l'avertissement : rien n'est envoyé sans confirmation.

### Code SKU, type de stock, quantité à commander, prix de vente (phase 8b)

Dans le formulaire d'un produit (décisions 78 à 82) :

- **Code SKU (facultatif)** : la référence du produit, tapée au clavier (pas de lecteur de codes-barres). Lettres sans accent, chiffres et tirets, sans espace, 50 caractères au plus, par exemple `RIZ-25KG`. Deux produits de la liste ne peuvent pas avoir le même code (majuscules ignorées). Une variante (taille, couleur…) est un produit à part, avec son propre code.
- **Type de stock** : Matière première / composant, En-cours de fabrication, Produit fini, Consommable, ou Non classé (par défaut). C'est une simple étiquette. Les produits créés avant la phase 8b sont « Non classé ».
- **Quantité à commander (facultatif)** : un rappel que vous choisissez ; il s'affiche sur la ligne du produit (« À commander : 20 sac ») seulement en « Stock bas » ou « Rupture ». L'application ne la calcule pas. 0 ou un champ vide = pas de rappel.
- **Prix de vente unitaire (facultatif)** : une information sur le produit. S'il est plus bas que le prix d'achat, l'application demande « Enregistrer quand même ? ». Il n'entre jamais dans la valeur du stock, toujours calculée au prix d'achat, et l'application ne gère pas les ventes.
- **Fiche du produit** : elle affiche le code (s'il existe), le type, la quantité à commander, le prix de vente et la **marge par unité** (prix de vente moins prix d'achat ; négative en cas de vente à perte).

Limite : deux téléphones hors ligne peuvent donner le même code à deux produits (comme pour les noms) ; un produit archivé n'est pas vérifié.

## Mouvements de stock

- La quantité d'un produit ne change que par un mouvement. Chaque mouvement laisse une ligne dans l'historique.
- **Entrée** et **Sortie** : saisir la quantité sans signe. **Ajustement** : saisir la correction avec son signe (`-2,5` ou `+3`).
- Un mouvement enregistré ne peut être ni modifié ni supprimé. Une erreur se corrige avec « Annuler cette opération » dans l'historique (voir plus bas), ou par un mouvement d'ajustement.
- Un stock peut devenir négatif. L'application avertit avant l'enregistrement et affiche ensuite « Stock négatif : à vérifier ». Avec plusieurs appareils hors ligne, elle ne peut pas l'empêcher.
- Un mouvement apparaît tout de suite. Tant que le serveur ne l'a pas confirmé, la ligne du produit affiche « En attente de synchronisation » à la place de « Achat … » (même hauteur : rien ne bouge), le panneau du produit affiche « en attente » sous la quantité, et l'historique affiche « En attente de synchronisation ».
- **Arrivage à un nouveau prix :** noter le prix dans le motif de l'entrée (par exemple « Arrivage à 1 200 HTG le sac »), puis corriger le prix d'achat dans la fiche du produit avec « Modifier ». L'application ne calcule pas de coût moyen : la valeur du stock utilise le dernier prix d'achat saisi (décision 71).
- L'historique est rangé selon l'heure de réception par le serveur. L'heure indiquée « Fait le » est celle de l'appareil au moment de l'opération ; si l'écart dépasse 5 minutes, les deux sont affichées.

### Annuler une opération faite par erreur

Dans l'historique, chaque opération propose « Annuler cette opération ». Une fenêtre de confirmation montre l'opération et le stock prévu après l'annulation, avec un avertissement s'il est négatif. Après confirmation, l'application enregistre l'opération inverse : un ajustement de valeur opposée, dont le motif décrit l'opération annulée (par exemple « Annulation : Sortie -1 sac du 18/11/2026 14:32 »). L'opération d'origine reste dans l'historique, marquée « Annulée le … ». Rien n'est effacé.

- L'annulation retire seulement l'effet de cette opération : les opérations faites depuis restent comptées.
- Une opération ne peut être annulée qu'une fois. Si on l'annule sur deux appareils, le serveur refuse la seconde fois et l'application l'indique : rien n'est compté deux fois.
- Le bouton n'apparaît pas sur une annulation (une annulation ne s'annule pas : refaire l'opération voulue), sur une opération déjà annulée, sur une opération encore « En attente de synchronisation », ni sur un produit archivé.

### Imprimer le bon d'une opération (étape 9b)

Chaque ligne de l'historique a un bouton **« Imprimer »**, en haut à droite. Il ouvre la fenêtre d'impression du navigateur : choisir une imprimante, ou **« Enregistrer au format PDF »** pour garder le bon ou l'envoyer (par exemple par WhatsApp).

- **Un bon = une opération = un produit :** « Bon d'entrée », « Bon de sortie » ou « Ajustement de stock ».
- **Sur le bon :** le nom de l'entrepôt, une référence courte (8 caractères ; `A-…` pour une annulation), la date et l'heure de l'opération, le produit avec son code SKU actuel (si le produit n'est pas archivé), la quantité avec l'unité, le motif, et deux zones de signature (« Remis par » et « Reçu par » ; « Établi par » et « Vérifié par » pour un ajustement). Une opération annulée, ou pas encore confirmée par le serveur, porte une mention encadrée.
- **Le fournisseur ou le client :** écrire son nom dans le motif (par exemple « Livraison Komès Nò ») ; il apparaît sur le bon.
- **Pas de prix** sur le bon : le mouvement ne garde pas le prix du jour.
- La mise en page est faite pour le papier (A4 ou Letter, au choix dans la fenêtre d'impression) : le bon est le même depuis un téléphone, un portable ou un ordinateur. Le bon ne fait que lire l'historique : il fonctionne sans Internet et ne change rien aux données.

### Comment un mouvement est protégé

Chaque opération part dans un seul envoi qui contient le changement de quantité et la ligne d'historique. Le serveur vérifie que le mouvement est nouveau, que le produit le désigne, et que la quantité a changé exactement de la valeur du mouvement. Sinon, il refuse tout. Si le même envoi arrive deux fois après une coupure, le second est refusé : rien n'est compté deux fois.

### Opérations refusées

Chaque mouvement et chaque création de produit est noté sur l'appareil jusqu'à la confirmation du serveur. Si le serveur refuse, un bloc rouge « Opérations refusées par le serveur » décrit l'opération, y compris à la réouverture de l'application. Le bouton « J'ai noté » le fait disparaître. Les simples modifications de fiche (nom, prix, seuil, archivage) ne sont pas suivies de cette façon.

## Paramètres

L'icône ⚙, en haut à droite des écrans Stock, Mouvements, Fournisseurs et Clients, ouvre :

- **Nom de l'entrepôt** : modifiable à tout moment, même sans Internet (de 1 à 100 caractères).
- **Devise** : modifiable seulement tant que l'entrepôt ne contient aucun produit, même archivé, car changer la devise ne convertit pas les prix déjà saisis. L'application le vérifie auprès du serveur : il faut donc Internet pour changer la devise. Sans réponse du serveur, la devise reste bloquée et le bouton « Vérifier de nouveau » permet de réessayer.
- **Compte** : l'adresse du compte connecté et le bouton « Se déconnecter ».
- **Appareil partagé** : « Effacer les données de cet appareil et me déconnecter » (voir « Synchronisation et utilisation sans Internet »).
- **Supprimer mon compte** : voir plus bas.
- **Version** de l'application, tout en bas.

## Synchronisation et utilisation sans Internet

### L'indicateur en haut de l'écran

À droite du logo, un mot et une pastille indiquent l'état de la synchronisation avec le serveur :

| Affichage | Signification |
|---|---|
| « Synchronisé » (pastille verte) | Le serveur a reçu les modifications faites sur cet appareil. |
| « En attente » (pastille dorée) | En attente de synchronisation : des modifications attendent la confirmation du serveur. Elles partent toutes seules. |
| « Hors ligne » (pastille grise) | Pas de connexion au serveur. On peut continuer à travailler : les modifications sont gardées sur l'appareil. « À envoyer » signale qu'il en reste à envoyer. |
| « Erreur » (rouge) | Erreur de synchronisation : le serveur a refusé une opération. Toucher l'indicateur mène au bloc « Opérations refusées ». |

Faute de place à côté de l'icône ⚙, l'indicateur affiche des mots courts ; le nom complet de l'état est dans l'explication et lu par les lecteurs d'écran (décision 74). Toucher l'indicateur affiche une courte explication. Il est **approximatif** : le navigateur peut se croire en ligne sur un Wi-Fi sans Internet, et il faut alors quelques secondes pour voir « Hors ligne ». Un changement d'état n'apparaît qu'après une seconde et demie environ, pour éviter le clignotement : après un `+1` avec une bonne connexion, l'indicateur reste donc sur « Synchronisé ». Il n'affiche jamais de nombre de modifications en attente.

### Se déconnecter avec des modifications non envoyées

Si des modifications n'ont pas encore été envoyées, « Se déconnecter » demande d'abord confirmation. Les modifications restent sur l'appareil et partiront à la prochaine connexion avec ce compte, sur cet appareil, quand Internet sera là. Elles seraient perdues si les données du navigateur étaient effacées.

### Effacer les données de cet appareil

Dans **Paramètres**, « Effacer les données de cet appareil et me déconnecter » efface la copie des données gardée par le navigateur (produits, historique, fournisseurs, clients), puis déconnecte. Les données du serveur ne sont pas touchées : à la prochaine connexion, il faut Internet pour les recharger.

- L'effacement est refusé tant que des modifications de ce compte attendent d'être envoyées, ou qu'un autre compte utilisé sur le même appareil a des opérations non envoyées.
- Il efface aussi la copie des autres comptes MinStock utilisés dans le même navigateur.
- Si MinStock est ouvert dans un autre onglet, la copie ne peut pas être effacée : un message le signale après la déconnexion. Fermer les autres onglets et recommencer, ou effacer les données du site dans les réglages du navigateur.

### Stockage durable

Une fois l'entrepôt chargé, l'application demande au navigateur de ne pas effacer ses données de lui-même quand l'appareil manque de place. Le navigateur peut refuser sans le dire (Firefox, lui, pose la question). Ce n'est pas une sauvegarde : seul l'export Excel en est une.

## Carnet de fournisseurs

Le bouton « Fournisseurs », sur l'écran des produits, ouvre le carnet. Il est indépendant du stock : il ne crée et ne modifie aucun mouvement.

- **Fiche d'un fournisseur :** nom (obligatoire), téléphone, WhatsApp, e-mail, adresse, produits fournis (texte libre, par exemple « ciment, fer ») et notes.
- **Limites :** nom 100 caractères ; téléphone et WhatsApp 30 caractères, seulement des chiffres, des espaces et `+ - ( ) .` ; e-mail 254 caractères, de la forme `nom@exemple.com` ; adresse 200 ; produits fournis 500 ; notes 1 000.
- **Recherche :** par nom ou par produit fourni (`ciment` montre qui vend du ciment), sans tenir compte des majuscules ni des accents.
- **Boutons « Appeler », « WhatsApp » et « E-mail »** (une icône avec son nom dessous) **:** ils ouvrent l'application correspondante du téléphone ; l'application de stock n'envoie rien elle-même. Le bouton WhatsApp n'apparaît que si le numéro commence par l'indicatif du pays (`+509…` ou `00509…`).
- **Même nom :** deux fournisseurs peuvent porter le même nom ; l'application demande d'abord « Enregistrer quand même ? ».
- **Supprimer :** depuis le formulaire « Modifier », après confirmation. La suppression est définitive : les coordonnées sont effacées et ne peuvent pas être récupérées.
- **Lecture de la liste :** elle n'est chargée que pendant que l'écran « Fournisseurs » est ouvert, pour économiser le quota gratuit. Sans Internet, la liste déjà vue sur l'appareil reste affichée ; la toute première fois sur un appareil, Internet est nécessaire.

Ce sont des informations sur d'autres personnes : n'enregistrer que ce qui est utile, et supprimer un fournisseur dont on n'a plus besoin.

## Carnet de clients

Le bouton « Clients », sur l'écran des produits, ouvre un carnet qui fonctionne exactement comme celui des fournisseurs (décisions 72 et 73).

- **Fiche d'un client :** nom (obligatoire), téléphone, WhatsApp, e-mail, adresse et notes. Mêmes limites que les fournisseurs (notes : 1 000 caractères).
- **Clients VIP :** il n'y a pas de case VIP. Écrivez « VIP » dans les notes, puis tapez `vip` dans la recherche pour n'afficher que ces clients.
- **Recherche :** par nom ou par un mot des notes, sans tenir compte des majuscules ni des accents.
- **Boutons, même nom, suppression définitive, lecture de la liste :** comme pour les fournisseurs (voir plus haut).
- **Ce que le carnet ne fait pas :** il est indépendant du stock et ne gère pas les ventes : pas de lien avec les sorties, pas d'historique d'achats, de crédit, de remises ni de points de fidélité.

Ce sont des informations sur d'autres personnes : n'enregistrer que ce qui est utile, et supprimer un client dont on n'a plus besoin.

## Sauvegarde : export Excel (phase 9)

**L'export est la seule sauvegarde de vos données** : l'offre gratuite de Firebase ne fait aucune sauvegarde du serveur, et la copie gardée par le navigateur n'en est pas une.

1. Touchez ⚙ (Paramètres), puis **Exporter le stock (Excel)**, dans le bloc « Sauvegarde » en haut. Le même export est proposé sur l'écran « Supprimer mon compte ».
2. Le fichier `stock_AAAA-MM-JJ.xlsx` (date du jour) est créé. Sur un téléphone Android, il se trouve dans **Téléchargements** ; sur un ordinateur, dans le dossier des téléchargements du navigateur.
3. **Gardez une copie ailleurs**, par exemple : envoyez-le-vous par e-mail, ou mettez-le dans Google Drive, ou copiez-le sur un ordinateur ou une clé USB. Gardez plusieurs exports datés, pas seulement le dernier.

Contenu (décisions 85 à 88), toujours complet :

- **Stock** : tous les produits, actifs puis archivés (colonne « Archivé ») ; code SKU, type, unité, quantité, seuil, alerte, quantité à commander, prix d'achat, prix de vente, marge, valeur indicative.
- **Historique** : tous les mouvements, du plus récent au plus ancien ; date de l'opération, date de réception par le serveur, produit, code SKU, type, quantité (avec son signe), unité, motif, statut (« Terminé », « Annulé », « En attente d'envoi »).
- **Fournisseurs** et **Clients** : leurs coordonnées et notes.

Dans Excel, la ligne de titres de chaque feuille a des **flèches de filtre** : par exemple, dans « Historique », touchez la flèche de « Produit » et ne cochez que « Riz » pour ne voir que ses mouvements. Les quantités et les montants sont de vrais nombres : Excel peut les additionner.

Sans Internet, l'application prévient et propose de créer le fichier avec la copie gardée sur l'appareil, qui peut être incomplète. Chaque export lit toutes les données du compte (une lecture par produit, mouvement, fournisseur et client, sur la limite gratuite de 50 000 par jour).

## Supprimer son compte

Dans **Paramètres**, le bouton « Supprimer mon compte et mes données » efface **définitivement** l'entrepôt, tous les produits (même archivés), tout l'historique, les carnets de fournisseurs et de clients, et le compte de connexion.

1. Un écran explique ce qui sera effacé et propose d'exporter ses données avant (bouton « Exporter mes données (Excel) »).
2. Double confirmation : cocher « Je comprends que tout sera supprimé définitivement » et taper `SUPPRIMER`.
3. Reconnexion : mot de passe, ou fenêtre Google pour un compte Google. Sans Internet, rien n'est fait.
4. L'écran « Suppression en cours » montre l'avancement. Si l'application se ferme ou si Internet coupe, la suppression reprend toute seule à la prochaine connexion (une demande de suppression ne s'annule pas).
5. À la fin, la copie des données gardée par le navigateur est aussi effacée, et l'écran de connexion affiche « Votre compte et toutes vos données ont été supprimés ».

Ne jamais essayer cette fonction avec un vrai compte : pour les essais, utiliser un compte jetable en `@example.com` (voir `PLAN.md`).

## Saisie des nombres

- La virgule et le point sont tous deux acceptés pour les décimales : `2,5` ou `2.5`.
- Les espaces servent de séparateur de milliers : `1 000`.
- Au plus 3 chiffres après la virgule pour une quantité, 2 pour un prix. Au-delà, la saisie est refusée : l'application n'arrondit jamais en silence.
- Attention : `1.000` est lu comme **1**, pas comme mille. La valeur comprise s'affiche sous le champ pendant la saisie.
- Limites : 1 milliard d'unités ; prix jusqu'à 10 milliards.

Dans la base, les quantités sont enregistrées en millièmes et les prix en centimes, toujours en nombres entiers, pour éviter toute erreur d'arrondi.

## Ouvrir l'application sur cet ordinateur

1. Dans le dossier du projet, double-cliquez sur `demarrer.bat`.
2. Une fenêtre noire s'ouvre (c'est le serveur local) et le navigateur affiche `http://localhost:8080/`.
3. Pour arrêter, fermez la fenêtre noire.

Il ne faut pas ouvrir `index.html` par un double-clic : l'application a besoin du serveur local pour fonctionner.

Si un message indique que le serveur ne peut pas démarrer, il est sans doute déjà lancé dans une autre fenêtre noire : fermez-la et recommencez.

## Publier les règles de sécurité

Le fichier `firestore.rules` n'est pas appliqué automatiquement. À chaque modification de ce fichier :

1. Ouvrez `https://console.firebase.google.com/` et choisissez le projet `inventory-management-app-52866`.
2. Dans le menu de gauche, cliquez sur **Firestore Database**.
3. Cliquez sur l'onglet **Règles**.
4. Effacez tout le texte de l'éditeur, puis collez le contenu complet de `firestore.rules`.
5. Cliquez sur **Publier**.
6. Vérifiez que la ligne « Version des regles » affichée dans la console est la même que dans le fichier.

Tant que les règles publiées sont en retard sur le fichier, l'application affiche « Impossible de charger vos données » (ou, pour les fournisseurs et les clients, « Impossible de charger les fournisseurs » ou « … les clients »).

**Ordre à respecter quand les règles changent :** publier d'abord les règles dans la console, puis seulement envoyer le code avec **Push origin**. Les nouvelles règles restent compatibles avec la version déjà en ligne.

## Tester les règles de sécurité

1. Ouvrez l'application et connectez-vous avec un **compte de test** dont l'adresse se termine par `@example.com`. La page refuse tout autre compte (décision 40), pour qu'un vrai entrepôt ne reçoive jamais de données d'essai.
2. Ouvrez `http://localhost:8080/tests-regles.html`.
3. Cliquez sur **Lancer les tests**.
4. Le bilan doit indiquer que tous les essais sont réussis. Un essai marqué « Échec » signifie que les règles publiées ne protègent pas correctement les données.

À refaire après chaque publication des règles.

Ces essais créent dans le compte de test deux produits « Produit d'essai (règles) » et, depuis la phase 8b, un produit « Produit d'essai (code SKU) ». Ils sont archivés à la fin de chaque passage et n'apparaissent donc pas dans la liste. Chaque passage ajoute aussi cinq mouvements à l'historique du compte de test, dont une opération et son annulation (impossibles à supprimer, par conception) ; leur somme est nulle. Un fournisseur d'essai et un client d'essai sont créés puis supprimés : il ne reste rien. Un passage dure environ une minute.

**Essais de la suppression du compte :** connecté avec un compte jetable `test-suppression-…@example.com`, la même page lance à la place 22 essais des règles de suppression. Ils créent leurs propres données, demandent la suppression, vérifient les refus et les autorisations, puis effacent tout sauf le compte de connexion, qui peut resservir. Ces essais ne se lancent jamais avec un autre compte, et la série habituelle refuse de tourner sur un compte en cours de suppression.

## Tester les conversions de nombres

1. Ouvrez `http://localhost:8080/tests-nombres.html` (aucune connexion nécessaire).
2. Le bilan doit indiquer que tous les essais sont réussis.

À refaire après toute modification de `js/nombres.js`.

## Même adresse e-mail avec les deux méthodes

Une adresse e-mail correspond toujours à un seul compte et aux mêmes données.

- Compte créé avec Google, puis inscription par mot de passe avec la même adresse : refusé. Il faut se connecter avec Google, ou utiliser « Mot de passe oublié » pour ajouter un mot de passe au compte.
- Compte créé par mot de passe avec une adresse Gmail, puis connexion avec Google : Google prend le dessus et l'ancien mot de passe ne fonctionne plus. « Mot de passe oublié » permet d'en recréer un.
- Pour ne pas révéler quelles adresses ont un compte, l'application répond de la même façon à un mauvais mot de passe et à une adresse inconnue.

## Organisation des fichiers

| Élément | Rôle |
|---|---|
| `index.html`, `css/`, `js/` | L'application |
| `images/` | Symbole du logo MinStock (SVG) |
| `js/firebase-config.js` | L'adresse du projet Firebase (ce n'est pas un mot de passe) |
| `vendor/` | Bibliothèques et police copiées dans le projet (Firebase, SheetJS, Montserrat) : voir `vendor/LISEZMOI.md` |
| `firestore.rules` | Règles de sécurité de la base de données |
| `tests-regles.html` | Page de test des règles de sécurité |
| `tests-nombres.html` | Page de test des conversions de nombres |
| `js/export-excel.js` | Export Excel (phase 9) : lit les données et crée le fichier, avec SheetJS chargé seulement au moment de l'export |
| `js/bon-mouvement.js` | Bon imprimable d'un mouvement (étape 9b) : construit le bon et ouvre la fenêtre d'impression |
| `demarrer.bat`, `outils/` | Serveur local pour tester sur cet ordinateur |
| `.nojekyll` | Fichier vide, à garder : demande à GitHub Pages de publier tous les fichiers tels quels (décision 41) |
| `CLAUDE.md` | Cahier des charges |
| `PLAN.md`, `DECISIONS.md`, `DEMARRAGE.md` | Suivi, décisions et méthode de travail |

Tous les chemins sont relatifs : l'application peut être placée chez n'importe quel hébergeur de fichiers statiques. À chaque nouvel hébergeur, son adresse doit être ajoutée dans la console Firebase (**Authentication** > **Paramètres** > **Domaines autorisés**), sinon la connexion est refusée.

Sur GitHub Pages, le fichier vide `.nojekyll` doit rester à la racine : sans lui, GitHub Pages pourrait ignorer certains fichiers, comme ceux de `vendor/`, et l'application ne démarrerait pas en ligne.

## Version en ligne (GitHub Pages)

- Adresse : `https://saintfranckinder.github.io/minstock/`
- Réglages GitHub (onglet **Settings** > **Pages**) : **Deploy from a branch**, branche `main`, dossier **/ (root)**.
- Domaine autorisé dans Firebase (**Authentication** > **Paramètres** > **Domaines autorisés**) : `saintfranckinder.github.io`.
- Mise à jour : chaque **Push origin** dans GitHub Desktop met le site à jour en quelques minutes. Les règles Firestore, elles, se publient à part dans la console (voir plus haut).
- Le dépôt est public : ne jamais y placer de mot de passe ni de clé secrète. Le fichier `.env.test` reste sur l'ordinateur (ignoré par Git).

## Limites connues

- **Mémoire hors ligne :** elle dépend du navigateur. Si le navigateur bloque l'enregistrement de données sur l'appareil, l'application affiche un avertissement. En navigation privée, les navigateurs récents acceptent d'enregistrer mais effacent tout à la fermeture, et l'application ne peut pas le détecter : ne pas utiliser la navigation privée.
- **Première connexion sur un appareil :** elle demande Internet, pour se connecter et pour charger l'entrepôt une première fois.
- **Réouverture sans Internet :** pas encore possible. Elle sera ajoutée avec l'installation sur téléphone (phase 10).
- **Adresse e-mail non vérifiée :** l'inscription ne demande pas de confirmer l'adresse par e-mail. Une faute de frappe dans l'adresse empêche de recevoir l'e-mail de « Mot de passe oublié ».
- **Suppression du compte et quota :** chaque élément effacé compte comme une écriture (limite gratuite : 20 000 par jour pour toute l'application). Un très gros entrepôt peut finir de s'effacer le lendemain ; la reprise est automatique.
- **Suppression du compte, cas rare :** si les données sont effacées mais que la toute dernière étape (le compte de connexion) échoue, le même appareil propose de terminer à la connexion suivante ; sur un autre appareil, le compte apparaît vide, avec « Créer votre entrepôt ».
- **Suppression d'un compte Google :** la reconnexion par la fenêtre Google n'a pas pu être essayée avec un compte de test (seuls des comptes par mot de passe ont servi aux essais).
- **Archivage définitif :** un produit archivé ne peut pas être remis dans la liste. Il reste dans la base avec son historique.
- **Noms en double :** le formulaire refuse deux produits actifs du même nom, mais deux appareils hors ligne peuvent chacun créer le même nom avant de se synchroniser.
- **Produit modifié sur deux appareils :** pour le nom, l'unité, le seuil et le prix, la dernière modification arrivée au serveur l'emporte.
- **Suivi des opérations refusées :** la liste des opérations en attente est gardée sur l'appareil. Si le stockage du navigateur est effacé ou bloqué, un refus du serveur peut passer inaperçu.
- **Valeur du stock indicative :** elle utilise le prix d'achat actuel de chaque produit, pas les prix auxquels le stock a réellement été acheté.
- **Appuis par erreur sur `+1` / `−1` :** chaque appui est un mouvement définitif. Il se corrige avec « Annuler cette opération » dans l'historique, une fois l'appui confirmé par le serveur.
- **Annulation et historique chargé :** la mention « Annulée » ne s'affiche que si l'annulation figure dans la partie de l'historique déjà chargée. Sans Internet, cette partie peut être incomplète ; une seconde annulation serait de toute façon refusée par le serveur.
- **Changement de devise :** la vérification « aucun produit » est faite par l'application, pas par les règles de sécurité. Un produit ajouté sans Internet sur un autre appareil, au moment même où la devise change, ne serait pas détecté. Le risque est faible avec un seul utilisateur.
- **Produit renommé :** l'historique garde le nom du produit au moment de chaque opération.
- **Fournisseurs modifiés sans Internet :** ils ne sont pas suivis par la liste des « Opérations refusées ». Le formulaire vérifie exactement les mêmes limites que les règles, donc un refus ne devrait pas arriver. Si un fournisseur est supprimé sur un appareil pendant qu'un autre, hors ligne, le modifie, la modification est perdue et le fournisseur reste supprimé. Pour le même fournisseur modifié sur deux appareils, la dernière modification arrivée au serveur l'emporte.
- **Fournisseur supprimé :** aucun retour en arrière possible, sauf à retrouver ses coordonnées dans un export Excel fait avant.
- **Bon imprimable :** le nom du fichier PDF proposé reprend le titre et la référence du bon sur ordinateur ; sur téléphone, il dépend du navigateur. Le code SKU n'est pas imprimé pour un produit archivé. Une impression lancée sans le bouton (Ctrl+P) imprime l'écran comme avant. Pas essayé sur iPhone.
- **Export Excel sans Internet :** jusqu'à la phase 10 (application installable), il peut échouer si la bibliothèque Excel n'a jamais été chargée sur l'appareil, ou n'est plus dans la mémoire du navigateur. Fait sans Internet, le fichier peut aussi être incomplet (l'application prévient).
- **Export Excel, mise en forme :** pas de titres en gras ni de couleurs (la version gratuite de la bibliothèque SheetJS ne les écrit pas) ; les largeurs de colonnes et les flèches de filtre sont présentes.
- **Export Excel sur iPhone :** non essayé ; sur Safari, le téléchargement d'un fichier peut s'ouvrir dans un aperçu au lieu d'aller dans « Fichiers ».
- **Appareil partagé :** pour permettre l'utilisation sans Internet, le navigateur garde une copie des données déjà consultées (produits, mouvements, fournisseurs), **même après « Se déconnecter »**. L'application ne les montre plus, mais une personne qui sait fouiller dans le navigateur pourrait les lire. Utiliser l'application seulement sur ses propres appareils, verrouillés par un code ; sur un appareil partagé, utiliser « Effacer les données de cet appareil et me déconnecter » dans Paramètres.
- **Indicateur de synchronisation :** il est approximatif (voir plus haut). Une modification refusée qui n'est pas un mouvement ni une création de produit (nom, prix, archivage, fournisseur) s'affiche en message d'erreur, mais ne fait pas passer l'indicateur sur « Erreur de synchronisation ».
- **Accueil épuré :** le bouton rond `+` (ajouter un produit) passe par-dessus la droite de la liste ; quand une ligne est juste derrière lui, faire défiler un peu avant de toucher son `+1`. Une ligne qui passe en « Stock bas » ou « Rupture » s'agrandit vers le bas (ses propres boutons ne bougent pas). L'unité s'affiche telle qu'elle a été saisie, sans pluriel automatique (« 7 sac »).
- **Clients :** mêmes limites que les fournisseurs pour les modifications sans Internet et sur deux appareils. Si un téléphone resté sur une version de l'application antérieure à la 0.12.0 termine une suppression de compte, il n'efface pas les clients ; recharger la page avant de supprimer son compte.
- **Sécurité du compte :** quiconque connaît le mot de passe du compte voit tout l'entrepôt et les carnets de fournisseurs et de clients. Choisir un mot de passe solide, ou se connecter avec Google en activant la validation en deux étapes du compte Google. Le compte Google qui gère la console Firebase donne accès à toutes les données : il doit être protégé de la même façon.
- **Ajustement d'inventaire :** la correction est saisie à la main. Si un autre appareil a modifié le stock entre-temps, le chiffre affiché au moment de la saisie n'était peut-être plus à jour.
- **Quota gratuit :** chaque mouvement coûte deux écritures et quelques lectures de contrôle. La limite gratuite est de 20 000 écritures et 50 000 lectures par jour pour tous les comptes réunis ; si elle est atteinte, l'application se bloque jusqu'au lendemain, sans perte de données.
