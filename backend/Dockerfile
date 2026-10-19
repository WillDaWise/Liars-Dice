FROM node:22-bookworm

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "start" ]
