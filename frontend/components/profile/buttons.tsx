import { motion } from "framer-motion"
import { Skeleton } from "../ui/skeleton"
import { Pencil } from "lucide-react"
import { Button } from "../ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation";
import { denormalizeUser, User } from "@/lib/dto/user"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { ConversationDTO } from "@/lib/dto/message"

export default function ActionButtons({ isMe, isLoading, user, currentProfile }: { isMe: boolean, user?: User | null, isLoading?: boolean, currentProfile?: User | null }) {
    const router = useRouter();


    const initConversation = async (sender: User, receiver: User) => {
        const body = {
            members: [receiver, sender].map((user) => denormalizeUser(user)),
        };

        const conversation = await api<ConversationDTO>({
            service: 'chat',
            apiVersion: 'api/v1',
            endpoint: '/chat/new/chat',
            method: 'POST',
            body: body,
        });

        if (conversation) {
            return conversation;
        }
        return null;
    };


    const handleNewConv = async () => {
        if (user && currentProfile) {
            const chat = await initConversation(currentProfile, user);
            if (chat) {
                router.push("/chat")
            } else {
                toast("Oops!", {
                    description: "Failed to create/fetch chat",
                    action: {
                        label: "Ok",
                        onClick: () => { },
                    },
                });
            }
        }
    };


    if (isLoading || !user) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <Skeleton className="w-full h-10 mt-4 rounded-md" />
            </motion.div>
        )
    }

    return (
        <motion.div
            className="w-full mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            {isMe ? (
                <Button className="w-full cursor-pointer" variant="outline" onClick={() => { router.push(`/profile/${user.id}/edit`) }}>
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                </Button>
            ) : (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="w-full" variant="outline">
                            <Pencil className="h-4 w-4" />
                            Send
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Do you want to create new chat or continue chatting with {user.username}?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Click <b>Continue</b> to go to page with chat.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleNewConv}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </motion.div>
    )
}
