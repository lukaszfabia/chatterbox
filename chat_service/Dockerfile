FROM node:20-alpine AS builder

WORKDIR /chat_service

COPY package*.json ./
RUN npm install -g npm@11.2.0
RUN npm install

COPY . .

RUN npm install -g typescript tsx

RUN tsc 

FROM node:20-alpine AS runner

WORKDIR /chat_service

COPY --from=builder /chat_service /chat_service

RUN npm install --only=production

EXPOSE 8005

CMD ["node", "dist/src/app.js"]  
