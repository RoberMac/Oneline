FROM node:6.0.0

RUN mkdir -p /app/Oneline

WORKDIR /app/Oneline

EXPOSE 3000

CMD npm start