FROM golang:1.24-bookworm AS builder 

WORKDIR /build

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /go/bin/notification_service ./cmd/api/main.go

FROM alpine:latest AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY --from=builder /go/bin/notification_service .

RUN chmod +x ./notification_service

COPY ./templates/ /app/templates/

EXPOSE 8003 

CMD ["./notification_service"]