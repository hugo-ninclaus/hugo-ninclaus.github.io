/*
   Page d'accueil : construit les cartes de projets à partir
   de contenu/projets.js, et anime la frise au défilement.
   Rien à modifier ici pour ajouter un projet.
*/

(function () {

    function numero(i) {
        return (i + 1 < 10 ? "0" : "") + (i + 1);
    }

    /* ---------- Cartes des projets ---------- */

    var grille = document.getElementById("grille-projets");

    if (grille) {
        grille.innerHTML = PROJETS.map(function (p, i) {
            var tags = p.stack.map(function (t) { return "<li>" + t + "</li>"; }).join("");
            var statut = p.statut ? ' <span class="pastille">' + p.statut + "</span>" : "";

            return '<article class="carte reveal' + (p.large ? " large" : "") + '" style="--i:' + (i % 2) + '">' +
                couverture(p) +
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

})();
