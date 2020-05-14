FROM node:10.13.0-alpine

# setup env
WORKDIR /bot
COPY package.json .
COPY package-lock.json .
RUN npm install

ADD . /bot

RUN npm run build


CMD [ "npm", "start" ]