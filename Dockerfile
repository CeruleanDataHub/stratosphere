FROM --platform=$TARGETPLATFORM nginx:latest

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
RUN apt update \
    && apt install gettext -y \
    && rm -rf /var/lib/apt/lists/*
COPY nginx-entrypoint.sh /
COPY dist ./

## add permissions for nginx user
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    chown -R nginx:nginx /nginx-entrypoint.sh && \
    chown -R nginx:nginx /usr/share/nginx/html
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 8008

ENTRYPOINT ["sh", "/nginx-entrypoint.sh"]
