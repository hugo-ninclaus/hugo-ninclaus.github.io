/*
   Chargé dans le <head> de toutes les pages.
   - apparition des blocs .reveal au défilement
   - menu mobile
   - heure de Paris, année, bouton "copier l'adresse"
*/

var html = document.documentElement;
html.classList.add("js");

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

    // le menu se ferme si on agrandit la fenêtre, ou avec Échap
    var attente;
    window.addEventListener("resize", function () {
        clearTimeout(attente);
        attente = setTimeout(function () {
            if (window.innerWidth > 860) fermerMenu();
        }, 150);
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !document.querySelector("dialog[open]")) fermerMenu();
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
