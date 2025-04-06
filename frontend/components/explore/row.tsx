"use client";

import { initials, User } from "@/lib/dto/user";
import trim from "@/lib/trim";
import { transformTime } from "@/lib/time";
import { Separator } from "@radix-ui/react-separator";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { MyUserAvatar } from "../images";

function UserAvatar({ user, isLoading = false }: { user?: User | null, isLoading?: boolean }) {
    return (
        <Avatar>
            <AnimatePresence mode="wait">
                {isLoading || !user ? (
                    <motion.div
                        key="skeleton"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                    >
                        <Skeleton className="rounded-full w-20 h-20 border-4 border-background" />
                    </motion.div>
                ) : user.avatarURL && user.avatarURL.length != 0 ? (
                    <motion.div
                        key="avatar"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <MyUserAvatar src={user.avatarURL} className="w-20 h-20" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="fallback"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="rounded-full w-20 h-20 border-4 border-background bg-gray-200 flex items-center justify-center"
                    >
                        <AvatarFallback className="text-2xl font-semibold">
                            {initials(user.username, user.firstName, user.lastName)}
                        </AvatarFallback>
                    </motion.div>
                )}
            </AnimatePresence>
        </Avatar>
    )
}



export default function UserRow({ user }: { user: User }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="my-3"
        >
            <Link href={`/profile/${user.id}`} className="block">
                <div className="bg-slate-100 dark:bg-slate-900 w-full rounded-xl shadow-sm p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div className="flex space-x-4 items-center">
                            <UserAvatar user={user} />

                            <Separator orientation="vertical" className="h-8" />

                            <div className="space-y-1">
                                <motion.h1
                                    className="font-semibold text-lg"
                                    whileHover={{ x: 2 }}
                                >
                                    {user.username}
                                </motion.h1>
                                {user.bio && (
                                    <motion.p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                        {trim(user.bio)}
                                    </motion.p>
                                )}
                                <motion.p
                                    className="text-xs text-muted-foreground"
                                    initial={{ opacity: 0.8 }}
                                    whileHover={{ opacity: 1 }}
                                >
                                    Joined {transformTime(user.createdAt)}
                                </motion.p>
                            </div>
                        </div>

                        <motion.div
                            whileHover={{ x: 2 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <ChevronRight className="text-gray-400" />
                        </motion.div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}