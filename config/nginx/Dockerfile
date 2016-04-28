FROM nginx

# Using https://github.com/h5bp/server-configs-nginx
ADD server-configs-nginx.tar.gz /etc
RUN rm -rf /etc/nginx
RUN cd /etc && mv server-configs-nginx nginx

ADD sites-enabled /etc/nginx/sites-enabled
