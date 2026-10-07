# Portfolio — Hugo Ninclaus

Site statique (HTML, CSS, JavaScript), sans framework ni étape de build.
Direction artistique reprise du site `bhttpd` (prog sys & réseaux, A2).

- **Maintenant** : publié sur GitHub Pages.
- **Plus tard** : Docker + nginx + nom de domaine (`ninclaus.fr`). Tout est déjà prêt, voir la fin.

---

## Organisation

```
portfolio/
├── site/                     ← TOUT le site est ici (c'est ce qui est publié)
│   ├── index.html            page d'accueil (accueil, projets, à propos, parcours, compétences, contact)
│   ├── projet.html           modèle de page projet (projet.html?p=<id>)
│   ├── 404.html              page d'erreur
│   ├── contenu/
│   │   └── projets.js        ← LES PROJETS (texte, images, stack, code « sous le capot »)
│   └── assets/
│       ├── css/
│       │   ├── variables.css ← couleurs, polices, tailles (la DA en un fichier)
│       │   ├── base.css      nav, titres, boutons, fenêtre de code, pied de page
│       │   ├── couvertures.css  couvertures des projets + effet « capot »
│       │   ├── accueil.css   sections de la page d'accueil
│       │   ├── projet.css    page projet (galerie, visionneuse…)
│       │   └── capot.css     le mode capot (bouton </>)
│       ├── js/
│       │   ├── commun.js     animations, menu mobile, mode capot, heure, copier l'email
│       │   ├── couvertures.js  dessins SVG des projets (parking, serveur)
│       │   ├── code.js       affichage et coloration du code « sous le capot »
│       │   ├── accueil.js    vitrine, cartes de projets, frise du parcours
│       │   └── projet.js     construit la page d'un projet
│       ├── img/              favicon, logo ESILV, captures des projets
│       └── docs/             CV en PDF
│
├── .github/workflows/pages.yml   publication automatique sur GitHub Pages
├── Dockerfile, compose*.yml      pour plus tard (Docker)
└── docker/                       config nginx + Caddy (HTTPS)
```

### L'idée « sous le capot »

- Au survol d'une carte de projet, une ligne de scan révèle ce qu'il y a derrière : le vrai code, le montage, les commandes.
  Sur téléphone, c'est le bouton « Sous le capot » de la carte.
- Le bouton `</>` de la barre du haut (ou « Ouvrir le capot » en bas de page) passe **tout le site** en plan technique :
  grille, contour de chaque bloc avec sa taille réelle, et un panneau avec les vraies mesures de la page
  (poids, nombre de requêtes, temps de chargement). `Échap` pour refermer.
- Pour qu'un bloc soit étiqueté en mode capot, il suffit de lui ajouter l'attribut `data-capot`.

## Voir le site en local

**Avec VS Code** : installer l'extension *Live Server* (VS Code la propose à l'ouverture du dossier),
puis cliquer sur **Go Live** en bas à droite. Le dossier `site/` est servi sur http://localhost:5500
et la page se recharge à chaque sauvegarde.

**Sans VS Code** :

```bash
python3 -m http.server 5500 --directory site
```

> Ouvrir `index.html` en double-cliquant marche aussi, mais un vrai petit serveur évite les surprises.

---

## Modifier le site

| Je veux…                            | Fichier                                   |
|-------------------------------------|-------------------------------------------|
| ajouter / modifier / retirer un projet | `site/contenu/projets.js`              |
| changer le code « sous le capot » d'un projet | champ `capot` dans `site/contenu/projets.js` |
| mettre une image comme couverture   | `couverture: { image: "assets/img/projets/x.jpg" }` dans `projets.js` |
| changer les couleurs ou les polices | `site/assets/css/variables.css`           |
| changer un texte de l'accueil       | `site/index.html` (chaque section est commentée) |
| changer le parcours ou les compétences | `site/index.html`, sections *Parcours* et *Compétences* |
| remplacer le CV                     | remplacer `site/assets/docs/CV_NINCLAUS_Hugo.pdf` (même nom) |
| changer l'email / LinkedIn / GitHub | rechercher-remplacer dans tout le dossier : `Ctrl+Shift+H` dans VS Code |

### Ajouter un projet

