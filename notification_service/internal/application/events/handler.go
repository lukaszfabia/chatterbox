package events

type EventHandler interface {
	Handle(body []byte) error
}
