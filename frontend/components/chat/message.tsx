import { MessageDTO, DenormalizedUser } from "@/lib/dto/message";
import { cn } from "@/lib/utils";
import { Avatar } from "@radix-ui/react-avatar";
import { MyUserAvatar } from "../images";
import { initials } from "@/lib/dto/user";

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
                    <MyUserAvatar src={sender.avatarURL} placeholder={initials(sender.username)} size="w-10 h-10" />
                </Avatar>
            )}

            <div className={cn(
                "rounded-lg px-4 py-2 max-w-md",
                isCurrentUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
            )}>
                <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
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