---
title: "Comment remplacer les outils de prospection LinkedIn par un agent IA open-source"
slug: claudin-prospection-linkedin-ia
language: fr
status: published
date_written: 2026-04-08
word_count: ~1200
category: ai
tags: [linkedin, automation, open-source, claude, agents]
sources_factuelles:
  - https://github.com/bacleclement/claudin
---

*Alternative gratuite à Waalaxy, Lemlist et Phantombuster avec Claude Code et l'automatisation navigateur.*

---

Les outils de prospection LinkedIn coûtent entre **50 et 100 euros par mois**. Waalaxy, Lemlist, Phantombuster, Dripify, Expandi — ils proposent tous la même chose : **chercher des profils**, **envoyer des demandes de connexion** et **écrire un message** quand la personne accepte.

En utilisant Claude Code, je me suis rendu compte qu'il pouvait faire tout ça : contrôler un navigateur, lire des profils LinkedIn et rédiger des messages personnalisés.

J'ai donc créé **ClaudIn**, un outil open-source et gratuit qui remplace ces abonnements.

Aucun serveur externe, aucune donnée partagée. Claude pilote directement le navigateur Chrome et reproduit le travail de prospection que l'on fait habituellement à la main.

## Qu'est-ce que Claudin ?

Claudin est un ensemble de 3 skills pour Claude Code qui automatisent la prospection LinkedIn :

- **/claudin-setup** — Un assistant de configuration en 5 minutes
- **/claudin** — Le pipeline quotidien : recherche, connexion, message
- **/claudin-dashboard** — Les statistiques du pipeline en temps réel

Il s'appuie sur **Claude in Chrome**, une extension navigateur qui permet à Claude de contrôler LinkedIn directement dans votre Chrome. Il n'y a pas de scraping externe ni d'appels API détournés. Toutes les données restent sur votre machine.

Le principe est simple : **Claude Code peut désormais interagir avec un navigateur** de la même manière qu'un utilisateur. C'est cette capacité qui rend possible l'automatisation de la prospection sans passer par un service tiers.

## La configuration : 5 minutes, une seule fois

Trois étapes pour installer Claudin :

**1. Ouvrez l'application Claude** — L'application desktop ou https://claude.ai/code dans votre navigateur.

**2. Collez cette commande** dans le chat de Claude Code :
```
git clone https://github.com/bacleclement/claudin.git
```
Claude télécharge le projet sur votre machine. Rien à installer, pas de dépendances.

**3. Tapez `/claudin-setup`** dans le chat — L'assistant de configuration démarre.

L'assistant vous pose quelques questions, en français ou en anglais :

- Quelle est votre activité ?
- Quels sont vos clients ?
- Utilisez-vous un compte LinkedIn gratuit ou Premium ?

À partir de vos réponses, Claude génère une liste de mots-clés de recherche LinkedIn et vous les propose. Vous sélectionnez ceux qui correspondent à votre cible :

- [x] growth marketing freelance
- [x] startup founder SaaS
- [ ] directeur marketing grand groupe
- [x] indie hacker solopreneur

Il rédige ensuite vos messages : la **note de connexion** et le **message de suivi**, adaptés à votre audience. Vous pouvez les relire et les ajuster avant de valider.

Dernière étape optionnelle : **configurer le scheduler**. Claudin peut s'exécuter automatiquement chaque matin, chaque soir, deux fois par jour, ou à une heure personnalisée. Une fois le scheduler actif, vous n'avez plus rien à faire : **la prospection tourne en arrière-plan tant que Chrome est ouvert.**

## Le fonctionnement quotidien

Lancez **/claudin manuellement**, ou **laissez le scheduler s'en charger**. Si vous avez configuré une exécution automatique lors du setup, Claudin se lance à l'heure prévue, déroule les trois étapes, et vous envoie un rapport à la fin.

Vous pouvez aussi combiner les deux : le scheduler gère la routine quotidienne, et vous lancez une session manuelle quand vous souhaitez accélérer.

**Étape 1 — Recherche.** Claude ouvre LinkedIn dans votre navigateur, saisit vos mots-clés et parcourt les résultats. Il analyse les profils, écarte ceux qui ne correspondent pas (recruteurs, RH, commerciaux) et conserve les profils pertinents dans un fichier sur votre ordinateur.

**Étape 2 — Connexion.** Pour chaque prospect retenu, Claude envoie une demande de connexion accompagnée de votre note personnalisée (si vous êtes sur un compte Premium ou s'il reste du quota en compte gratuit). Un délai aléatoire de 15 à 30 secondes est respecté entre chaque action, avec un maximum de 15 connexions par session et 100 par semaine.

**Étape 3 — Message.** Claude vérifie vos connexions récentes. Si quelqu'un a accepté votre invitation, il ouvre la conversation et envoie automatiquement votre message de suivi.

Lancez **/claudin-dashboard** pour visualiser le pipeline.

## Les limites

**L'ordinateur doit rester allumé.** Contrairement aux outils cloud, Claudin nécessite que Chrome soit ouvert pour fonctionner. C'est la principale contrainte par rapport aux solutions existantes.

**Un seul message de suivi pour le moment.** Il n'y a pas encore de séquences de relance automatique (J+3, J+7). C'est une amélioration prévue pour une prochaine version. En pratique, la majorité des réponses arrivent après le premier message.

**Le risque lié à l'automatisation LinkedIn.** Toute forme d'automatisation sur LinkedIn comporte un risque. Claudin le réduit au maximum grâce à des délais aléatoires, au respect des quotas et à un arrêt automatique en cas de signal d'alerte de la plateforme.

**L'application Claude Code est requise.** Claudin n'est pas une application autonome. Il fonctionne à l'intérieur de Claude Code (application desktop ou claude.ai/code), ce qui suppose un abonnement Claude.

## Prérequis

1. **L'application Claude Code** — Rendez-vous sur https://claude.ai/code et connectez-vous avec votre compte Anthropic. L'application fonctionne directement dans le navigateur. Une version desktop est aussi disponible.

2. **L'extension Claude in Chrome** — Disponible sur le Chrome Web Store. Elle permet à Claude de piloter votre navigateur. Recherchez "Claude in Chrome", cliquez sur "Ajouter à Chrome", ouvrez-la et connectez-la à votre compte Claude.

3. **Un compte LinkedIn** — Gratuit ou Premium, les deux sont compatibles.

---

**GitHub :** https://github.com/bacleclement/claudin

Si le projet vous est utile, une étoile sur le repo aide à sa visibilité. C'est de l'open source — vous pouvez l'améliorer et proposer vos contributions à la communauté.
