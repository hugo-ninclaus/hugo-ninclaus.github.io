/*
   Chargé dans le <head> de toutes les pages.
   - signale au CSS que JavaScript est actif (classe "js")
   - fait apparaître les blocs .reveal au défilement
   - met l'heure de Paris et l'année dans le pied de page
*/

document.documentElement.classList.add("js");

/* ---------- Apparition au défilement ---------- */

function reveler(elements) {
    var sansAnimation = !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (sansAnimation) {
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
    }, { threshold: 0.15 });

    elements.forEach(function (el) { io.observe(el); });
}

/* ---------- Pied de page ---------- */

function heureParis() {
    return new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Paris"
    });
}

document.addEventListener("DOMContentLoaded", function () {
    reveler(document.querySelectorAll(".reveal"));

    document.querySelectorAll("[data-annee]").forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

    var heure = document.querySelector("[data-heure]");
    if (heure) {
        heure.textContent = heureParis();
        setInterval(function () { heure.textContent = heureParis(); }, 30000);
    }
});
