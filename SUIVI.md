# Suivi du chantier — portfolio

> Fichier tenu à jour pendant le travail, au cas où la session s'arrête.
> Dernière mise à jour : 7 oct. 2026, étape 7/8 (site complet, en test).

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
- [ ] Test mobile + pages projet, puis infos projets demandées à Hugo
- [x] Commit local de la refonte

## Idée directrice

« **Sous le capot** » : au survol d'un projet, une ligne de scan révèle le vrai code ou le montage derrière.
Le bouton `</>` de la barre du haut ouvre le capot de **tout le site** : plan technique, contours des blocs
avec leur taille réelle, panneau avec les vraies mesures de la page (poids, requêtes, temps de chargement).

## À vérifier par toi ensuite

- CV dans `site/assets/docs/` : version de mars 2026 (« première année ») à remplacer
- Email : `hugo.ninclaus@outlook.fr` (ancien site) — le CV dit `outlook.com`
- Téléphone affiché dans Contact (comme sur l'ancien site) : à retirer si tu préfères
- Lien `monster.ninclaus.fr` désactivé (site hors ligne) : à remettre dans `projets.js` s'il revient
- Pastille « Disponible pour un stage » : à adapter
