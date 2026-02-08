


# M2_IA2_CASA_G1_2025_2026
# Imade Eddine Ouazane



# 🎮 Portfolio de Développement de Jeux : Survivor.io & Pac-Man avec IA

Ce dépôt contient deux projets de jeux de qualité professionnelle développés avec **p5.js** et une assistance IA avancée. Ces projets démontrent des mécaniques de jeu complexes, une architecture orientée objet et des comportements autonomes d'agents.

## 🔗 Liens Rapides
- **Jouer en Ligne** : [Arcade Itch.io d'Imade](https://imade-eddine-ouazane.itch.io/)
- **Survivor.io** : [Lien Direct](https://imade-eddine-ouazane.itch.io/sur)
- **Pac-Man** : [Lien Direct](https://imade-eddine-ouazane.itch.io/s)
- **Vidéo Démo Pac-Man** : [Lien YouTube](https://youtu.be/uTBPs-MvlS4)
- **Vidéo Démo Survivor.io** : [Lien YouTube](https://youtu.be/U_z_r0RDgKU)

### 🏷️ Hashtags pour YouTube
`#GameDev #p5js #JavaScript #IndieDev #SurvivorIO #PacMan #Coding #AI #Gemini #GoogleDeepMind #OpenSource #Programmation #JeuxVideo #ItchIO`

---

## ⚔️ Projet 1 : Clone de Survivor.io

Un jeu de survie "bullet heaven" haute performance où vous affrontez des vagues infinies d'ennemis, montez de niveau et devenez un dieu de la destruction.

### 🌟 Fonctionnalités Clés
- **Boucle de Jeu Infinie** : Battez des boss pour augmenter la difficulté indéfiniment.
- **Comportements IA Avancés** : Les ennemis utilisent les comportements de **Séparation** (pour éviter de s'entasser) et de **Poursuite** (pour chasser le joueur).
- **Système d'Armes** :
  - **Baguette Magique** : Projectiles à ciblage automatique.
  - **Bouclier Orbital** : Champ d'énergie rotatif protecteur.
  - **Boomerang** : Projectiles qui reviennent vers le joueur.
  - **Laser** : Rayon perçant à hauts dégâts.
- **Object Pooling** : Performance optimisée pour gérer des centaines d'ennemis à 60 FPS.
- **Raffinement Visuel** : Tremblements d'écran (`Screen Shake`), chiffres de dégâts, animations des ennemis (respiration, yeux) et effets de particules.

### 🛠️ Défis Techniques Résolus
1.  **Performance à Grande Échelle** : Le rendu de centaines d'entités causait des ralentissements. Nous avons implémenté un modèle **Object Pool** pour réutiliser les objets ennemis et projectiles au lieu de les créer/détruire constamment, gardant le jeu fluide.
2.  **Détection de Collision** : Les vérifications de collision naïves (chaque balle contre chaque ennemi) étaient trop lentes ($O(N^2)$). Nous avons optimisé les boucles et la logique pour gérer les vagues denses.
3.  **Gestion d'État** : Gérer des états complexes (Menu, Jeu, Pause, Victoire, Game Over) a nécessité une architecture de classe `Game` robuste.

---

## 👻 Projet 2 : Pac-Man

Le Projet 2 est une réinterprétation moderne et techniquement sophistiquée du jeu d'arcade légendaire Pac-Man. Contrairement aux versions classiques basées sur des grilles rigides, cette implémentation utilise un moteur physique vectoriel fluide, permettant des mouvements lisses et précis tout en respectant les contraintes du labyrinthe. Le cœur du projet réside dans son intelligence artificielle : chaque fantôme est gouverné par des algorithmes de comportement autonomes (Steering Behaviors) qui leur confèrent des personnalités distinctes et des stratégies de poursuite dynamiques. De plus, le jeu intègre une génération procédurale de labyrinthe, offrant une nouvelle carte à chaque partie.

### 🌟 Fonctionnalités Clés
- **Mouvement Vectoriel** : Contrairement aux classiques basés sur une grille, ceci utilise une physique vectorielle fluide tout en respectant les murs du labyrinthe.
- **IA des Fantômes** : Chaque fantôme a une personnalité/comportement unique.
- **Labyrinthe Procédural** : Logique de génération de carte.
- **Mécaniques Classiques** : Super-pacgommes, suivi du score et système de vies.

### 🛠️ Défis Techniques Résolus
1.  **Collision avec les Murs** : Faire en sorte qu'un cercle en mouvement libre collisionne correctement avec une grille de labyrinthe sans rester bloqué.
2.  **Recherche de Chemin (Pathfinding)** : S'assurer que les fantômes peuvent naviguer dans le labyrinthe pour trouver le joueur.

---

## 🤖 IA & Outils Utilisés

Ces projets ont été construits avec l'assistance de **Google Gemini 2.0 (via Antigravity)**.

### Comment l'IA a Aidé :
- **Conception d'Architecture** : Planification de la structure des classes (`Game`, `Entity`, `Weapon`, `Vehicle`).
- **Implémentation d'Algorithmes** : Écriture de comportements de pilotage complexes (`seek`, `separate`) et logique de collision.
- **Débogage** : Identification rapide de pourquoi les projectiles ne touchaient pas les ennemis ou pourquoi le jeu plantait au redémarrage.
- **Refactoring** : Conversion du "code spaghetti" en classes propres et modulaires.

### Comportements Implémentés (Steering Behaviors) :
- **Seek (Poursuite)** : Les agents calculent un vecteur vers leur cible et se dirigent vers elle.
- **Separate (Séparation)** : Les agents vérifient leurs voisins et s'éloignent pour éviter le chevauchement (utilisé pour les essaims d'ennemis).
- **Wander (Errance)** : Mouvement aléatoire pour les états inactifs.

---

## 🌐 Comment Héberger sur Itch.io

1.  **Exporter** : Compressez (zippez) votre dossier de projet (doit contenir `index.html` à la racine).
2.  **Téléverser** : Allez sur Itch.io -> "Upload New Project".
3.  **Configurer** :
    - **Type** : HTML/JS game.
    - **Intégration** : Choisissez "Run in browser".
    - **Viewport** : Définissez les dimensions (ex: 800x600).
4.  **Publier** : Sauvegardez et réglez la visibilité sur "Public".

---

*Créé par Imade Eddine Ouazane*
