export class MessageDTO {
    constructor(
        public readonly id: string,
        public readonly senderID: string,
        public readonly receiverID: string,
        public readonly content: string,
        public readonly sentAt: number,
        public readonly chatID: string,
        public readonly status: string
    ) { }

    static fromMongoDocument(doc: any): MessageDTO {
        return new MessageDTO(
            doc._id.toString(),
            doc.senderID,
            doc.content,
            doc.sentAt,
            doc.chatID,
            doc.status,
            doc.receiverID,
        );
    }
}
