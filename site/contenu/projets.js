/*
   ============================================================
   MES PROJETS
   ============================================================

   C'est le seul fichier à modifier pour gérer les projets.
   Chaque bloc { ... } donne :
     - une tuile sur la page d'accueil (section Projets)
     - une page complète : projet.html?p=<id>

   Ajouter un projet  : copier un bloc, changer l'id, remplir.
   Retirer un projet  : supprimer son bloc.
   Changer l'ordre    : déplacer les blocs (l'ordre ici = l'ordre sur le site).

   Champs :
     id           court, sans espace ni accent, il sert dans l'adresse
     titre        nom du projet
     accroche     phrase sous le titre, sur la page du projet
     categorie    petite ligne en haut de la tuile
     annee        texte libre ("2026", "2025 – 2026"...)
     cadre        "Projet scolaire · ESILV", "Projet perso"...
     resume       texte de la tuile (2 lignes max idéalement)
     stack        liste des technos
     tuile        optionnel : "wide" (2 colonnes), "accent" (bleue), ou "wide accent"
     liens        optionnel : [{ texte: "...", url: "..." }]
     images       optionnel : [{ src: "assets/img/projets/...", legende: "..." }]
     terminal     optionnel : bloc de terminal (HTML autorisé, voir bhttpd)
     contexte, realisation, bilan
                  texte de la page. Une chaîne = un paragraphe,
                  une liste de chaînes = plusieurs paragraphes.
                  Le HTML simple est accepté (<code>, <a>, <strong>).
*/

