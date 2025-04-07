FROM node:latest

WORKDIR /chat_service

COPY package*.json /chat_service/.

RUN npm install -g npm@11.2.0
RUN npm install

COPY . /chat_service

RUN npm install -g typescript tsx

EXPOSE 8005

CMD ["npx", "tsx", "src/app.ts"]