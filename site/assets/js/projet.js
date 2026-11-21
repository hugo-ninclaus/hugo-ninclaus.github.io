/*
   Page projet : lit l'id dans l'adresse (projet.html?p=fil-rouge),
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
            '<section class="contenu introuvable">' +
                '<p class="label"><b>404</b>Projet introuvable</p>' +
                "<h1>Ce projet n'existe pas.<br><span class=\"dim\">Ou plus.</span></h1>" +
                '<p><a class="lien" href="index.html#projets">Voir tous les projets <span>›</span></a></p>' +
            "</section>";
        return;
    }

    var p = PROJETS[index];
    var numero = (index + 1 < 10 ? "0" : "") + (index + 1);

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
        return '<a class="lien" href="' + l.url + '" target="_blank" rel="noopener">' + l.texte + " <span>↗</span></a>";
    }).join("");

    var fiche =
        '<dl class="fiche reveal">' +
            "<div><dt>Type</dt><dd>" + p.cadre + "</dd></div>" +
            "<div><dt>Année</dt><dd>" + p.annee + "</dd></div>" +
            '<div class="fiche-stack"><dt>Stack</dt><dd><ul class="tags">' + tags + "</ul></dd></div>" +
            (liens ? "<div><dt>Liens</dt><dd>" + liens + "</dd></div>" : "") +
        "</dl>";

    /* ---------- Haut de page : site en direct ou couverture ---------- */

    // le site est affiché comme sur un écran d'ordinateur (largeur en px), puis réduit à la taille du cadre
    function largeurEcran(cadre) {
        return cadre < 600 ? 1024 : 1440;
    }

    function navigateur(url) {
        var adresse = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
        return '<figure class="navigateur">' +
            '<div class="navigateur-barre">' +
                '<span class="feux" aria-hidden="true"><i></i><i></i><i></i></span>' +
                '<span class="adresse">' + adresse + "</span>" +
                '<a class="ouvrir" href="' + url + '" target="_blank" rel="noopener">Ouvrir <span>↗</span></a>' +
            "</div>" +
            '<div class="navigateur-ecran">' +
                '<iframe src="' + url + '" title="' + p.titre + ', le site en ligne" loading="lazy"></iframe>' +
            "</div>" +
            '<figcaption><span class="direct"></span>En direct : le site se parcourt ici même.</figcaption>' +
        "</figure>";
    }

    var haut = p.apercu ? navigateur(p.apercu) : couverture(p);

    /* ---------- Galerie ---------- */

    var images = p.images || [];
    var galerie = "";

    if (images.length) {
        var diapos = images.map(function (img, i) {
            return '<figure class="diapo">' +
                '<button class="zoom" type="button" data-index="' + i + '" aria-label="Agrandir l\'image">' +
                    '<img src="' + img.src + '" alt="' + (img.legende || p.titre) + '" loading="lazy">' +
                "</button>" +
                (img.legende ? "<figcaption>" + img.legende + "</figcaption>" : "") +
            "</figure>";
        }).join("");

        var points = images.map(function (img, i) {
            return '<button type="button" data-index="' + i + '" aria-label="Image ' + (i + 1) + '"' + (i === 0 ? ' class="actif"' : "") + "></button>";
        }).join("");

        galerie =
            '<section class="galerie reveal" aria-label="Images du projet">' +
                '<div class="galerie-piste">' + diapos + "</div>" +
                (images.length > 1
                    ? '<div class="galerie-commandes">' +
                          '<button class="fleche" type="button" data-sens="-1" aria-label="Image précédente">‹</button>' +
                          '<div class="points">' + points + "</div>" +
                          '<button class="fleche" type="button" data-sens="1" aria-label="Image suivante">›</button>' +
                      "</div>"
                    : "") +
            "</section>";
    }

    /* ---------- Assemblage ---------- */

    document.title = p.titre + " · Hugo Ninclaus";
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", p.resume.replace(/<[^>]+>/g, ""));

    zone.innerHTML =
        '<div class="contenu">' +
            '<a class="retour" href="index.html#projets"><span>‹</span> Tous les projets</a>' +

            '<header class="projet-tete">' +
                '<p class="label reveal"><b>' + numero + "</b>" + p.categorie + (p.statut ? '<span class="pastille">' + p.statut + "</span>" : "") + "</p>" +
                '<h1 class="reveal">' + p.titre + '<br><span class="dim">' + p.accroche + "</span></h1>" +
                '<p class="intro reveal">' + p.resume + "</p>" +
            "</header>" +

            '<div class="projet-couverture reveal">' + haut + "</div>" +

            fiche +

            '<div class="recit">' +
                partie("Contexte", p.contexte) +
                partie("Ce que j'ai fait", p.realisation) +
                partie("Ce que j'en ai tiré", p.bilan) +
            "</div>" +

            galerie +
        "</div>";

    /* ---------- Site en direct : mise à l'échelle ---------- */

    var ecran = zone.querySelector(".navigateur-ecran");

    if (ecran) {
        var cadre = ecran.querySelector("iframe");
        var ajuster = function () {
            var largeur = largeurEcran(ecran.clientWidth);
            var echelle = ecran.clientWidth / largeur;
            cadre.style.width = largeur + "px";
            cadre.style.transform = "scale(" + echelle + ")";
            cadre.style.height = ecran.clientHeight / echelle + "px";
        };
        ajuster();
        if ("ResizeObserver" in window) new ResizeObserver(ajuster).observe(ecran);
        else window.addEventListener("resize", ajuster);
    }

    /* ---------- Galerie : défilement, points, flèches ---------- */

    var piste = zone.querySelector(".galerie-piste");

    if (piste && images.length > 1) {
        var boutonsPoints = zone.querySelectorAll(".points button");

        function aller(i) {
            i = (i + images.length) % images.length;
            piste.scrollTo({ left: i * piste.clientWidth, behavior: mouvementReduit ? "auto" : "smooth" });
        }

        function courant() {
            return Math.round(piste.scrollLeft / piste.clientWidth);
        }

        zone.querySelectorAll(".galerie .fleche").forEach(function (b) {
            b.addEventListener("click", function () {
                aller(courant() + Number(b.getAttribute("data-sens")));
            });
        });
        boutonsPoints.forEach(function (b) {
            b.addEventListener("click", function () { aller(Number(b.getAttribute("data-index"))); });
        });
        piste.addEventListener("scroll", function () {
            var c = courant();
            boutonsPoints.forEach(function (b, i) { b.classList.toggle("actif", i === c); });
        }, { passive: true });
    }

    /* ---------- Visionneuse (image en grand) ---------- */

    var visionneuse = document.querySelector(".visionneuse");

    if (visionneuse && images.length && visionneuse.showModal) {
        var grande = visionneuse.querySelector("img");
        var legende = visionneuse.querySelector("figcaption");
        var actuelle = 0;

        function montrer(i) {
            actuelle = (i + images.length) % images.length;
            grande.src = images[actuelle].src;
            grande.alt = images[actuelle].legende || p.titre;
            legende.textContent = images[actuelle].legende || "";
        }

        zone.querySelectorAll(".zoom").forEach(function (b) {
            b.addEventListener("click", function () {
                montrer(Number(b.getAttribute("data-index")));
                visionneuse.showModal();
            });
        });

        visionneuse.querySelector(".fermer-visionneuse").addEventListener("click", function () { visionneuse.close(); });
        visionneuse.querySelectorAll("[data-sens]").forEach(function (b) {
            b.hidden = images.length < 2;
            b.addEventListener("click", function () { montrer(actuelle + Number(b.getAttribute("data-sens"))); });
        });
        visionneuse.addEventListener("click", function (e) {
            if (e.target === visionneuse) visionneuse.close();
        });
        visionneuse.addEventListener("keydown", function (e) {
            if (e.key === "ArrowLeft") montrer(actuelle - 1);
            if (e.key === "ArrowRight") montrer(actuelle + 1);
        });
    }
})();
