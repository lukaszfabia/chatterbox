import { MessageSentEvent } from "../../domain/events/message-send.event";
import { StatusEvent } from "../../domain/events/status.event";
import { IStatusRepository } from "../../domain/repository/status.repository";
import { RabbitMQService } from "../../infrastructure/rabbitmq/rabbitmq";
import { EventHandler } from "./event.handler";

export class MessageSentEventHandler implements EventHandler<MessageSentEvent> {
    constructor(
        private readonly repo: IStatusRepository,
        private readonly rabbitmq: RabbitMQService
    ) { }

    async handle(event: MessageSentEvent): Promise<void> {

        const res = await this.repo.getUserStatus(event.userID)
        let newEvent: StatusEvent
        if (!res) {
            newEvent = new StatusEvent(event.messageID, event.userID, false)
        } else {
            newEvent = new StatusEvent(event.messageID, res.userID, res.isOnline)
        }

        await this.rabbitmq.publish(StatusEvent.name, newEvent)
    }

}