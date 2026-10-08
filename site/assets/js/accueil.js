/*
   Page d'accueil : construit la vitrine et les cartes de projets à partir
   de contenu/projets.js, et anime la vitrine et la frise au défilement.
   Rien à modifier ici pour ajouter un projet.
*/

(function () {

    function numero(i) {
        return (i + 1 < 10 ? "0" : "") + (i + 1);
    }

    /* ---------- Vitrine du haut de page : carrousel des projets ---------- */

    var vitrine = document.getElementById("vitrine");

    if (vitrine) {
        vitrine.innerHTML = PROJETS.slice(0, 3).map(function (p) {
            return '<a class="couverture" href="projet.html?p=' + p.id + '" draggable="false" aria-label="' + p.titre + '">' +
                '<div class="carrosserie">' + carrosserie(p) + "</div>" +
            "</a>";
        }).join("");

        // le carrousel se redresse quand on descend dans la page
        surDefilement(function () {
            var p = mouvementReduit ? 1 : progression(vitrine, 0.95, 0.25);
            vitrine.style.setProperty("--p", p.toFixed(3));
        });

        carrousel(vitrine, document.getElementById("vitrine-legende"));
    }

    /*
       Carrousel : ordinateur = éventail, téléphone = pile façon Tinder (voir accueil.css).
       - on fait glisser la carte du dessus / du centre, ou on utilise les flèches, les points, le clavier
       - quand il est à l'écran et qu'on n'y touche pas, il avance tout seul ;
         après une action de l'utilisateur, il attend PAUSE ms avant de reprendre
    */
    function carrousel(vitrine, legende) {
        var DUREE = 4500;   // temps passé sur chaque projet en lecture automatique
        var PAUSE = 7000;   // pause après une action de l'utilisateur

        var cartes = [].slice.call(vitrine.querySelectorAll(".couverture"));
        var n = cartes.length;
        var enPile = window.matchMedia("(max-width: 860px)");
        var actif = 0;
        var visible = false;
        var derniereAction = 0;
        var minuteur = null;
        var geste = null;
        var bloquerClic = false;

        if (n < 2) return;

        /* ----- légende : titre, flèches, points ----- */

        legende.style.setProperty("--duree", DUREE / 1000 + "s");
        legende.innerHTML =
            '<p class="pile-titre" aria-live="polite"></p>' +
            '<div class="pile-commandes">' +
                '<button type="button" class="pile-fleche" data-sens="-1" aria-label="Projet précédent">‹</button>' +
                '<div class="pile-points">' + cartes.map(function (c, i) {
                    return '<button type="button" data-index="' + i + '" aria-label="Projet ' + (i + 1) + '"><i></i></button>';
                }).join("") + "</div>" +
                '<button type="button" class="pile-fleche" data-sens="1" aria-label="Projet suivant">›</button>' +
            "</div>";

        var titre = legende.querySelector(".pile-titre");
        var points = legende.querySelectorAll(".pile-points button");

        /* ----- placer les cartes autour de la carte active ----- */

        function placer() {
            cartes.forEach(function (c, i) {
                var rang = ((i - actif) % n + n) % n;        // 0, 1, 2 : place dans la pile
                var pos = rang > n / 2 ? rang - n : rang;     // -1, 0, 1 : place dans l'éventail
                c.style.setProperty("--rang", rang);
                c.style.setProperty("--pos", pos);
                c.style.setProperty("--ecart", Math.abs(pos));
                c.classList.toggle("actif", i === actif);
                c.setAttribute("tabindex", i === actif ? "0" : "-1");
            });

            var p = PROJETS[actif];
            titre.innerHTML = p.titre + " <span>· " + p.categorie + "</span>";
            points.forEach(function (b, i) {
                b.classList.toggle("actif", i === actif);
                if (i === actif) b.setAttribute("aria-current", "true");
                else b.removeAttribute("aria-current");
            });
        }

        // aller au projet actif + sens ; sur téléphone la carte du dessus s'envole d'abord
        function changer(sens) {
            var carte = cartes[actif];

            if (!enPile.matches || mouvementReduit) {
                carte.style.transition = "";
                carte.style.transform = "";
                actif = (actif + sens + n) % n;
                placer();
                return;
            }

            carte.style.transition = "transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1)";
            carte.style.transform = "translate(" + (sens > 0 ? -140 : 140) + "%, 30px) rotate(" + (sens > 0 ? -22 : 22) + "deg)";

            setTimeout(function () {
                carte.style.transition = "none";
                carte.style.transform = "";
                actif = (actif + sens + n) % n;
                placer();
                void carte.offsetWidth;   // applique la nouvelle place sans animation
                carte.style.transition = "";
            }, 380);
        }

        function allerA(i) {
            if (i === actif) return;
            actif = i;
            placer();
        }

        /* ----- lecture automatique ----- */

        function lecturePossible() {
            return !mouvementReduit && visible && !document.hidden && !geste &&
                Date.now() - derniereAction > PAUSE &&
                !vitrine.contains(document.activeElement) &&
                !legende.contains(document.activeElement);
        }

        // relance la barre de progression du point actif (en phase avec le minuteur)
        function majProgression() {
            legende.classList.remove("lecture");
            void legende.offsetWidth;
            legende.classList.toggle("lecture", lecturePossible());
        }

        function programmer() {
            clearTimeout(minuteur);
            minuteur = setTimeout(function () {
                if (lecturePossible()) changer(1);
                programmer();
            }, DUREE);
            majProgression();
        }

        function actionUtilisateur() {
            derniereAction = Date.now();
            programmer();
        }

        if ("IntersectionObserver" in window) {
            new IntersectionObserver(function (entries) {
                visible = entries[0].isIntersecting;
                programmer();
            }, { threshold: 0.4 }).observe(vitrine);
        } else {
            visible = true;
        }

        document.addEventListener("visibilitychange", programmer);

        /* ----- flèches, points, clavier ----- */

        legende.addEventListener("click", function (e) {
            var fleche = e.target.closest("[data-sens]");
            var point = e.target.closest("[data-index]");
            if (fleche) changer(Number(fleche.getAttribute("data-sens")));
            else if (point) allerA(Number(point.getAttribute("data-index")));
            else return;
            actionUtilisateur();
        });

        vitrine.addEventListener("keydown", function (e) {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            e.preventDefault();
            changer(e.key === "ArrowRight" ? 1 : -1);
            actionUtilisateur();
        });

        /* ----- le geste : glisser la carte active ----- */

        vitrine.addEventListener("pointerdown", function (e) {
            var carte = e.target.closest(".couverture");
            if (!carte || carte !== cartes[actif] || e.button > 0) return;
            bloquerClic = false;
            geste = { id: e.pointerId, carte: carte, x: e.clientX, y: e.clientY, dx: 0, dy: 0, debut: Date.now(), bouge: false };
        });

        window.addEventListener("pointermove", function (e) {
            if (!geste || e.pointerId !== geste.id) return;
            geste.dx = e.clientX - geste.x;
            geste.dy = e.clientY - geste.y;

            if (!geste.bouge) {
                if (Math.abs(geste.dx) < 8 && Math.abs(geste.dy) < 8) return;
                if (Math.abs(geste.dy) > Math.abs(geste.dx)) {   // c'est un défilement vertical
                    geste = null;
                    return;
                }
                geste.bouge = true;
                geste.carte.style.transition = "none";
                actionUtilisateur();
            }

            var dy = enPile.matches ? geste.dy * 0.2 : 0;
            var angle = geste.dx * (enPile.matches ? 0.06 : 0.02);
            geste.carte.style.transform = "translate(" + geste.dx + "px, " + dy + "px) rotate(" + angle + "deg)";
        });

        function lacher(e) {
            if (!geste || e.pointerId !== geste.id) return;
            var g = geste;
            geste = null;
            if (!g.bouge) return;

            bloquerClic = true;   // un glissement n'est pas un clic
            var vitesse = Math.abs(g.dx) / Math.max(Date.now() - g.debut, 1);

            if (Math.abs(g.dx) > g.carte.offsetWidth * 0.25 || vitesse > 0.6) {
                changer(g.dx < 0 ? 1 : -1);
            } else {
                g.carte.style.transition = "";
                g.carte.style.transform = "";
            }
            actionUtilisateur();
        }

        window.addEventListener("pointerup", lacher);
        window.addEventListener("pointercancel", lacher);

        // après un glissement on n'ouvre pas le projet ; un clic sur une carte de côté l'amène au centre
        vitrine.addEventListener("click", function (e) {
            var carte = e.target.closest(".couverture");
            if (bloquerClic) {
                e.preventDefault();
                bloquerClic = false;
                return;
            }
            if (carte && carte !== cartes[actif]) {
                e.preventDefault();
                allerA(cartes.indexOf(carte));
                actionUtilisateur();
            }
        }, true);

        placer();
        programmer();
    }

    /* ---------- Cartes des projets ---------- */

    var grille = document.getElementById("grille-projets");

    if (grille) {
        grille.innerHTML = PROJETS.map(function (p, i) {
            var tags = p.stack.map(function (t) { return "<li>" + t + "</li>"; }).join("");
            var statut = p.statut ? ' <span class="pastille">' + p.statut + "</span>" : "";

            return '<article class="carte reveal' + (p.large ? " large" : "") + '" data-capot style="--i:' + (i % 2) + '">' +
                couvertureComplete(p) +
                '<div class="carte-texte">' +
                    '<p class="carte-meta"><b>' + numero(i) + "</b>" + p.categorie + "<span>" + p.annee + "</span></p>" +
                    '<h3><a href="projet.html?p=' + p.id + '">' + p.titre + "</a>" + statut + "</h3>" +
                    '<p class="resume">' + p.resume + "</p>" +
                    '<ul class="tags">' + tags + "</ul>" +
                    '<span class="voir" aria-hidden="true">Voir le projet <span>›</span></span>' +
                "</div>" +
            "</article>";
        }).join("");
    }

    /* ---------- Frise du parcours ---------- */

    var frise = document.querySelector(".frise");

    if (frise) {
        var etapes = frise.querySelectorAll(":scope > li");

        surDefilement(function () {
            var r = frise.getBoundingClientRect();
            var p = (window.innerHeight * 0.6 - r.top) / r.height;
            p = mouvementReduit ? 1 : Math.min(Math.max(p, 0), 1);
            frise.style.setProperty("--p", p.toFixed(3));

            var niveau = p * r.height;
            etapes.forEach(function (li) {
                li.classList.toggle("atteint", li.offsetTop + 14 <= niveau);
            });
        });
    }

    /* ---------- Barre du haut : le lien de la section affichée ---------- */

    var liensNav = document.querySelectorAll('.nav-liens a[href^="#"]');

    if (liensNav.length && "IntersectionObserver" in window) {
        var espion = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                liensNav.forEach(function (a) {
                    a.classList.toggle("actif", a.getAttribute("href") === "#" + e.target.id);
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px" });

        document.querySelectorAll("main section[id]").forEach(function (s) { espion.observe(s); });
    }

    /* ---------- Indice "survolez" / "touchez" ---------- */

    if (window.matchMedia("(hover: none)").matches) {
        document.querySelectorAll("[data-tactile]").forEach(function (el) {
            el.textContent = el.getAttribute("data-tactile");
        });
    }
})();
