FROM nodesource/centos7:6.0.0

RUN mkdir -p /app

ADD config/proxychains/proxychains* /etc/
RUN cd /etc/proxychains-ng \
    && ./configure --prefix=/usr --sysconfdir=/etc \
    && make \
    && make install \
    && make install-config \
    && rm -rf /etc/proxychains-ng

WORKDIR /app

EXPOSE 3000

CMD proxychains4 npm start
