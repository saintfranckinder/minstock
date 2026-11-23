// Traduit les codes d'erreur de Firebase en messages simples, en français.
// Les messages ne révèlent jamais si une adresse e-mail possède un compte,
// sauf à l'inscription, où Firebase le signale de toute façon.

const IDENTIFIANTS_INCORRECTS =
  'Adresse e-mail ou mot de passe incorrect. ' +
  'Si vous avez créé votre compte avec Google, utilisez le bouton « Continuer avec Google ».';

const MOT_DE_PASSE_TROP_COURT = 'Le mot de passe doit contenir au moins 8 caractères.';

const MESSAGES = {
  // Connexion par e-mail et mot de passe
  'auth/invalid-credential': IDENTIFIANTS_INCORRECTS,
  'auth/invalid-login-credentials': IDENTIFIANTS_INCORRECTS,
  'auth/wrong-password': IDENTIFIANTS_INCORRECTS,
  'auth/user-not-found': IDENTIFIANTS_INCORRECTS,
  'auth/invalid-email': 'Cette adresse e-mail n’est pas valide.',
  'auth/missing-email': 'Saisissez votre adresse e-mail.',
  'auth/missing-password': 'Saisissez votre mot de passe.',
  'auth/user-disabled': 'Ce compte a été désactivé. Contactez le propriétaire de MinStock.',
  // Inscriptions fermées (décision 101) : inscription refusée par le serveur,
  // ou première connexion avec un compte Google qui n'a pas de compte MinStock.
  'auth/admin-restricted-operation':
    'Ce compte n’existe pas dans MinStock : les inscriptions sont fermées. ' +
    'Demandez au propriétaire de MinStock de vous créer un compte.',
  'auth/too-many-requests': 'Trop de tentatives. Patientez quelques minutes, puis réessayez.',

  // Inscription
  'auth/email-already-in-use':
    'Cette adresse a déjà un compte. Revenez à la connexion et utilisez votre mot de passe ' +
    'ou le bouton « Continuer avec Google ». Mot de passe perdu ou jamais créé ? ' +
    'Utilisez « Mot de passe oublié ».',
  'auth/weak-password': MOT_DE_PASSE_TROP_COURT,
  'auth/password-does-not-meet-requirements': MOT_DE_PASSE_TROP_COURT,

  // Connexion avec Google
  'auth/popup-blocked':
    'Votre navigateur a bloqué la fenêtre de connexion Google. ' +
    'Autorisez les fenêtres pop-up pour ce site (icône dans la barre d’adresse), puis réessayez. ' +
    'Vous pouvez aussi vous connecter avec une adresse e-mail et un mot de passe.',
  'auth/popup-closed-by-user': 'La fenêtre Google a été fermée avant la fin. Réessayez.',
  'auth/cancelled-popup-request': 'Une fenêtre Google est déjà ouverte. Terminez la connexion dans cette fenêtre.',
  'auth/account-exists-with-different-credential':
    'Cette adresse a déjà un compte créé avec un mot de passe. ' +
    'Connectez-vous avec votre adresse e-mail et votre mot de passe.',
  'auth/unauthorized-domain':
    'Cette adresse de site n’est pas autorisée pour la connexion (domaines autorisés dans Firebase).',
  'auth/operation-not-allowed': 'Cette méthode de connexion n’est pas activée.',

  // Reconnexion avant la suppression du compte (phase 7)
  'auth/user-mismatch':
    'Ce compte Google n’est pas celui qui est connecté à MinStock. ' +
    'Choisissez le même compte dans la fenêtre Google.',
  'auth/requires-recent-login': 'Pour des raisons de sécurité, reconnectez-vous puis réessayez.',
  'delai-depasse': 'Le serveur ne répond pas. Vérifiez la connexion Internet, puis réessayez.',

  // Réseau et serveur
  'auth/network-request-failed': 'Pas de connexion Internet. Se connecter à un compte demande Internet.',
  'auth/web-storage-unsupported':
    'Ce navigateur bloque l’enregistrement de données. Autorisez le stockage pour ce site.',
  'permission-denied': 'Le serveur a refusé l’opération.',
  'unavailable': 'Serveur injoignable. Vérifiez la connexion Internet.',
  'resource-exhausted':
    'La limite gratuite du jour est atteinte. Réessayez demain. Vos données ne sont pas perdues.'
};

export function messageErreur(erreur) {
  const code = erreur && typeof erreur.code === 'string' ? erreur.code : 'inconnue';
  return MESSAGES[code] || `Une erreur est survenue (${code}). Réessayez.`;
}
