FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
RUN apk add --no-cache gettext
COPY nginx-entrypoint.sh /
COPY dist ./

ENTRYPOINT ["sh", "/nginx-entrypoint.sh"]
