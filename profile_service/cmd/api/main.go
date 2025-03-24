package main

func main() {

	// repo := repository.New()
	// router := mux.NewRouter()

	// server := api.NewServer(repo, router)

	// done := make(chan bool, 1)

	// go func() {
	// 	server.StartAndListen()
	// }()

	// go func() {
	// 	rabbit, err := rabbitmq.NewRabbitMQConnection()
	// 	if err != nil {
	// 		panic("Failed to connect with queue")
	// 	}

	// 	defer rabbit.Close()

	// 	handler := application.NewEventHandler(rabbit, server.GetProfileRepo())

	// 	handler.StartListen()

	// }()

	// go func() {
	// 	server.GracefulShutdown(done)
	// }()

	// <-done
}
