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

    /* ---------- Indice "survolez" / "touchez" ---------- */

    if (window.matchMedia("(hover: none)").matches) {
        document.querySelectorAll("[data-tactile]").forEach(function (el) {
            el.textContent = el.getAttribute("data-tactile");
        });
    }
})();
