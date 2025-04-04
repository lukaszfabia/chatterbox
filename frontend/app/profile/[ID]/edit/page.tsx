"use client";

import { useAuth } from "@/context/auth-context";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useProfile } from "@/context/profile-context";
import { EditFormLayout, formSchema } from "@/components/forms/edit-form";
import { User } from "@/lib/models/user";
import { z } from "zod";
import { UpdateProfileDTO, UpdateUserDTO } from "@/lib/dto/update";
import { toast } from "sonner";
import toFormData from "@/lib/parser";

export default function EditAccount() {
    const { isAuth, userID, deleteAcc, updateAcc, error } = useAuth();
    const { currUserProfile, updateProfile } = useProfile();
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

    const subimtSecurity = async (values: z.infer<typeof formSchema>) => {
        const payload: UpdateUserDTO = {
            email: values.email,
            password: values.password,
            username: values.username,
        }

        const message = await updateAcc(payload)
        if (message) {
            toast(message, {
                description: "Please wait for a moment to get updated profile.",
                action: {
                    label: "Ok",
                    onClick: () => { },
                },
            })

            router.push(`/profile/${user?.id}`)
        } else {

        }
    }


    const submitProfile = (values: z.infer<typeof formSchema>) => {
        const payload: UpdateProfileDTO = {
            firstName: values.firstName,
            lastName: values.lastName,
            bio: values.bio,
            avatarFile: values.avatarFile,
            backgroundFile: values.backgroundFile,
        }

        const formData = toFormData(payload)

        updateProfile(formData).then((user) => {
            if (user) {
                toast("Profile has been updated!", {
                    description: "Please wait for a moment to get updated profile.",
                    action: {
                        label: "Ok",
                        onClick: () => { },
                    },
                })
            } else {
                toast("Opps!", {
                    description: "Something went wrong, try again or check input.",
                    action: {
                        label: "Ok",
                        onClick: () => { },
                    },
                })
            }
        }).catch((e) => {
            toast("Opps!", {
                description: "Something went wrong!",
                action: {
                    label: "Ok",
                    onClick: () => { },
                },
            })
        })

        router.push(`/profile/${user?.id}`)
    }

    return (
        <EditFormLayout user={user} subimtSecurity={subimtSecurity} submitProfile={submitProfile} deleteAcc={deleteAcc} />
    );
}
