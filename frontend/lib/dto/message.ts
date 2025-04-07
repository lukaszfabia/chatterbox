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
    updatedAt: string,
}


export function getConversation(id: string, conversations: ConversationDTO[]): ConversationDTO | null {
    return conversations.find((v) => id === v.id) ?? null;
}

export function sortConversations(conversations: ConversationDTO[]): ConversationDTO[] {
    return conversations.sort((lhs, rhs) => {
        const d1 = new Date(lhs.updatedAt)
        const d2 = new Date(rhs.updatedAt)
        return d1.getTime() > d2.getTime() ? -1 : 1
    })
}
