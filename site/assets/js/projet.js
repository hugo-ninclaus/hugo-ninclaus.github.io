/*
   Page projet : lit l'id dans l'adresse (projet.html?p=bhttpd),
   retrouve le projet dans contenu/projets.js et remplit la page.
   Rien à modifier ici pour ajouter un projet.
*/

(function () {
    var zone = document.getElementById("projet");
    var id = new URLSearchParams(window.location.search).get("p");
    var index = PROJETS.findIndex(function (p) { return p.id === id; });

    /* ---------- Projet introuvable ---------- */

    if (index === -1) {
        document.title = "Projet introuvable · Hugo Ninclaus";
        zone.innerHTML =
            '<section class="introuvable">' +
                '<p class="eyebrow">Erreur 404</p>' +
                "<h1>Ce projet n'existe pas.<br><span class=\"dim\">Ou plus.</span></h1>" +
                '<p><a class="link" href="index.html#projets">Voir tous les projets <span>›</span></a></p>' +
            "</section>";
        return;
    }

    var p = PROJETS[index];
    var suivant = PROJETS[(index + 1) % PROJETS.length];

    /* ---------- Petits outils ---------- */

    // une chaîne = un paragraphe, une liste = plusieurs
    function paragraphes(texte) {
        return [].concat(texte || []).map(function (t) { return "<p>" + t + "</p>"; }).join("");
    }

    function partie(titre, texte) {
        if (!texte) return "";
        return '<section class="reveal"><h2>' + titre + "</h2><div>" + paragraphes(texte) + "</div></section>";
    }

    /* ---------- Fiche ---------- */

    var tags = p.stack.map(function (t) { return "<li>" + t + "</li>"; }).join("");

    var liens = (p.liens || []).map(function (l) {
        return '<a href="' + l.url + '" target="_blank" rel="noopener">' + l.texte + " <span>›</span></a>";
    }).join("");

    var fiche =
        '<dl class="fiche reveal">' +
            "<div><dt>Cadre</dt><dd>" + p.cadre + "</dd></div>" +
            "<div><dt>Année</dt><dd>" + p.annee + "</dd></div>" +
            '<div><dt>Stack</dt><dd><ul class="tags">' + tags + "</ul></dd></div>" +
            (liens ? "<div><dt>Liens</dt><dd>" + liens + "</dd></div>" : "") +
        "</dl>";

    /* ---------- Images ---------- */

    var images = "";
    if (p.images && p.images.length) {
        images = '<div class="galerie">' + p.images.map(function (img) {
            return '<figure class="reveal">' +
                '<div class="cadre"><img src="' + img.src + '" alt="' + (img.legende || p.titre) + '" loading="lazy"></div>' +
                (img.legende ? "<figcaption>" + img.legende + "</figcaption>" : "") +
            "</figure>";
        }).join("") + "</div>";
    }

    /* ---------- Terminal ---------- */

    var terminal = "";
    if (p.terminal) {
        terminal =
            '<div class="terminal reveal">' +
                '<div class="term-bar"><i></i><i></i><i></i><span>' + p.id + "</span></div>" +
                "<pre>" + p.terminal + "</pre>" +
            "</div>";
    }

    /* ---------- Assemblage ---------- */

    document.title = p.titre + " · Hugo Ninclaus";
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", p.resume.replace(/<[^>]+>/g, ""));

    zone.innerHTML =
        '<a class="retour" href="index.html#projets"><span>‹</span> Tous les projets</a>' +

        '<header class="projet-tete">' +
            '<p class="eyebrow reveal">' + p.categorie + "</p>" +
            '<h1 class="reveal">' + p.titre + '<br><span class="dim">' + p.accroche + "</span></h1>" +
            fiche +
        "</header>" +

        images +

        '<div class="recit">' +
            partie("Contexte", p.contexte) +
            partie("Ce que j'ai fait", p.realisation) +
            partie("Ce que j'en retire", p.bilan) +
        "</div>" +

        terminal +

        (suivant !== p
            ? '<a class="suivant" href="projet.html?p=' + suivant.id + '">' +
                  "<small>Projet suivant</small>" +
                  "<strong>" + suivant.titre + " <span>›</span></strong>" +
              "</a>"
            : "");
})();
