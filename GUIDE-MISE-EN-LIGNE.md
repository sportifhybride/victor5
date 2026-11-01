# HYBRIDE COACHING - VERSION 2.0

## Ce que contient cette version

En plus de la version 1 :
- compte.html : creation de compte et connexion
- bibliotheque.html : tous les programmes achetes au meme endroit
- espace.html : tableau de bord (programmes, commandes, informations, langue)
- outils.html : calculateur de 1RM, zones d'allure de course, records personnels
- lien "Mon espace" et "Outils" dans le menu
- politique de confidentialite mise a jour pour les comptes clients
- bandeau "Apercu" sur les pages de l'espace membre

## Statut de l'espace membre

L'interface est complete, mais l'espace membre est en MODE APERCU :
aucune donnee n'est enregistree, aucun mot de passe n'est stocke, aucun paiement
n'est possible. C'est volontaire : un systeme d'authentification "pour de faux"
donnerait une fausse impression de securite. Le branchement reel se fait a la
mise en service.

## Ce qu'il faut brancher pour activer l'espace membre

1. Base de donnees et authentification
   Supabase (formule gratuite au depart) pour les comptes, emails et mots de passe
   haches. Cloudflare Workers pour les fonctions cote serveur.

2. Paiement et acces automatique
   Compte PayPal Business (je ne peux pas le creer a ta place), puis webhook PayPal :
   quand une commande est payee, le compte est credite et le programme apparait
   dans la bibliotheque.

3. Stockage des PDF
   Espace prive, jamais accessible par une adresse publique. Lien signe et limite
   dans le temps, ou lecture en ligne.

4. Emails transactionnels : confirmation de commande et acces au programme.

## A verifier avant toute vente

- creation de l'entreprise et immatriculation ;
- droit d'encadrer contre remuneration et formulation des qualifications ;
- assurance responsabilite civile professionnelle ;
- CGV, mentions legales et politique de confidentialite completees et verifiees ;
- commande test de bout en bout ;
- verification juridique professionnelle.

## Comment publier

1. Aller sur pages.cloudflare.com et creer un compte gratuit.
2. "Create a project" puis "Upload assets".
3. Glisser le CONTENU du dossier hybride-coaching-v2, pas le dossier lui-meme.
4. Cloudflare donne une adresse du type hybride-coaching.pages.dev.

Domaine : hybridecoaching.fr, chez Cloudflare Registrar ou OVH. Le .fr est ouvert
aux particuliers : ton adresse personnelle suffit et reste masquee publiquement.
Paiement une fois par an. Modifier le site ne coute rien, jamais.
