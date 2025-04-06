import { ConversationDTO } from "@/lib/dto/message";
import { initials } from "@/lib/dto/user";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { MyUserAvatar } from "../images";
import trim from "@/lib/trim";
import { transformTime } from "@/lib/time";


interface ConversationItemProps {
    conversation: ConversationDTO;
    currentUserId: string;
    onClick: () => void;
    isActive: boolean;
}

export function ConversationItem({
    conversation,
    currentUserId,
    onClick,
    isActive
}: ConversationItemProps) {
    const otherUser = conversation.members.find(member => member.userID !== currentUserId);

    return otherUser && (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer rounded-lg",
                isActive && "bg-muted"
            )}
        >
            <Avatar>
                {otherUser.avatarURL ?
                    <MyUserAvatar src={otherUser.avatarURL} className="w-12 h-12" /> :
                    <AvatarFallback>{initials(otherUser.username)}</AvatarFallback>}
            </Avatar>
            <div className="flex-1 flex min-w-0 items-center space-x-5">
                <h4 className="font-semibold truncate">{otherUser.username}</h4>
                {conversation.lastMessage && <p className="text-sm text-muted-foreground truncate">
                    {trim(conversation.lastMessage.content)}
                </p>}
            </div>
            {conversation.updatedAt && (
                <span className="text-xs text-muted-foreground">
                    {transformTime(conversation.updatedAt)}
                </span>
            )}
        </div>
    );
}