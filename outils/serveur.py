"""
Petit serveur local pour tester le site.

    python3 outils/serveur.py          ->  http://localhost:8000
    python3 outils/serveur.py 8080     ->  autre port

Contrairement à "python3 -m http.server", il dit au navigateur de ne rien
garder en cache : chaque modification est visible au rechargement.
"""

import functools
import http.server
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
DOSSIER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "site")


class SansCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


gestionnaire = functools.partial(SansCache, directory=DOSSIER)

with http.server.ThreadingHTTPServer(("", PORT), gestionnaire) as serveur:
    print(f"Site servi sur http://localhost:{PORT}  (Ctrl+C pour arrêter)")
    serveur.serve_forever()
