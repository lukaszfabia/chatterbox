FROM node:latest

WORKDIR /status_service

COPY package*.json /status_service/

RUN npm install -g npm@11.2.0
RUN npm install

COPY . /status_service

RUN npm install -g typescript tsx

EXPOSE 8004

CMD ["npx", "tsx", "src/app.ts"]
