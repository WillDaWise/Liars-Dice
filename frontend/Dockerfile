FROM node:22-bookworm

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5004

CMD [ "npm", "run", "dev" ]
