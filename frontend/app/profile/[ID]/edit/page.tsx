"use client";

import { useAuth } from "@/context/auth-context";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useProfile } from "@/context/profile-context";
import { EditFormLayout } from "@/components/forms/edit-form";
import { User } from "@/lib/models/user";

export default function EditAccount() {
    const { isAuth, userID } = useAuth();
    const { currUserProfile } = useProfile();
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const { ID } = useParams();

    useEffect(() => {
        if (userID !== ID || !isAuth || !currUserProfile) {
            router.push(`/profile/${ID}`);
        } else {
            setUser(currUserProfile);
        }

    }, [isAuth, userID, router, currUserProfile, ID]);

    return (
        <EditFormLayout user={user} />
    );
}
