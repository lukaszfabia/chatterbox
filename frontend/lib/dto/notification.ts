import { DTO } from "./model";


export interface Notification extends DTO {
    id: string,
    userID: string,
    sub: string,
    info: string,
    sentAt: string,
    isDelivered: boolean,
}

export function getSorted(notifications: Notification[]): Notification[] {
    return notifications.sort((a, b) => {
        const a1 = new Date(a.sentAt)
        const b1 = new Date(b.sentAt)
        return a1 > b1 ? -1 : 1
    })
}