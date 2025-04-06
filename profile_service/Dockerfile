FROM golang:1.24-bookworm AS builder 

WORKDIR /build

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /go/bin/profile_service ./cmd/api/main.go

FROM alpine:latest AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY --from=builder /go/bin/profile_service .

COPY media /app/media

RUN chmod +x ./profile_service

EXPOSE 8002 

CMD ["./profile_service"]