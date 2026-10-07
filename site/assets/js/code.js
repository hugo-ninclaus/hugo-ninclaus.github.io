/*
   Affichage du code "sous le capot" : une petite fenêtre d'éditeur
   avec une coloration syntaxique simple (couleurs dans base.css).
*/

var MOTS_CLES = {
    c:  "int char void long if else for while return const struct sizeof NULL static unsigned",
    js: "const let var function return async await for of if else try catch new class import export",
    py: "def class return if elif else for while in not and or None True False self import from with as try except"
};

function echapper(texte) {
    return texte.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function span(classe, texte) {
    return '<span class="' + classe + '">' + texte + "</span>";
}

/* ---------- Langages "programmation" : c, js, py ---------- */

function colorerCode(code, langage) {
    var commentaire = langage === "py"
        ? /"""[\s\S]*?"""|#.*/.source
        : /\/\/.*|\/\*[\s\S]*?\*\//.source;
    var chaine = /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`/.source;
    var nombre = /\b\d+(?:\.\d+)?\b/.source;
    var mots = MOTS_CLES[langage] ? "\\b(?:" + MOTS_CLES[langage].split(" ").join("|") + ")\\b" : "(?!)";

    var motif = new RegExp("(" + commentaire + ")|(" + chaine + ")|(" + nombre + ")|(" + mots + ")", "g");
    var sortie = "";
    var dernier = 0;
    var m;

    while ((m = motif.exec(code))) {
        sortie += echapper(code.slice(dernier, m.index));
        var classe = m[1] ? "co" : m[2] ? "st" : m[3] ? "nb" : "mc";
        sortie += span(classe, echapper(m[0]));
        dernier = motif.lastIndex;
    }
    return sortie + echapper(code.slice(dernier));
}

/* ---------- HTML ---------- */

function colorerHtml(code) {
    return echapper(code).replace(
        /(&lt;\/?[\w-]+)|(\/?&gt;)|("[^"]*")|(\s[\w-]+)(?==)/g,
        function (tout, balise, fin, chaine, attribut) {
            if (balise || fin) return span("tg", tout);
            if (chaine) return span("st", tout);
            return span("at", tout);
        }
    );
}

/* ---------- Terminal : "$ commande" / sortie ---------- */

function colorerShell(code) {
    return code.split("\n").map(function (ligne) {
        var m = ligne.match(/^(\$|[\w.-]+@[\w.-]+:[^$]*\$|sftp>)(.*)$/);
        if (m) return span("pr", echapper(m[1])) + echapper(m[2]);
        return span("so", echapper(ligne));
    }).join("\n");
}

/* ---------- Texte libre : # commentaire, → résultat ---------- */

function colorerTexte(code) {
    return code.split("\n").map(function (ligne) {
        if (/^\s*#/.test(ligne)) return span("co", echapper(ligne));
        if (/^\s*→/.test(ligne)) return span("pr", echapper(ligne));
        return echapper(ligne).replace(/^(\d+ ×)/, function (n) { return span("nb", n); });
    }).join("\n");
}

function colorer(code, langage) {
    if (langage === "html") return colorerHtml(code);
    if (langage === "sh") return colorerShell(code);
    if (langage === "texte") return colorerTexte(code);
    return colorerCode(code, langage);
}

/* Fenêtre d'éditeur complète. */
function fenetreCode(capot) {
    return '<div class="code-fenetre">' +
        '<div class="code-barre"><i></i><i></i><i></i><span>' + capot.fichier + "</span></div>" +
        '<pre class="code"><code>' + colorer(capot.code, capot.langage) + "</code></pre>" +
    "</div>";
}

/* Couverture complète d'un projet : dessin/image + capot + bouton. */
function couvertureComplete(p) {
    var capot = p.capot
        ? '<div class="capot" aria-hidden="true">' + fenetreCode(p.capot) + "</div>" +
          '<button class="btn-code" type="button" aria-pressed="false">' +
              '<span class="ouvrir">&lt;/&gt; Sous le capot</span><span class="fermer">Fermer</span>' +
          "</button>"
        : "";

    return '<div class="couverture">' +
        '<div class="carrosserie">' + carrosserie(p) + "</div>" +
        capot +
    "</div>";
}

/* Le bouton "Sous le capot" ouvre/ferme la couverture qui le contient. */
document.addEventListener("click", function (e) {
    var bouton = e.target.closest(".btn-code");
    if (!bouton) return;
    var couverture = bouton.closest(".couverture");
    var ouvert = couverture.classList.toggle("ouvert");
    bouton.setAttribute("aria-pressed", ouvert);
    couverture.querySelector(".capot").setAttribute("aria-hidden", !ouvert);
});
