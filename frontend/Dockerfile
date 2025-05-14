FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production --frozen-lockfile

COPY --from=builder /app/.next .next

COPY --from=builder /app/public /app/public

EXPOSE 3000

CMD ["npm", "start"]
