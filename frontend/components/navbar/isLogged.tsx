"use client";

import { useProfile } from "@/context/profile-context";
import Login from "./login"
import AvatarWithSkeleton from "./profile"
import { Register } from "./register"
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";

export default function IsLogged() {
    const { currUserProfile, isLoading } = useProfile();
    const [isMounted, setIsMounted] = useState(false);


    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (isLoading || !isMounted) {
        return <Skeleton className="rounded-full shadow-xl w-8 h-8" />
    }

    if (currUserProfile) {
        return <AvatarWithSkeleton user={currUserProfile} />
    }


    return (
        <div className="md:flex-row flex-col space-x-2">
            <Login />
            <Register />
        </div>
    )
}