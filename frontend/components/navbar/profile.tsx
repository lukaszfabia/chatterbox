"use client";

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { initials, User } from "@/lib/models/user";
import { AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import trim from '@/lib/trim';
import { LogOutIcon, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

const AvatarWithSkeleton = ({ user }: { user: User }) => {
    return user && (
        <div className="relative">
            <Avatar>
                <AnimatePresence mode="wait">
                    {user.avatarURL ?
                        <AvatarImage
                            src={user.avatarURL}
                            alt={`${user.username}'s avatar`}
                            className="rounded-full w-8 h-8 border-4 border-background object-cover"
                        /> :
                        <AvatarFallback className="text-xs font-semibold">
                            {initials(user.username, user.firstName, user.lastName)}
                        </AvatarFallback>
                    }
                </AnimatePresence>
            </Avatar>
        </div>
    );
};

const AvatarWithActions = ({ user }: { user: User }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger><AvatarWithSkeleton user={user} /></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Link href={`/profile/${user.id}`}>{trim(user.username)}</Link></DropdownMenuItem>
                <DropdownMenuItem><Pencil /><Link href="#">Edit</Link></DropdownMenuItem>
                <DropdownMenuItem><LogOutIcon /> <button>Log out</button></DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )

}

export default AvatarWithActions;

