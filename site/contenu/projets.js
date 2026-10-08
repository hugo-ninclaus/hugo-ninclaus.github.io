/*
   ============================================================
   MES PROJETS
   ============================================================

   C'est le seul fichier à modifier pour gérer les projets.
   Chaque bloc { ... } donne :
     - une carte sur la page d'accueil (section Projets)
     - une page complète : projet.html?p=<id>

   Ajouter un projet  : copier un bloc, changer l'id, remplir.
   Retirer un projet  : supprimer son bloc.
   Changer l'ordre    : déplacer les blocs (l'ordre ici = l'ordre sur le site).

   Champs :
     id           court, sans espace ni accent, il sert dans l'adresse
     titre        nom du projet
     accroche     phrase sous le titre, sur la page du projet
     categorie    petite ligne au-dessus du titre
     annee        texte libre ("2026", "2025 – 2026"...)
     cadre        "Projet scolaire", "Projet personnel"...
     statut       optionnel : petite pastille ("En cours"...)
     resume       texte de la carte (2-3 lignes)
     stack        liste des technos
     large        optionnel : true = carte en pleine largeur sur l'accueil

     couverture   l'image de la carte :
                    - un dessin du site : "parking", "serveur"
                      (voir assets/js/couvertures.js)
                    - ou une image : { image: "assets/img/projets/x.jpg" }

     capot        optionnel : ce qu'on voit "sous le capot" au survol
                    { fichier: "nom affiché", langage: "html" | "sh" | "texte" | "js" | "c" | "py",
                      code: `...` }

     liens        optionnel : [{ texte: "...", url: "..." }]
     images       optionnel : [{ src: "...", legende: "..." }] (galerie de la page projet)
     contexte, realisation, bilan
                  texte de la page. Une chaîne = un paragraphe,
                  une liste de chaînes = plusieurs paragraphes.
                  Le HTML simple est accepté (<code>, <a>, <strong>).
*/

