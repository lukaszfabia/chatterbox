swam:
	@docker swarm init
	@docker stack deploy -c docker-compose.yml chatterbox

add:
	@docker service scale chatterbox_status_service=4

remove:
	@docker stack rm chatterbox
	@docker swarm leave --force