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
import { MyUserAvatar } from '../images';

const AvatarWithSkeleton = ({ user }: { user: User }) => {
    return user && (
        <div className="relative">
            <Avatar>
                <AnimatePresence mode="wait">
                    {user.avatarURL ?
                        <MyUserAvatar src={user.avatarURL} className="w-8 h-8" /> :
                        <AvatarFallback className="text-xs font-semibold">
                            {initials(user.username, user.firstName, user.lastName)}
                        </AvatarFallback>
                    }
                </AnimatePresence>
            </Avatar>
        </div>
    );
};

const AvatarWithActions = ({ user, logout }: { user: User, logout: () => void }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger><AvatarWithSkeleton user={user} /></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Link href={`/profile/${user.id}`}>{trim(user.username)}</Link></DropdownMenuItem>
                <DropdownMenuItem><Pencil /><Link href={`/profile/${user.id}/edit`}>Edit</Link></DropdownMenuItem>
                <DropdownMenuItem><LogOutIcon /> <button onClick={logout}>Log out</button></DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )

}

export default AvatarWithActions;

