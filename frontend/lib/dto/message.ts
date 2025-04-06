import { DTO } from "./model"


export interface DenormalizedUser {
    userID: string,
    username: string,
    avatarURL?: string | null,
}


export interface MessageDTO extends DTO {
    id?: string | null,
    senderID: string,
    receiverID: string,
    content: string,
    sentAt: number,
    chatID: string,
    status?: string | null
}

export interface ConversationDTO extends DTO {
    id: string,
    members: DenormalizedUser[],
    lastMessage?: MessageDTO,
    updatedAt?: string,
}

