"use client";

import { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage } from '../ui/avatar';
import Link from 'next/link';

const AvatarWithSkeleton = () => {
    const [isLoading, setIsLoading] = useState(true);

    const handleImageLoad = () => {
        //simulate downloading 
        setTimeout(() => { }, 4)
        setIsLoading(false);
    };

    return (
        <div className="relative">
            {isLoading && (
                <Skeleton className="rounded-full shadow-xl w-8 h-8" />
            )}
            <Link href="/profile">
                <Avatar>
                    <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                        width={48}
                        height={48}
                        className="rounded-full shadow-xl"
                        onLoad={handleImageLoad}
                    />
                </Avatar>
            </Link>
        </div>
    );
};

export default AvatarWithSkeleton;
