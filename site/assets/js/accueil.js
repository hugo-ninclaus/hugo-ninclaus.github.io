/*
   Page d'accueil : construit la vitrine et les cartes de projets à partir
   de contenu/projets.js, et anime la vitrine et la frise au défilement.
   Rien à modifier ici pour ajouter un projet.
*/

(function () {

    function numero(i) {
        return (i + 1 < 10 ? "0" : "") + (i + 1);
    }

    /* ---------- Vitrine du haut de page ---------- */

    var vitrine = document.getElementById("vitrine");

    if (vitrine) {
        vitrine.innerHTML = PROJETS.slice(0, 3).map(function (p) {
            return '<a class="couverture" href="projet.html?p=' + p.id + '" tabindex="-1">' +
                '<div class="carrosserie">' + carrosserie(p) + "</div>" +
            "</a>";
        }).join("");

        surDefilement(function () {
            var p = mouvementReduit ? 1 : progression(vitrine, 0.95, 0.25);
            vitrine.style.setProperty("--p", p.toFixed(3));
        });

        pileDeCartes(vitrine);
    }

    /* ---------- Vitrine en pile (tablette, téléphone) : glisser comme sur Tinder ----------
       --rang : 0 = carte du dessus, 1 = juste derrière, etc. (voir accueil.css) */

    function pileDeCartes(vitrine) {
        var cartes = [].slice.call(vitrine.querySelectorAll(".couverture"));
        var projets = PROJETS.slice(0, cartes.length);
        var n = cartes.length;
        var enPile = window.matchMedia("(max-width: 860px)");
        var legende = document.getElementById("vitrine-legende");
        var auto = null;
        var geste = null;
        var bloquerClic = false;

        if (n < 2) return;

        cartes.forEach(function (c, i) {
            c.style.setProperty("--rang", i);
            c.setAttribute("draggable", "false");
            c.querySelectorAll("img").forEach(function (img) { img.setAttribute("draggable", "false"); });
        });

        function rang(c) {
            return Number(c.style.getPropertyValue("--rang"));
        }

        function dessus() {
            return cartes.filter(function (c) { return rang(c) === 0; })[0];
        }

        function majLegende() {
            if (!legende) return;
            var i = cartes.indexOf(dessus());
            legende.innerHTML =
                '<p class="pile-titre">' + projets[i].titre + " <span>· " + projets[i].categorie + "</span></p>" +
                '<p class="pile-points">' + projets.map(function (p, j) {
                    return "<i" + (j === i ? ' class="actif"' : "") + "></i>";
                }).join("") + "</p>" +
                '<p class="pile-indice">← glissez pour voir les projets →</p>';
        }

        // la carte du dessus part sur le côté, puis se range derrière les autres
        function envoyer(carte, sens) {
            carte.style.transition = "transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1)";
            carte.style.transform = "translate(" + sens * 140 + "%, 30px) rotate(" + sens * 22 + "deg)";

            setTimeout(function () {
                carte.style.transition = "none";
                carte.style.transform = "";
                cartes.forEach(function (c) {
                    c.style.setProperty("--rang", (rang(c) + n - 1) % n);
                });
                majLegende();
                void carte.offsetWidth;   // applique la nouvelle place sans animation
                carte.style.transition = "";
            }, 380);
        }

        function arreterAuto() {
            clearInterval(auto);
            auto = null;
        }

        // la pile tourne toute seule tant qu'on n'y a pas touché
        if (!mouvementReduit) {
            auto = setInterval(function () {
                if (enPile.matches && !document.hidden) envoyer(dessus(), -1);
            }, 4000);
        }

        /* ----- le geste ----- */

        vitrine.addEventListener("pointerdown", function (e) {
            if (!enPile.matches) return;
            var carte = e.target.closest(".couverture");
            if (!carte || carte !== dessus()) return;
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
                arreterAuto();
            }

            geste.carte.style.transform =
                "translate(" + geste.dx + "px, " + geste.dy * 0.2 + "px) rotate(" + geste.dx * 0.06 + "deg)";
        });

        function lacher(e) {
            if (!geste || e.pointerId !== geste.id) return;
            var g = geste;
            geste = null;
            if (!g.bouge) return;

            bloquerClic = true;   // un glissement n'est pas un clic
            var vitesse = Math.abs(g.dx) / Math.max(Date.now() - g.debut, 1);

            if (Math.abs(g.dx) > g.carte.offsetWidth * 0.28 || vitesse > 0.6) {
                envoyer(g.carte, g.dx > 0 ? 1 : -1);
            } else {
                g.carte.style.transition = "transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1)";
                g.carte.style.transform = "";
                setTimeout(function () { g.carte.style.transition = ""; }, 460);
            }
        }

        window.addEventListener("pointerup", lacher);
        window.addEventListener("pointercancel", lacher);

        vitrine.addEventListener("click", function (e) {
            if (bloquerClic) {
                e.preventDefault();
                bloquerClic = false;
            }
        }, true);

        majLegende();
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
