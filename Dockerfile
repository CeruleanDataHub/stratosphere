FROM nginx:1.17.9

RUN apt-get update

COPY dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
