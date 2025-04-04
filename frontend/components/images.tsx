"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
    src: string;
    alt?: string;
    className?: string;
};
export const host = process.env.NEXT_PUBLIC_PROFILE_SERVICE_HOST!

export function MyUserAvatar({ src, alt = "User avatar", className }: UserAvatarProps) {
    return (
        <AvatarImage
            src={`http://${host}/${src}`}
            alt={alt}
            className={cn("rounded-full border-4 border-background object-cover", className)}
        />
    );
}