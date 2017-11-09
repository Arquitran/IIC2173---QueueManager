FROM node:8.7

WORKDIR /usr/src/app
COPY . .

RUN yarn

EXPOSE 3000
