"use client";

import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type UserAvatarProps = {
    placeholder: string;
    src?: string | null;
    alt?: string;
    size?: string;
};
export const host = process.env.NEXT_PUBLIC_PROFILE_SERVICE_HOST!

export function MyUserAvatar({ src, placeholder, alt = "User avatar", size }: UserAvatarProps) {
    if (src) {
        return (
            <motion.div
                key="avatar"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <AvatarImage
                    src={`http://${host}/${src}`}
                    alt={alt}
                    className={cn("rounded-full border-4 border-background object-cover", size)}
                />
            </motion.div>
        )
    }

    return (
        <motion.div
            key="fallback"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn("rounded-full border-4 border-background bg-gray-200 dark:bg-gray-800 flex items-center justify-center", size)}
        >
            <AvatarFallback className="md:text-lg font-semibold">
                {placeholder}
            </AvatarFallback>
        </motion.div>
    )
}