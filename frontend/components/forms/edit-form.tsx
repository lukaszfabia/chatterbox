"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { User } from "@/lib/models/user";
import { Button } from "../ui/button";
import { Pencil, Trash } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { motion } from "framer-motion";
import { getUnionSchema, profileSchema, securitySchema } from "./schemas";
import { TextInputField, TextAreaField, FileField } from "./form-components";
import Link from "next/link";


export const formSchema = getUnionSchema(securitySchema, profileSchema);


type EditFormProps = {
    user: User;
    type: "security" | "profile";
    onSubmit: (values: z.infer<typeof formSchema>) => void;
};

function EditForm({ user, type, onSubmit }: EditFormProps) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mode: type,
            username: user.username ?? "",
            email: user.email ?? "",
            password: "",
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            bio: user.bio ?? "",
            backgroundFile: null,
            avatarFile: null,
        },
    });

    return (
        <Form {...form}>
            <motion.h1 className="text-3xl font-bold py-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {type === "security" ? "Authentication Information" : "Profile Information"}
            </motion.h1>

            <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/4 space-y-5">
                {type === "security" ? (
                    <>
                        <TextInputField name="username" control={form.control} label="Username" placeholder="eg. Joe2003" />
                        <TextInputField name="email" control={form.control} label="Email" placeholder="eg. joe.doe@example.com" />
                        <TextInputField name="password" control={form.control} label="Password" placeholder="*******" type="password" />
                    </>
                ) : (
                    <>
                        <TextInputField name="firstName" control={form.control} label="First Name" placeholder="eg. Joe" />
                        <TextInputField name="lastName" control={form.control} label="Last Name" placeholder="eg. Doe" />
                        <TextAreaField name="bio" control={form.control} label="Bio" placeholder="Tell something about yourself" />
                        <div className="flex justify-between">
                            <FileField name="avatarFile" control={form.control} label="Avatar" description="Your profile picture." />
                            <Separator className="mx-5" orientation="vertical" />
                            <FileField name="backgroundFile" control={form.control} label="Background" description="Something to make your profile more attractive." />
                        </div>
                    </>
                )}

                <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <Button type="submit" className="w-full sm:w-auto">
                        <Pencil className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </motion.div>
            </form>
        </Form>
    );
}

function AccountActions({ user, deleteAcc }: { user: User, deleteAcc: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        >
            <motion.h1 className="text-3xl font-bold py-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                Delete Account
            </motion.h1>

            <motion.p
                className="text-muted-foreground pb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
            >
                user action cannot be undone. user will permanently delete your account and
                remove all your data from our servers.
            </motion.p>

            <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-700 transition-all"
                    onClick={deleteAcc}
                >
                    <Trash className="h-4 w-4" />
                    Delete Account
                </motion.button>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                >
                    <Link href={`/profile/${user.id}`}>
                        <Button variant="outline">
                            Cancel
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}


export interface EditFormLayoutProps {
    user: User | null;
    submitProfile: (values: z.infer<typeof formSchema>) => void;
    subimtSecurity: (values: z.infer<typeof formSchema>) => void;
    deleteAcc: () => void;
}

export function EditFormLayout({ user, subimtSecurity, submitProfile, deleteAcc }: EditFormLayoutProps) {

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex min-h-screen py-20 mt-10 px-5 sm:px-20 md:px-40 w-full">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }} className="w-1/5">
                {!user ? <Skeleton className="h-10 w-2/3 mb-4" /> : <h1 className="md:text-5xl text-3xl">Edit Account</h1>}
                {!user ? <Skeleton className="h-6 w-2/3" /> : <p>Manage your account settings</p>}
                <Separator className="my-4" />
            </motion.div>

            <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Separator className="mx-5" orientation="vertical" />
            </motion.div>

            <div className="w-4/5">
                <Tabs defaultValue="security" className="w-full" >
                    <TabsList className="w-full">
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="others">Others</TabsTrigger>
                    </TabsList>

                    <TabsContent value="security">
                        {user && <EditForm user={user} type="security" onSubmit={subimtSecurity} />}
                    </TabsContent>
                    <TabsContent value="profile">
                        {user && <EditForm user={user} type="profile" onSubmit={submitProfile} />}
                    </TabsContent>

                    <TabsContent value="others">
                        {user && <AccountActions user={user} deleteAcc={deleteAcc} />}
                    </TabsContent>
                </Tabs>
            </div>
        </motion.div>
    );
}
