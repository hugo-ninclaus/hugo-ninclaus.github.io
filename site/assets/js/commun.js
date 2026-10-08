/*
   Chargé dans le <head> de toutes les pages.
   - apparition des blocs .reveal au défilement
   - menu mobile
   - mode capot (bouton </> : le site montre sa structure et ses mesures)
   - heure de Paris, année, bouton "copier l'adresse"
*/

var html = document.documentElement;
html.classList.add("js");

// on garde le mode capot d'une page à l'autre (le temps de la visite)
try {
    if (sessionStorage.getItem("capot") === "1") html.classList.add("capot");
} catch (e) {}

var mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Apparition au défilement ---------- */

function reveler(elements) {
    if (mouvementReduit || !("IntersectionObserver" in window)) {
        elements.forEach(function (el) { el.classList.add("in"); });
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                e.target.classList.add("in");
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    elements.forEach(function (el) { io.observe(el); });
}

/* ---------- Défilement : petite aide pour les effets liés au scroll ---------- */

var effetsDefilement = [];

function surDefilement(fonction) {
    effetsDefilement.push(fonction);
}

(function () {
    var enAttente = false;
    function maj() {
        enAttente = false;
        effetsDefilement.forEach(function (f) { f(); });
    }
    function demander() {
        if (!enAttente) {
            enAttente = true;
            requestAnimationFrame(maj);
        }
    }
    window.addEventListener("scroll", demander, { passive: true });
    window.addEventListener("resize", demander);
    window.addEventListener("load", demander);
    document.addEventListener("DOMContentLoaded", demander);
})();

// 0 quand le haut de l'élément est à `depart` (fraction de l'écran), 1 à `arrivee`
function progression(el, depart, arrivee) {
    var r = el.getBoundingClientRect();
    var h = window.innerHeight;
    var p = (h * depart - r.top) / (h * (depart - arrivee));
    return Math.min(Math.max(p, 0), 1);
}

/* ---------- Mode capot ---------- */

function decrire(el) {
    var nom = el.tagName.toLowerCase();
    if (el.id) nom += "#" + el.id;
    var classes = [].filter.call(el.classList, function (c) {
        return c !== "reveal" && c !== "in";
    });
    if (classes.length) nom += "." + classes.slice(0, 2).join(".");
    var r = el.getBoundingClientRect();
    return nom + "  " + Math.round(r.width) + " × " + Math.round(r.height);
}

function etiqueter() {
    document.querySelectorAll("[data-capot]").forEach(function (el) {
        el.setAttribute("data-capot-info", decrire(el));
    });
}

function octets(n) {
    return n > 1024 * 1024
        ? (n / 1024 / 1024).toFixed(2).replace(".", ",") + " Mo"
        : Math.round(n / 1024) + " Ko";
}

function mesurer() {
    var nav = performance.getEntriesByType("navigation")[0];
    var ressources = performance.getEntriesByType("resource");
    var poids = ressources.reduce(function (total, r) {
        return total + (r.transferSize || r.encodedBodySize || 0);
    }, nav ? (nav.transferSize || nav.encodedBodySize || 0) : 0);

    var css = 0, js = 0;
    ressources.forEach(function (r) {
        if (/\.css(\?|$)/.test(r.name)) css++;
        if (/\.js(\?|$)/.test(r.name)) js++;
    });

    return {
        poids: poids ? octets(poids) : "?",
        requetes: ressources.length + 1,
        fichiers: css + " CSS · " + js + " JS",
        elements: document.getElementsByTagName("*").length,
        chargement: nav && nav.domContentLoadedEventEnd
            ? Math.round(nav.domContentLoadedEventEnd) + " ms"
            : "?",
        ecran: window.innerWidth + " × " + window.innerHeight,
        cookies: document.cookie ? document.cookie.split(";").length : 0
    };
}

function remplirPanneau() {
    var m = mesurer();
    document.querySelectorAll("[data-mesure]").forEach(function (dd) {
        dd.textContent = m[dd.getAttribute("data-mesure")];
    });
}

function creerPanneau() {
    var panneau = document.createElement("aside");
    panneau.className = "capot-panneau";
    panneau.setAttribute("aria-label", "Mesures de la page");
    panneau.innerHTML =
        '<p class="capot-titre"><span>Capot ouvert</span><button type="button" data-capot-toggle aria-label="Fermer le capot">×</button></p>' +
        "<dl>" +
            '<dt>Poids de la page</dt><dd data-mesure="poids"></dd>' +
            '<dt>Requêtes</dt><dd data-mesure="requetes"></dd>' +
            '<dt>Fichiers</dt><dd data-mesure="fichiers"></dd>' +
            '<dt>Éléments HTML</dt><dd data-mesure="elements"></dd>' +
            '<dt>Page prête en</dt><dd data-mesure="chargement"></dd>' +
            '<dt>Fenêtre</dt><dd data-mesure="ecran"></dd>' +
            '<dt>Framework</dt><dd>aucun</dd>' +
            '<dt>Cookies</dt><dd data-mesure="cookies"></dd>' +
        "</dl>" +
        "<p class=\"capot-note\">Ce sont les vraies mesures de cette page, prises par votre navigateur. Échap pour refermer.</p>";
    document.body.appendChild(panneau);
}

function basculerCapot(force) {
    var actif = typeof force === "boolean" ? force : !html.classList.contains("capot");
    html.classList.toggle("capot", actif);
    try { sessionStorage.setItem("capot", actif ? "1" : "0"); } catch (e) {}

    document.querySelectorAll("[data-capot-toggle]").forEach(function (b) {
        b.setAttribute("aria-pressed", actif);
    });
    if (actif) {
        etiqueter();
        remplirPanneau();
    }
}

/* ---------- Menu mobile ---------- */

function fermerMenu() {
    html.classList.remove("menu-ouvert");
    var burger = document.querySelector(".burger");
    if (burger) burger.setAttribute("aria-expanded", "false");
}

/* ---------- Copier dans le presse-papiers ----------
   navigator.clipboard n'existe qu'en HTTPS (ou sur localhost) :
   sinon on passe par une zone de texte cachée. */

function copier(texte) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(texte);
    }
    return new Promise(function (ok, echec) {
        var zone = document.createElement("textarea");
        zone.value = texte;
        zone.setAttribute("readonly", "");
        zone.style.position = "fixed";
        zone.style.opacity = "0";
        document.body.appendChild(zone);
        zone.select();
        try {
            if (document.execCommand("copy")) ok(); else echec();
        } catch (e) {
            echec(e);
        }
        zone.remove();
    });
}

