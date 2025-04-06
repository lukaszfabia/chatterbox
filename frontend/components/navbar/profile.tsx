"use client";

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { initials, User } from "@/lib/dto/user";
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
import { Calendar, LogOutIcon, Pencil } from 'lucide-react';
import Link from 'next/link';
import { MyUserAvatar } from '../images';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { useState } from 'react';

const AvatarWithSkeleton = ({ user }: { user: User }) => {
    return user && (
        <div className="relative">
            <Avatar>
                <AnimatePresence mode="wait">
                    {user.avatarURL && user.avatarURL.length > 0 ?
                        <MyUserAvatar src={user.avatarURL} className="w-10 h-10" /> :
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
    const [openSheet, setOpenSheet] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <AvatarWithSkeleton user={user} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link href={`/profile/${user.id}`}>{trim(user.username)}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenSheet(true)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Notifications
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        <Link href={`/profile/${user.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        <button onClick={logout}>Log out</button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle className='text-3xl'>Notifications</SheetTitle>
                        <SheetDescription>
                            Here you can find received notifications.
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </>
    )

}

export default AvatarWithActions;

