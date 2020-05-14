FROM node:lts-slim

# setup env
WORKDIR /bot
COPY package.json .
COPY package-lock.json .
RUN npm install

ADD . /bot

RUN npm run build


CMD [ "npm", "start" ]