const PROJETS = [

    {
        id: "bhttpd",
        titre: "bhttpd",
        accroche: "Un serveur web en 54 lignes de C.",
        categorie: "Système & réseau",
        annee: "2026",
        cadre: "Projet scolaire · ESILV",
        resume: "Un serveur HTTP/1.0 écrit en C, sans bibliothèque. Il tourne sur le serveur de l'école et passe valgrind sans une seule erreur.",
        stack: ["C", "Sockets TCP", "HTTP/1.0", "Linux", "Make"],
        tuile: "wide accent",
        liens: [],
        images: [],
        terminal: `<span class="prompt">$</span> make && make install
<span class="prompt">$</span> ~/opt/bhttpd/sbin/bhttpd -p 26198 -d
<span class="ok">serveur en ecoute sur le port 26198</span>

<span class="prompt">$</span> printf "GET / HTTP/1.0\\r\\n\\r\\n" | nc localhost 26198
<span class="ok">HTTP/1.0 200 OK</span>
<span class="key">Content-Type:</span> text/html; charset=utf-8

<span class="prompt">$</span> printf "POST / HTTP/1.0\\r\\n\\r\\n" | nc localhost 26198
<span class="ok">HTTP/1.0 400 Bad Request</span>`,
        contexte: [
            "Projet du cours de programmation système et réseaux, en deuxième année. Le sujet : écrire un serveur HTTP/1.0 en C, l'installer sur la machine de l'école et le laisser tourner.",
            "Des tests automatiques vérifient qu'il répond comme il faut : <code>200</code> pour une requête correcte, <code>400</code> pour une commande invalide, <code>404</code> pour un fichier qui n'existe pas."
        ],
        realisation: [
            "Tout tient dans un seul fichier. On crée la socket, on l'attache au port avec <code>bind</code>, puis une boucle accepte les clients un par un : lecture de la ligne de requête, vérification, envoi du fichier avec <code>sendfile</code>, fermeture.",
            "Les options passent par <code>getopt</code> (<code>-p</code> port, <code>-d</code> debug, <code>-h</code> aide) et les chemins contenant <code>..</code> sont refusés pour qu'on ne puisse pas sortir du dossier servi."
        ],
        bilan: "Je me suis imposé de garder un code que je peux expliquer ligne par ligne. Ça m'a obligé à enlever plutôt qu'à ajouter. Et maintenant je sais exactement ce qui se passe entre le moment où on tape une adresse et celui où la page s'affiche."
    },

    {
        id: "miniserveur",
        titre: "Miniserveur",
        accroche: "Un vieux PC, devenu serveur web.",
        categorie: "Infra",
        annee: "2026",
        cadre: "Projet perso",
        resume: "Un PC de bureau qui ne servait plus, passé sous Ubuntu Server avec Nginx. Administré à distance, en SSH.",
        stack: ["Ubuntu Server", "Nginx", "SSH", "SCP"],
        liens: [],
        images: [],
        terminal: `<span class="prompt">$</span> ssh hugo@miniserveur
<span class="prompt">hugo@miniserveur:~$</span> sudo nginx -t
<span class="ok">nginx: configuration file /etc/nginx/nginx.conf test is successful</span>
<span class="prompt">hugo@miniserveur:~$</span> sudo systemctl reload nginx
<span class="prompt">hugo@miniserveur:~$</span> exit

<span class="prompt">$</span> scp -r site/ hugo@miniserveur:/var/www/`,
        contexte: "Héberger un site, c'est soit payer, soit dépendre d'une plateforme. J'avais un PC de bureau qui prenait la poussière : autant qu'il serve à quelque chose.",
        realisation: [
            "Installation d'Ubuntu Server, puis une IP fixe réservée sur la box pour que la machine ne change pas d'adresse à chaque redémarrage.",
            "Nginx sert ensuite les différentes pages. Tout se fait depuis un autre ordinateur : connexion en SSH pour l'administration, envoi des fichiers en SCP."
        ],
        bilan: "C'est là que j'ai compris concrètement ce que sont une IP, un port et un fichier de configuration Nginx. Et qu'un point-virgule oublié suffit à faire tomber un site."
    },

    {
        id: "monster",
        titre: "Monster, refait",
        accroche: "La refonte d'un site de grande marque.",
        categorie: "Front-end",
        annee: "2026",
        cadre: "Projet scolaire · ESILV",
        resume: "Le site de Monster Energy repensé de zéro, en HTML et CSS. Plus simple à parcourir, avec les athlètes mis en avant.",
        stack: ["HTML", "CSS"],
        liens: [
            { texte: "Voir le site", url: "http://monster.ninclaus.fr" }
        ],
        images: [
            { src: "assets/img/projets/monster.jpg", legende: "La page d'accueil." }
        ],
        contexte: "Note finale du cours de HTML/CSS de première année. La consigne : prendre le site d'une grande marque et le réinventer complètement, du style à l'organisation des pages.",
        realisation: "J'ai découpé le site par univers (boissons, athlètes, événements, actus) pour qu'on trouve ce qu'on cherche en un clic. Les athlètes sponsorisés ont leur propre page, avec un lien vers leur fiche Wikipédia.",
        bilan: "C'est ce projet qui m'a donné envie de faire du front. J'ai bloqué plusieurs fois sur des mises en page qui refusaient de s'aligner, et j'ai pris l'habitude d'aller chercher la réponse dans la documentation plutôt que de contourner le problème."
    },

    {
        id: "neopark",
        titre: "NeoPark",
        accroche: "Un parking qui vous guide.",
        categorie: "Projet fil rouge",
        annee: "2025 – 2026",
        cadre: "Projet scolaire · ESILV · en équipe",
        resume: "Une maquette de parking intelligent : capteurs à ultrasons, écran des places libres, chemin de LED vers la place la plus proche.",
        stack: ["Arduino", "C++", "SolidWorks", "HTML", "CSS", "JavaScript"],
        tuile: "wide",
        liens: [],
        images: [
            { src: "assets/img/projets/neopark-capteurs.png", legende: "Détection des places : 4 capteurs HC-SR04 et un écran LCD à l'entrée." },
            { src: "assets/img/projets/neopark-led.png", legende: "Guidage : 8 LED pilotées par un registre à décalage 74HC595." }
        ],
        contexte: "Le projet fil rouge de première année, en équipe. Le but : concevoir un parking intelligent avec des fonctions qu'on ne trouve pas ailleurs, de la maquette 3D jusqu'à l'électronique.",
        realisation: [
            "Quatre capteurs à ultrasons détectent si une voiture occupe une place, et un écran LCD affiche à l'entrée le nombre de places restantes.",
            "Quand un conducteur entre, un chemin de LED s'allume jusqu'à la place libre la plus proche (choisie par un algorithme glouton). Une caméra lit les plaques pour vérifier les réservations, et une application web permet de réserver une place et une durée à l'avance."
        ],
        bilan: "Le premier projet où tout se mélange : modélisation sous SolidWorks, câblage, code Arduino, développement web. Et le premier où il a fallu se répartir le travail et tenir les délais à plusieurs."
    },

    {
        id: "war-arenai",
        titre: "War ArenAI",
        accroche: "Trois IA, une seule question.",
        categorie: "Projet perso",
        annee: "2026",
        cadre: "Projet perso",
        resume: "Une application web qui pose la même question à Claude, ChatGPT et Gemini, puis affiche les réponses côte à côte. Ou les fait travailler à la chaîne.",
        stack: ["Node.js", "Express", "SQLite", "API Claude", "API OpenAI", "API Gemini"],
        tuile: "wide",
        liens: [],
        images: [],
        contexte: "J'utilisais plusieurs IA en parallèle et je passais mon temps à copier-coller la même question d'un onglet à l'autre. Je voulais tout au même endroit.",
        realisation: [
            "Un serveur Express avec un connecteur par fournisseur (Anthropic, OpenAI, Google). Deux modes : <strong>comparatif</strong>, où toutes les IA reçoivent la question en même temps, et <strong>pipeline</strong>, où chacune repart de la réponse de la précédente.",
            "Chaque IA peut recevoir un rôle. Les sessions sont enregistrées dans une base SQLite pour retrouver l'historique."
        ],
        bilan: "Mon premier vrai back-end en JavaScript : routes, appels asynchrones en parallèle, gestion des erreurs quand une API ne répond pas, et des clés d'API qui restent dans un fichier <code>.env</code> au lieu du code."
    },

    {
        id: "pixel-mate",
        titre: "Pixel Mate",
        accroche: "Un compagnon de bureau en pixel art.",
        categorie: "Projet perso",
        annee: "2026",
        cadre: "Projet perso",
        resume: "Pip, un petit personnage en pixel art qui se promène sur le bureau. Un clic, et il ouvre une console pour discuter via Gemini.",
        stack: ["Python", "Tkinter", "API Gemini"],
        liens: [],
        images: [
            { src: "assets/img/projets/pixel-mate.png", legende: "La console, en mode démo." },
            { src: "assets/img/projets/pixel-mate-reglages.png", legende: "Les réglages." }
        ],
        contexte: "Une idée pour le plaisir : un petit compagnon à la Tamagotchi qui vit sur le bureau, mais avec qui on peut vraiment parler.",
        realisation: [
            "Pip est dessiné directement en Python, sans aucune image. Il marche, change de direction, réagit aux clics et se déplace au glisser-déposer.",
            "Un clic ouvre une console rétro reliée à Gemini. Un mode <code>--demo</code> permet de tout tester sans clé d'API, et la clé peut être enregistrée ou supprimée depuis les réglages."
        ],
        bilan: "Tkinter n'est pas vraiment fait pour animer un personnage qui se balade à l'écran, il a fallu bricoler. Et j'ai appris qu'une interface doit rester réactive pendant qu'on attend la réponse d'une API."
    }

];