const PROJETS = [

    {
        id: "fil-rouge",
        titre: "Projet fil rouge",
        accroche: "Un parking qui guide ses usagers.",
        categorie: "Électronique & web",
        annee: "2025 – 2026",
        cadre: "Projet scolaire · en équipe",
        resume: "Un parking intelligent en maquette : des LED guident jusqu'à la place libre la plus proche, une caméra reconnaît les plaques et un écran affiche les places disponibles en temps réel.",
        stack: ["Arduino", "Circuits", "Modélisation 3D", "HTML", "CSS", "JavaScript"],
        large: true,
        couverture: "parking",
        capot: {
            fichier: "montages.txt",
            langage: "texte",
            code: `# Montage 1 : détection des places
Arduino UNO
4 × capteur à ultrasons HC-SR04
1 × écran LCD 16×2 (I2C)
→ affiche « Places restantes : 3/4 »

# Montage 2 : guidage
1 × registre à décalage 74HC595
8 × LED + résistances
→ chemin vers la place libre la plus proche
  (algorithme glouton)`
        },
        images: [
            { src: "assets/img/projets/fil-rouge-capteurs.png", legende: "Capteurs et écran LCD : un capteur détecte une voiture, l'écran affiche « Places restantes : 3/4 »." },
            { src: "assets/img/projets/fil-rouge-led.png", legende: "Guidage par LED : le chemin s'allume jusqu'à la place la plus proche." }
        ],
        contexte: "Ce projet nous a été donné comme projet de fin d'année. Le but : créer un parking intelligent, avec des fonctionnalités qu'on ne trouve nulle part ailleurs.",
        realisation: [
            "Nous avons choisi trois fonctionnalités. D'abord, un chemin de LED qui guide l'usager vers la place la plus proche, qu'il ait réservé ou non, grâce à un algorithme glouton.",
            "Ensuite, une caméra qui lit les plaques d'immatriculation pour vérifier si l'usager est enregistré. Enfin, des capteurs reliés à un écran LCD qui affiche à l'entrée le nombre de places restantes, en temps réel.",
            "Une application permet en plus de réserver une place à l'avance et de choisir la durée du stationnement."
        ],
        bilan: "Un projet long, qui m'a fait combiner presque tout ce que j'ai appris dans l'année : la modélisation 3D, les circuits électroniques, JavaScript, HTML et CSS. Et le premier où il a fallu se répartir le travail et tenir les délais en équipe."
    },

    {
        id: "monster",
        titre: "Redesign de Monster",
        accroche: "Réinventer le site d'une grande marque.",
        categorie: "Développement front-end",
        annee: "2026",
        cadre: "Projet scolaire",
        resume: "Le site de Monster Energy repensé de zéro en HTML et CSS : plus simple à parcourir, avec les athlètes sponsorisés mis en avant.",
        stack: ["HTML", "CSS"],
        couverture: { image: "assets/img/projets/monster.jpg" },
        capot: {
            fichier: "index.html",
            langage: "html",
            code: `<header>
    <a href="index.html"><img src="photo/Logo_Monster_Energy.webp" alt="" /></a>
    <div class="menu">
        <a href="index.html" class="active">Accueil</a>
        <a href="news.html">News</a>
        <a href="boisson.html">Boissons</a>
        <a href="athlete.html">Athletes</a>
        <a href="evenement.html">Evenement</a>
    </div>
    <a class="primary-btn" href="connexion.html">Connexion</a>
</header>`
        },
        liens: [
            { texte: "Voir le site", url: "https://hugo-ninclaus.github.io/Projet_html/" },
            { texte: "Code source", url: "https://github.com/hugo-ninclaus/Projet_html" },
        ],
        contexte: "Ce projet nous a été donné comme note finale du cours de HTML/CSS. Le défi : réinventer un site qui existe déjà, en repensant entièrement son style, son agencement et ses fonctionnalités.",
        realisation: "J'ai conçu une version plus simple à utiliser, organisée par univers : boissons, athlètes, événements, actualités. Les grands athlètes sponsorisés par la marque sont mis en avant, chacun avec un lien vers sa page Wikipédia.",
        bilan: "C'est avec ce projet que j'ai vraiment pris goût au HTML, au CSS et au design d'interfaces. J'ai rencontré plusieurs problèmes en cours de route, et j'ai appris à les résoudre grâce à la documentation plutôt qu'en les contournant."
    },

    {
        id: "miniserveur",
        titre: "Miniserveur",
        accroche: "Un vieux PC, devenu serveur web.",
        categorie: "Serveur",
        annee: "2026",
        cadre: "Projet personnel",
        resume: "Un ordinateur de bureau transformé en serveur Nginx, avec une IP fixe, administré à distance en SSH et SCP.",
        stack: ["Ubuntu Server", "Nginx", "Réseaux", "SSH", "SCP"],
        couverture: "serveur",
        capot: {
            fichier: "terminal",
            langage: "sh",
            code: `$ ssh hugo@miniserveur
hugo@miniserveur:~$ sudo nginx -t
nginx: configuration file /etc/nginx/nginx.conf test is successful
hugo@miniserveur:~$ sudo systemctl reload nginx
hugo@miniserveur:~$ exit
$ scp -r site/ hugo@miniserveur:~/www/`
        },
        contexte: "Je voulais héberger mes sites sans payer d'hébergeur. Un ordinateur de bureau qui ne servait plus, c'était l'occasion : une alternative gratuite, et surtout un bon moyen d'apprendre.",
        realisation: [
            "J'ai installé Ubuntu Server sur la machine et je lui ai attribué une IP fixe sur ma box internet, pour qu'elle garde toujours la même adresse.",
            "J'ai ensuite installé Nginx et configuré les redirections vers les différentes pages HTML. Tout se fait à distance : connexion en SSH depuis un autre ordinateur, envoi des fichiers en SCP."
        ],
        bilan: "J'ai appris à configurer une IP fixe, à me connecter en SSH à un serveur, à envoyer des fichiers en SCP et à écrire une configuration Nginx. Et qu'un point-virgule oublié suffit à faire tomber un site."
    }

];
