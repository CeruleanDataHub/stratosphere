FROM nginx:1.17.9-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
RUN apk add --no-cache gettext
COPY nginx-entrypoint.sh /
COPY dist ./

ENTRYPOINT ["sh", "/nginx-entrypoint.sh"]
