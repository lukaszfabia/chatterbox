FROM golang:1.24.1-bookworm AS builder

WORKDIR /build

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o profile_serivce ./cmd/main

FROM alpine:latest AS run

RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY --from=builder /build/profile_serivce .

RUN chmod +x ./profile_serivce

CMD ["./profile_serivce"]