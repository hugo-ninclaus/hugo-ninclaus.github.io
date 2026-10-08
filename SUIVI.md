# Suivi du chantier — portfolio

> Fichier tenu à jour pendant le travail, au cas où la session s'arrête.
> Dernière mise à jour : 8 oct. 2026 — mode capot du site retiré (on garde « Sous le capot » sur les cartes).

## Ce que tu as demandé

1. Nouveau portfolio, DA inspirée du site **bhttpd** (A2 / prog sys net) : style Apple, noir, gros titres.
2. **Partir de l'ancien portfolio** (`~/Documents/Projet perso/Portfolio`) : mêmes sections, mêmes textes, mêmes 3 projets.
3. **Pas** de bhttpd, War ArenAI ni Pixel Mate dans les projets. Pas de « stats » (section chiffres) façon bhttpd.
4. Site **statique** pour GitHub Pages. Docker plus tard (fichiers prêts, pas lancés).
5. Modulable dans VS Code, pas « fait par une IA ».

## Où sont les fichiers

`~/Documents/Personnel/portfolio/`
- `site/` : tout le site (c'est ce qui est publié)
- `site/contenu/projets.js` : **les projets** (texte, images, code « sous le capot »)
- `site/assets/css/variables.css` : couleurs, polices, tailles
- `README.md` : comment modifier et publier
- `Dockerfile`, `compose*.yml`, `docker/` : pour plus tard

Version précédente (1re version, avant refonte) : commit `43b4ca6` (`git log`).

## Déjà fait

- [x] Dossier `portfolio` créé dans `Documents/Personnel` (sous-dossier pour que `Password/` et les PDF ne partent pas sur GitHub)
- [x] Dépôt git local, 1er commit `43b4ca6` (1re version). **Rien n'est poussé sur GitHub** (ton choix).
- [x] Workflow GitHub Pages (`.github/workflows/pages.yml`), Dockerfile + nginx + Caddy (HTTPS pour ninclaus.fr), `.vscode` (Live Server sur `site/`)
- [x] Recherche dans tes anciennes sessions : pas de config nginx du miniserveur. Trouvé : miniserveur en `192.168.1.83` (user `hugo`, SSH/SFTP), `ninclaus.fr` chez IONOS (page par défaut), `monster.ninclaus.fr` ne répond plus.
- [x] **Refonte (en cours)** :
  - [x] `contenu/projets.js` : 3 projets de l'ancien portfolio (Projet fil rouge, Redesign de Monster, Miniserveur), textes repris de l'ancien site
  - [x] Images renommées (`fil-rouge-*.png`), images Pixel Mate supprimées, logo ESILV ajouté (`assets/img/esilv.png`)
  - [x] `assets/js/couvertures.js` : dessins SVG animés (parking avec LED qui guident, serveur avec LED et paquets)
  - [x] `assets/js/code.js` : fenêtre « sous le capot » avec coloration du code (couleurs Xcode)
  - [x] `assets/js/commun.js` : animations au défilement, menu mobile, **mode capot**, heure, copier l'email
  - [x] `assets/js/accueil.js` : vitrine inclinée qui se redresse au scroll, cartes projets, frise qui se remplit
  - [x] `assets/js/projet.js` : page projet (couverture + capot, fiche, récit, galerie à flèches/points, visionneuse plein écran, projet précédent/suivant)
  - [x] CSS : `variables.css`, `base.css`, `couvertures.css`, `accueil.css`, `projet.css`, `capot.css`

## Reste à faire

- [x] `index.html` (hero « Étudiant. Travailleur & rigoureux. », projets, À propos en section claire + carte étudiante, Parcours en frise, Compétences en bento, Contact)
- [x] `projet.html`, `404.html`
- [x] Mettre à jour `README.md` et les redirections de `docker/nginx.conf`
- [x] Test ordi (captures headless) : accueil OK, frise OK au défilement
- [x] Test mobile + pages projet (captures headless) : OK
- [ ] En attente : infos sur les projets (voir la liste envoyée dans la conversation)
- [x] Commit local de la refonte

## Tour des bugs (8 oct.)

- [x] Bouton « Sous le capot » des cartes recouvert par le lien de la carte (un clic ouvrait le projet) → corrigé
- [x] Carte étudiante pas inclinée, tuiles « Hors écran » sans effet au survol (l'animation d'apparition écrasait leur `transform`) → l'apparition utilise maintenant `translate`
- [x] Grande carte : l'image débordait sur le texte à certaines largeurs → corrigé
- [x] Visionneuse : flèches par-dessus l'image → image réduite pour laisser la place
- [x] Copier l'adresse : marche aussi hors HTTPS (solution de secours)
- [x] Menu mobile resté ouvert si on agrandit la fenêtre → se ferme
- [x] Barre du haut : le lien de la section affichée s'allume
- [x] Page 404 : texte qui parlait encore de bhttpd → « Rien sous ce capot. »
- [x] Fond blanc de « À propos » remplacé par un gris graphite avec un halo bleu (tu n'aimais pas le blanc)
- [x] Nouveau `outils/serveur.py` : serveur local sans cache (le navigateur gardait l'ancien CSS)
- [x] Vitrine de l'accueil sur téléphone : pile de cartes qu'on fait glisser façon Tinder
- [x] Vitrine en carrousel interactif sur toutes les tailles : ordi = cartes en éventail (Cover Flow), téléphone = pile Tinder. Flèches, points, clavier, glisser. Défilement automatique quand on la regarde sans y toucher (pause de 7 s après une action), barre de progression dans le point actif
- [x] Bug du glissement : un autre doigt ou la souris pouvait perturber le geste → on ne suit que le pointeur qui a attrapé la carte
- [x] Sous-titre « Compétences » raccourci (il passait sur 3 lignes), adresse mail du pied de page qui touchait le bord à 320 px
- [x] Captures de contrôle 1440 / 768 / 320 px + console sans erreur sur toutes les pages (accueil, 3 projets, projet inconnu, 404)
- [x] Section À propos : dégradé du noir vers le graphite (plus de coupure nette), halo bleu déplacé
- [x] Pied de page : mention « codé à la main » retirée, remplacée par une colonne Contact
- [x] Bug : le bouton `</>` rendait la page noire (conflit de nom de classe) → corrigé, puis…
- [x] …**mode capot du site retiré** à ta demande (bouton `</>`, « Ouvrir le capot », panneau de mesures, `capot.css`). On garde le bouton « Sous le capot » des cartes de projets.

## Idée directrice

« **Sous le capot** » : au survol d'un projet, une ligne de scan révèle le vrai code ou le montage derrière
(bouton « Sous le capot » sur téléphone).

## À vérifier par toi ensuite

- CV dans `site/assets/docs/` : version de mars 2026 (« première année ») à remplacer
- Email : `hugo.ninclaus@outlook.fr` (ancien site) — le CV dit `outlook.com`
- Téléphone affiché dans Contact (comme sur l'ancien site) : à retirer si tu préfères
- Lien `monster.ninclaus.fr` désactivé (site hors ligne) : à remettre dans `projets.js` s'il revient
- Pastille « Disponible pour un stage » : à adapter
