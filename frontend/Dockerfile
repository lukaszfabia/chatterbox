FROM node:latest

WORKDIR /frontend

COPY package*.json /frontend/

RUN npm install -g npm@11.2.0

RUN npm install

COPY . /frontend

EXPOSE 3000

CMD ["npm", "run", "dev"]