/* ---------- Pied de page ---------- */

function heureParis() {
    return new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Paris"
    });
}

/* ---------- Au chargement ---------- */

document.addEventListener("DOMContentLoaded", function () {
    reveler(document.querySelectorAll(".reveal"));

    // menu mobile
    var burger = document.querySelector(".burger");
    if (burger) {
        burger.addEventListener("click", function () {
            var ouvert = html.classList.toggle("menu-ouvert");
            burger.setAttribute("aria-expanded", ouvert);
        });
    }
    document.querySelectorAll(".nav-liens a").forEach(function (a) {
        a.addEventListener("click", fermerMenu);
    });

    // mode capot
    creerPanneau();
    document.addEventListener("click", function (e) {
        if (e.target.closest("[data-capot-toggle]")) basculerCapot();
    });
    if (html.classList.contains("capot")) basculerCapot(true);

    var attente;
    window.addEventListener("resize", function () {
        clearTimeout(attente);
        attente = setTimeout(function () {
            if (window.innerWidth > 860) fermerMenu();
            if (html.classList.contains("capot")) { etiqueter(); remplirPanneau(); }
        }, 150);
    });
    window.addEventListener("load", function () {
        if (html.classList.contains("capot")) { etiqueter(); remplirPanneau(); }
    });

    // Échap : ferme le menu, puis le capot
    document.addEventListener("keydown", function (e) {
        if (e.key !== "Escape" || document.querySelector("dialog[open]")) return;
        if (html.classList.contains("menu-ouvert")) fermerMenu();
        else if (html.classList.contains("capot")) basculerCapot(false);
    });

    // copier l'adresse mail
    document.querySelectorAll("[data-copier]").forEach(function (bouton) {
        var texte = bouton.textContent;
        bouton.addEventListener("click", function () {
            copier(bouton.getAttribute("data-copier")).then(function () {
                bouton.textContent = "Adresse copiée";
                bouton.classList.add("fait");
            }, function () {
                bouton.textContent = "Copie impossible";
            }).then(function () {
                setTimeout(function () {
                    bouton.textContent = texte;
                    bouton.classList.remove("fait");
                }, 2000);
            });
        });
    });

    // année et heure
    document.querySelectorAll("[data-annee]").forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });
    var heure = document.querySelector("[data-heure]");
    if (heure) {
        heure.textContent = heureParis();
        setInterval(function () { heure.textContent = heureParis(); }, 30000);
    }
});
