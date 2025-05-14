"use client";

import { Avatar, } from '../ui/avatar';
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import { useState } from 'react';
import { useNotification } from '@/context/notification-context';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { transformTime } from '@/lib/time';
import { getSorted } from '@/lib/dto/notification';

const AvatarWithSkeleton = ({ user }: { user: User }) => {
    return user && (
        <div className="relative">
            <Avatar>
                <AnimatePresence mode="wait">
                    <MyUserAvatar src={user.avatarURL} size="w-10 h-10" placeholder={initials(user.username, user.firstName, user.lastName)} />
                </AnimatePresence>
            </Avatar>
        </div>
    );
};

const AvatarWithActions = ({ user, logout }: { user: User, logout: () => void }) => {
    const [openSheet, setOpenSheet] = useState(false);
    const { notifications } = useNotification();

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

                    <ScrollArea className="flex-1 overflow-y-auto pr-2">
                        <div className="space-y-4 mt-4">
                            {notifications ? (
                                getSorted(notifications).map((notification) => (
                                    <div className="p-4 hover:bg-accent transition-colors duration-200 cursor-pointer" key={notification.id}>
                                        <h1 className="font-semibold">{notification.sub}</h1>
                                        <p>{notification.info}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {transformTime(notification.sentAt)}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                [...Array(3)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="p-4"
                                    >
                                        <Skeleton className="h-5 w-3/4 mb-2" />
                                        <Skeleton className="h-4 w-full mb-1" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </>
    );
};

export default AvatarWithActions;