1. Ouvrir `site/contenu/projets.js`.
2. Copier un bloc `{ ... },` existant et le coller où on veut le voir apparaître.
3. Changer l'`id` (court, sans espace ni accent : `mon-projet`), puis remplir les champs.
4. Mettre les images dans `site/assets/img/projets/` et les référencer dans `images`.

C'est tout : la carte apparaît sur l'accueil (et dans la vitrine du haut si c'est un des 3 premiers),
la page `projet.html?p=mon-projet` existe, et les liens « précédent / suivant » se mettent à jour.

Pour une grande carte (pleine largeur, image à gauche et texte à droite) : `large: true`.

### Animer un nouvel élément

Ajouter la classe `reveal` à n'importe quel élément : il apparaîtra en glissant au défilement.

---

## Publier sur GitHub Pages

**Première fois :**

```bash
git remote add origin https://github.com/hugo-ninclaus/<nom-du-repo>.git
git push -u origin main
```

Puis sur GitHub : **Settings → Pages → Build and deployment → Source : GitHub Actions**.

> GitHub Pages est gratuit uniquement pour les dépôts **publics**
> (un dépôt privé demande un compte GitHub Pro).

**Ensuite** : chaque `git push` sur `main` qui touche `site/` republie le site
(onglet *Actions* pour suivre). Adresse : `https://hugo-ninclaus.github.io/<nom-du-repo>/`.

Tous les liens du site sont relatifs, donc il marche aussi bien dans ce sous-dossier
qu'à la racine d'un domaine.

### Brancher ninclaus.fr sur GitHub Pages (option sans Docker)

1. Créer le fichier `site/CNAME` contenant juste `ninclaus.fr`.
2. Chez IONOS (le DNS du domaine) : enregistrements `A` de `ninclaus.fr` vers
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`,
   et un `CNAME` `www` vers `hugo-ninclaus.github.io`.
3. Dans **Settings → Pages** : renseigner le domaine et cocher *Enforce HTTPS*.

---

## Plus tard : Docker + domaine

### Tester l'image en local

```bash
docker compose up -d --build
```

→ http://localhost:8080. Arrêter avec `docker compose down`.

L'image est un `nginx:stable-alpine` qui sert `site/` avec la config `docker/nginx.conf` :
compression, en-têtes de sécurité, page 404, et redirections des anciennes adresses
(`about.html`, `projects/miniserveur.html`…) vers les nouvelles.

### Mettre en ligne avec le domaine (HTTPS automatique)

Sur le serveur (le miniserveur par exemple) :

1. **DNS chez IONOS** : un enregistrement `A` pour `ninclaus.fr` et un pour `www`
   vers l'IP publique de la box. Aujourd'hui `ninclaus.fr` pointe encore sur la page
   par défaut d'IONOS (`217.160.0.19`).
2. **Box** : rediriger les ports **80** et **443** vers l'IP locale du serveur.
3. **Lancer** :

   ```bash
   git clone https://github.com/hugo-ninclaus/<nom-du-repo>.git portfolio
   cd portfolio
   DOMAINE=ninclaus.fr docker compose -f compose.yml -f compose.domaine.yml up -d --build
   ```

Caddy (`docker/Caddyfile`) récupère tout seul un certificat Let's Encrypt
et redirige `www.ninclaus.fr` vers `ninclaus.fr`.

**Mettre à jour le site** ensuite :

```bash
git pull
DOMAINE=ninclaus.fr docker compose -f compose.yml -f compose.domaine.yml up -d --build
```

---

## À vérifier / compléter

- Le CV dans `site/assets/docs/` est celui de mars 2026 (« première année ») : à remplacer par la version à jour.
- Email affiché : `hugo.ninclaus@outlook.fr` (celui de l'ancien portfolio). Le CV indique `outlook.com` : garder le bon.
- Terminal de l'accueil, ligne `cat ~/.plan` : objectifs à ajuster (`site/index.html`).
- Téléphone affiché dans la section Contact (comme sur l'ancien site) : à retirer de `site/index.html` si besoin.
- Lien `monster.ninclaus.fr` en commentaire dans `projets.js` (le site ne répond plus) : à réactiver quand il revient.
- Pastille « Disponible pour un stage » en haut de l'accueil : à adapter.
