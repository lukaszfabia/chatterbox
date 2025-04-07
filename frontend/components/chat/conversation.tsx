import { ConversationDTO, DenormalizedUser } from "@/lib/dto/message";
import { initials } from "@/lib/dto/user";
import { cn } from "@/lib/utils";
import { Avatar } from "@radix-ui/react-avatar";
import { MyUserAvatar } from "../images";
import trim from "@/lib/trim";
import { transformTime } from "@/lib/time";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationItemProps {
    conversation: ConversationDTO;
    onClick: () => void;
    isActive: boolean;
    user?: DenormalizedUser | null;
}

export function ConversationItem({
    conversation,
    onClick,
    isActive,
    user
}: ConversationItemProps) {
    const otherUser = conversation.members.find(member => member.userID !== user?.userID);

    if (!otherUser) {
        return (
            <div
                onClick={onClick}
                className={cn(
                    "flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer rounded-lg",
                    isActive && "bg-muted"
                )}
            >
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 flex min-w-0 items-center space-x-5">
                    <Skeleton className="w-32 h-5" />
                    <Skeleton className="w-20 h-4" />
                </div>
                <Skeleton className="w-16 h-3" />
            </div>
        );
    }

    return otherUser && (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer rounded-lg",
                isActive && "bg-muted"
            )}
        >
            <Avatar>
                <MyUserAvatar src={otherUser.avatarURL} placeholder={initials(otherUser.username)} size="w-12 h-12" />
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
