---
title: "Saviez-vous que Netflix n'utilise pas Internet ?"
slug: netflix-open-connect
language: fr
status: published
date_written: 2026-04-25
word_count: ~1200
category: business
tags: [netflix, infrastructure, cdn, moat, distribution]
sources_factuelles:
  - https://openconnect.netflix.com/
  - https://en.wikipedia.org/wiki/Open_Connect
---

Netflix n'utilise pas vraiment Internet — en tout cas pas comme vous le pensez.

## L'histoire de Paul

Paul rentre chez lui à 19h. Après avoir couché ses enfants, nettoyé son appartement et médité dix minutes, il s'effondre sur son canapé pour son plaisir coupable : saison 19, épisode 84 de *Squad Gim's*, une téléréalité sur l'évasion fiscale qui affole la France.

Il regarde en 4K sur sa TV OLED 84 pouces, l'épisode se charge en 3 secondes. Paul se demande : comment les équipes techniques de Netflix gèrent-elles des millions de spectateurs en 4K simultanément sans faire sauter Internet ?

La réponse n'est pas dans des serveurs ultra-puissants éparpillés sur le globe. C'est la stratégie de proximité **Open Connect**.

## Comment s'est vraiment passée la soirée de Paul

**À 3h00 du matin (pendant que Paul dort) :**

Les algorithmes de Netflix ont prédit que le nouvel épisode de *Squad Gim's* serait énormément regardé en France. Dans la nuit, pendant que l'internet français dormait, Netflix a discrètement envoyé d'énormes fichiers vidéo 4K vers des serveurs sur mesure — les **OCA (Open Connect Appliances)** — physiquement installés dans les datacenters du fournisseur d'accès de Paul, Orange.

Un seul OCA peut stocker jusqu'à **350 To de vidéos** dans plusieurs qualités (1080p, 4K, HDR). Tout le catalogue français populaire tient dedans. Ces systèmes tournent sous **FreeBSD** (pas Linux — Netflix l'a choisi pour ses performances réseau optimisées) avec NGINX configuré spécifiquement pour la diffusion vidéo.

**À 20h30 (Paul appuie sur play) :**

Quand Paul a cliqué sur sa télécommande, sa TV a envoyé une requête au serveur de contrôle de Netflix, hébergé sur AWS.

**À 20h30 et 1 seconde (le moment de génie) :**

Le serveur de contrôle a évalué la localisation de la box de Paul et répondu : « Parfait Paul. Je vois que tu es chez cet opérateur dans cette ville. Ne télécharge pas depuis moi — ce sera lent. Récupère-le depuis l'OCA à 15 km ; voilà ton accès. »

**À 20h30 et 3 secondes :**

La TV de Paul s'est connectée directement au serveur local. La vidéo 4K n'a jamais traversé l'Atlantique ni les goulots d'étranglement d'Internet. Elle a voyagé sans encombre sur la fibre locale, depuis la ville voisine jusqu'au salon de Paul.

## L'échelle globale

Netflix a déployé environ **18 000 OCA dans 158 pays**. Ensemble, ils livrent **125 millions d'heures de vidéo par jour** — 100 % du trafic mondial de Netflix.

Le fait le plus frappant : aux heures de pointe, **zéro donnée Netflix ne traverse Internet public**. Un traceroute pendant un épisode de *Squad Gim's* montre que le trafic ne quitte jamais les réseaux Free, Orange ou SFR. « Netflix a littéralement disparu d'Internet. »

## Le génie business : c'est gratuit pour les FAI

Voilà l'élément business méconnu. Ces OCA, qui valent entre 10 000 et 30 000 €, Netflix les **fournit entièrement gratuitement** aux opérateurs (Free, Orange, SFR) dès qu'ils gèrent plus de 5 Gbps de trafic Netflix. En dessous de ce seuil, Netflix utilise des points de peering publics.

**Résultat : un triple gagnant.**

L'opérateur économise sur les coûts de transit international. Netflix réduit ses dépenses CDN publiques. Paul regarde en 4K impeccable sans aucun lag.

## L'avantage concurrentiel

N'importe quel concurrent pourrait reproduire la technologie de Netflix en 18 mois. Pas de brevet bloquant. NGINX est open source. FreeBSD est open source. Les serveurs utilisent du hardware standard.

**Ce qu'il est impossible de copier en 18 mois :**

- Le capital accumulé pour déployer 18 000 appareils dans 158 pays
- Les accords signés avec plus de 1 000 fournisseurs d'accès dans le monde
- 15 ans d'ingénierie logicielle pour orchestrer la flotte depuis AWS
- L'expertise opérationnelle pour maintenir du hardware qui tombe en panne en permanence sans que les utilisateurs s'en aperçoivent

C'est ce que Warren Buffett appelle un *economic moat*. Ce n'est presque jamais un brevet ou un algorithme. C'est presque toujours : **capital + contrats + opérations + timing**.

La technologie de Netflix pourrait être reproduite en 18 mois. Mais personne ne peut signer 1 000 accords avec des FAI dans ce délai. **Le moat n'est pas dans le code. Il est dans le carnet de contacts.**

---

Paul, lui, s'en fout de tout ça. Il regarde son émission. C'est tout ce qui compte vraiment pour Netflix.
