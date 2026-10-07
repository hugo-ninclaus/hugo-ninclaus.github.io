# Image du portfolio : nginx qui sert le dossier site/.
#
#   docker build -t portfolio .
#   docker run --rm -p 8080:80 portfolio      ->  http://localhost:8080
#
# (ou plus simple : docker compose up --build)

FROM nginx:stable-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY site/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/sante || exit 1
