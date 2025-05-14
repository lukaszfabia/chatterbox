FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@11.2.0
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 8004

CMD ["node", "dist/src/app.js"]
