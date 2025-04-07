import { Skeleton } from "@/components/ui/skeleton";
import { initials, User } from "@/lib/dto/user";
import { Avatar } from "@radix-ui/react-avatar";
import { AnimatePresence, motion } from "framer-motion";
import { MyUserAvatar } from "../images";

function UserAvatar({ user, isOnline, isLoading = false }: { user?: User | null; isOnline: boolean; isLoading?: boolean }) {
    return (
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
                <Avatar>
                    <AnimatePresence mode="wait">
                        {isLoading || !user ? (
                            <motion.div
                                key="skeleton"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                            >
                                <Skeleton className="rounded-full w-32 h-32 border-4 border-background" />
                            </motion.div>
                        ) : <MyUserAvatar src={user.avatarURL} placeholder={initials(user.username, user.firstName, user.lastName)} size="w-32 h-32" />
                        }
                    </AnimatePresence>
                </Avatar>

                {!isLoading && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        className={`absolute bottom-2 right-2 w-4 h-4 ${isOnline ? "bg-green-500" : "bg-muted-foreground"} rounded-full border-2 border-background`}
                    />
                )}
            </div>
        </div>
    );
}


export default UserAvatar;