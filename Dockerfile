FROM node:8.7

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .

#For npm@5 or later, copy package-lock.json as well
COPY package.json package-lock.json ./

RUN npm install

RUN npm i -g yarn

# Bundle app source
COPY . .
