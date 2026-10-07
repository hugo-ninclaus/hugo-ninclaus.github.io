/*
   Page d'accueil : construit les tuiles de projets à partir de
   contenu/projets.js. Rien à modifier ici pour ajouter un projet.
*/

(function () {
    if (typeof PROJETS === "undefined") return;

    /* ---------- Tuiles ---------- */

    var grille = document.getElementById("grille-projets");

    if (grille) {
        grille.innerHTML = PROJETS.map(function (p) {
            var tags = p.stack.map(function (t) { return "<li>" + t + "</li>"; }).join("");

            return '<a class="tile reveal ' + (p.tuile || "") + '" href="projet.html?p=' + p.id + '">' +
                '<p class="tile-label">' + p.categorie + " · " + p.annee + "</p>" +
                "<h3>" + p.titre + "</h3>" +
                '<p class="resume">' + p.resume + "</p>" +
                '<ul class="tags">' + tags + "</ul>" +
            "</a>";
        }).join("");
    }

    /* ---------- "ls projets/" dans le terminal ---------- */

    var ls = document.getElementById("ls-projets");

    if (ls) {
        ls.textContent = PROJETS.map(function (p) { return p.id + "/"; }).join("  ");
    }
})();
