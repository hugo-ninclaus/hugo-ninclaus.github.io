/*
   Couvertures des projets.

   Un projet peut avoir pour couverture :
     - une image : couverture: { image: "assets/img/projets/x.jpg" }
     - un dessin de ce fichier : couverture: "parking" (le nom d'une
       fonction ci-dessous)

   Les dessins sont en SVG, avec les couleurs du site (variables CSS).
   Leurs styles et animations
   sont dans assets/css/couvertures.css (préfixe "cv-").
*/

var COUVERTURES = {

    /* ---------- Projet fil rouge : le parking vu de dessus ---------- */

    parking: function () {
        var places = "";
        var occupees = [0, 1, 3];   // la place 2 est libre

        for (var i = 0; i < 4; i++) {
            var x = 170 + i * 105;
            var cx = x + 52.5;
            var libre = occupees.indexOf(i) === -1;

            places += '<rect class="cv-capteur ' + (libre ? "cv-capteur-libre" : "") + '" x="' + (cx - 10) + '" y="54" width="20" height="7" rx="2"/>';

            if (libre) {
                places +=
                    '<rect class="cv-libre" x="' + (x + 8) + '" y="66" width="89" height="104" rx="8"/>' +
                    '<text class="cv-libre-txt" x="' + cx + '" y="124" text-anchor="middle">libre</text>';
            } else {
                places +=
                    '<g class="cv-voiture cv-voiture-' + i + '">' +
                        '<rect x="' + (cx - 34) + '" y="76" width="68" height="94" rx="16"/>' +
                        '<rect class="cv-vitre" x="' + (cx - 26) + '" y="94" width="52" height="20" rx="6"/>' +
                        '<rect class="cv-vitre" x="' + (cx - 24) + '" y="146" width="48" height="12" rx="4"/>' +
                    "</g>";
            }
        }

        // marquages au sol
        var lignes = '<path class="cv-marquage" d="M170 50 H590';
        for (var j = 0; j <= 4; j++) lignes += " M" + (170 + j * 105) + " 50 V176";
        lignes += '"/>';

        // le chemin de LED : le long de l'allée, puis vers la place libre
        var leds = "";
        var points = [];
        for (var k = 0; k < 9; k++) points.push([160 + k * 33, 292]);
        points.push([432, 256], [432, 222], [432, 190]);
        points.forEach(function (pt, n) {
            leds += '<circle class="cv-led-chemin" cx="' + pt[0] + '" cy="' + pt[1] + '" r="5" style="animation-delay:' + (n * 0.12).toFixed(2) + 's"/>';
        });

        return '<svg class="cv cv-parking" viewBox="0 0 640 400" role="img" aria-label="Parking vu de dessus : les LED guident vers la place libre">' +
            '<rect class="cv-sol" x="30" y="30" width="580" height="340" rx="22"/>' +
            lignes +
            '<path class="cv-axe" d="M170 262 H590"/>' +
            places +

            // entrée : écran LCD et barrière
            '<rect class="cv-lcd" x="50" y="56" width="84" height="46" rx="6"/>' +
            '<text class="cv-lcd-txt" x="92" y="75" text-anchor="middle">LIBRES</text>' +
            '<text class="cv-lcd-txt cv-lcd-grand" x="92" y="94" text-anchor="middle">1/4</text>' +
            '<line class="cv-barriere" x1="128" y1="310" x2="128" y2="232"/>' +
            '<circle class="cv-poteau" cx="128" cy="310" r="6"/>' +

            leds +

            '<text class="cv-annot" x="56" y="352">entrée</text>' +
            '<text class="cv-annot" x="160" y="330">guidage par LED</text>' +
            '<text class="cv-annot" x="486" y="196">capteurs ↑</text>' +
        "</svg>";
    },

    /* ---------- Miniserveur : la tour, la box et internet ---------- */

    serveur: function () {
        var grille = "";
        for (var y = 236; y <= 308; y += 12) grille += "M290 " + y + " H370 ";

        return '<svg class="cv cv-serveur" viewBox="0 0 640 400" role="img" aria-label="Un PC de bureau devenu serveur, relié à la box">' +
            '<ellipse class="cv-ombre" cx="330" cy="352" rx="120" ry="10"/>' +

            // internet -> box -> serveur
            '<circle class="cv-boite" cx="135" cy="128" r="30"/>' +
            '<text class="cv-txt-petit" x="135" y="132" text-anchor="middle">web</text>' +
            '<path class="cv-vie" d="M135 158 V276"/>' +
            '<circle class="cv-paquet cv-descend" cx="135" cy="160" r="4"/>' +
            '<rect class="cv-boite" x="70" y="276" width="130" height="48" rx="12"/>' +
            '<text class="cv-txt-petit" x="100" y="305">box</text>' +
            '<circle class="cv-led-box" cx="160" cy="300" r="3"/>' +
            '<circle class="cv-led-box cv-led-box-2" cx="172" cy="300" r="3"/>' +
            '<circle class="cv-led-box cv-led-box-3" cx="184" cy="300" r="3"/>' +
            '<path class="cv-cable" d="M200 300 H255"/>' +
            '<circle class="cv-paquet cv-va" cx="200" cy="300" r="4"/>' +

            // la tour
            '<rect class="cv-boitier" x="255" y="50" width="150" height="296" rx="16"/>' +
            '<rect class="cv-facade" x="270" y="66" width="120" height="264" rx="10"/>' +
            '<rect class="cv-baie" x="284" y="86" width="92" height="16" rx="4"/>' +
            '<rect class="cv-baie" x="284" y="110" width="92" height="16" rx="4"/>' +
            '<circle class="cv-bouton" cx="330" cy="168" r="15"/>' +
            '<path class="cv-icone" d="M330 159 V167 M323.5 163.5 A9 9 0 1 0 336.5 163.5"/>' +
            '<circle class="cv-led-alim" cx="312" cy="202" r="4"/>' +
            '<circle class="cv-led-act" cx="330" cy="202" r="4"/>' +
            '<circle class="cv-led-eteinte" cx="348" cy="202" r="4"/>' +
            '<path class="cv-grille" d="' + grille + '"/>' +

            // annotations
            '<path class="cv-repere" d="M405 94 H448 M405 168 H448 M405 242 H448"/>' +
            '<text class="cv-annot" x="456" y="98">ubuntu server</text>' +
            '<text class="cv-annot" x="456" y="172">ssh · port 22</text>' +
            '<text class="cv-annot" x="456" y="246">nginx · port 80</text>' +
        "</svg>";
    },

    /* ---------- SmartHouse : la maison, le broker MQTT et le site ---------- */

    maison: function () {
        return '<svg class="cv cv-maison" viewBox="0 0 640 400" role="img" aria-label="Une maison connectée envoie ses mesures en MQTT vers un site de suivi">' +
            '<ellipse class="cv-ombre" cx="190" cy="352" rx="150" ry="10"/>' +

            // la maison
            '<path class="cv-sol" d="M50 170 L190 70 L330 170 V340 H50 Z"/>' +
            '<rect class="cv-boite" x="78" y="196" width="104" height="54" rx="10"/>' +
            '<text class="cv-txt-petit" x="130" y="228" text-anchor="middle">BME680</text>' +
            '<rect class="cv-boite" x="204" y="196" width="98" height="54" rx="10"/>' +
            '<circle class="cv-boite" cx="253" cy="223" r="14"/>' +
            '<circle class="cv-paquet" cx="253" cy="223" r="4"/>' +
            '<rect class="cv-boite" x="78" y="272" width="224" height="44" rx="10"/>' +
            '<text class="cv-txt-petit" x="100" y="299">arduino</text>' +
            '<circle class="cv-led-alim" cx="250" cy="294" r="4"/>' +
            '<circle class="cv-led-act" cx="268" cy="294" r="4"/>' +
            '<circle class="cv-led-eteinte" cx="286" cy="294" r="4"/>' +

            // maison -> broker -> site
            '<path class="cv-cable" d="M330 250 H382"/>' +
            '<circle class="cv-paquet cv-va" cx="330" cy="250" r="4"/>' +
            '<rect class="cv-boite" x="382" y="222" width="84" height="56" rx="12"/>' +
            '<text class="cv-txt-petit" x="424" y="255" text-anchor="middle">mqtt</text>' +
            '<path class="cv-cable" d="M466 250 H518"/>' +
            '<circle class="cv-paquet cv-va" cx="466" cy="250" r="4" style="animation-delay:1.2s"/>' +

            // le site de suivi, sur un téléphone
            '<rect class="cv-boitier" x="518" y="120" width="96" height="220" rx="16"/>' +
            '<rect class="cv-facade" x="528" y="136" width="76" height="188" rx="8"/>' +
            '<text class="cv-txt-petit" x="566" y="162" text-anchor="middle">21,4 °C</text>' +
            '<path class="cv-repere" d="M536 250 L552 232 L566 240 L580 214 L596 222"/>' +
            '<rect class="cv-baie" x="538" y="276" width="56" height="12" rx="4"/>' +
            '<rect class="cv-baie" x="538" y="296" width="40" height="12" rx="4"/>' +

            // annotations
            '<text class="cv-annot" x="368" y="208">wi-fi · tls</text>' +
            '<text class="cv-annot" x="520" y="368">flask</text>' +
            '<text class="cv-annot" x="58" y="382">capteurs · caméra · led · buzzer</text>' +
        "</svg>";
    }
};

/* Renvoie le HTML de la couverture d'un projet (dessin ou image). */
function carrosserie(p) {
    var c = p.couverture;

    if (c && c.image) {
        return '<img src="' + c.image + '" alt="' + (c.alt || p.titre) + '" loading="lazy">';
    }
    if (typeof c === "string" && COUVERTURES[c]) {
        return COUVERTURES[c]();
    }
    return '<div class="cv-vide">' + p.titre + "</div>";
}

/* Couverture complète d'un projet : le cadre + le dessin ou l'image. */
function couverture(p) {
    return '<div class="couverture">' +
        '<div class="carrosserie">' + carrosserie(p) + "</div>" +
    "</div>";
}
