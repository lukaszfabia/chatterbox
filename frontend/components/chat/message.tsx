import { MessageDTO, DenormalizedUser } from "@/lib/dto/message";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { MyUserAvatar } from "../images";

interface MessageProps {
    message: MessageDTO;
    sender: DenormalizedUser;
    isCurrentUser: boolean;
}

export function Message({ message, sender, isCurrentUser }: MessageProps) {
    return (
        <div className={cn(
            "flex gap-3 items-end",
            isCurrentUser ? "justify-end" : "justify-start"
        )}>
            {!isCurrentUser && (
                <Avatar>
                    {sender?.avatarURL ?
                        <MyUserAvatar src={sender.avatarURL} className="w-10 h-10" /> :
                        <AvatarFallback>{sender.username[0]}</AvatarFallback>
                    }
                </Avatar>
            )}

            <div className={cn(
                "rounded-lg px-4 py-2 max-w-xs",
                isCurrentUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
            )}>
                <p className="text-sm">{message.content}</p>
                <p className={cn(
                    "text-xs mt-1",
                    isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                    {new Date(message.sentAt).toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
}