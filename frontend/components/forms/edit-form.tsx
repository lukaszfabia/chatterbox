"use client";

import { useAuth } from "@/context/auth-context";
import { useProfile } from "@/context/profile-context";
import getUserID from "@/lib/jwt";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { User } from "@/lib/models/user";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const securitySchema = z.object({
    mode: z.literal("security"),
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const profileSchema = z.object({
    mode: z.literal("profile"),
    firstName: z.string().max(50).optional(),
    lastName: z.string().max(50).optional(),
    bio: z.string().max(500).optional(),
    avatarFile: z
        .instanceof(File)
        .optional()
        .nullable(),
    backgroundFile: z
        .instanceof(File)
        .optional()
        .nullable(),
});

const formSchema = z.discriminatedUnion("mode", [profileSchema, securitySchema]);

function EditForm({ user, type, onSubmit }: { user: User, type: "security" | "profile", onSubmit: (values: z.infer<typeof formSchema>) => void }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mode: type,
            ...user.auth,
            ...user.profile,
            backgroundFile: null,
            avatarFile: null,
        },
    });


    return (
        <Form {...form}>
            <form action="put" onSubmit={form.handleSubmit(onSubmit)}>
                {type === "security" && (
                    <div className="space-y-5">
                        <FormField name="username" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl><Input placeholder="eg. Joe2003" {...field} /></FormControl>
                                <FormDescription>
                                    Your new username.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="email" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input placeholder="eg. joe.doe@example.com" {...field} /></FormControl>
                                <FormMessage />
                                <FormDescription>
                                    Your new email.
                                </FormDescription>
                            </FormItem>
                        )} />

                        <FormField name="password" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl><Input type="password" placeholder="*******" {...field} /></FormControl>
                                <FormMessage />
                                <FormDescription>
                                    Your new password.
                                </FormDescription>
                            </FormItem>
                        )} />
                    </div>
                )}

                {type === "profile" && (
                    <div className="space-y-5">
                        <FormField name="firstName" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>First name</FormLabel>
                                <FormControl><Input placeholder="eg. Doe" {...field} /></FormControl>
                                <FormDescription>
                                    Your first name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="lastName" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last name</FormLabel>
                                <FormControl><Input placeholder="eg. Joe" {...field} /></FormControl>
                                <FormMessage />
                                <FormDescription>
                                    Your last name.
                                </FormDescription>
                            </FormItem>
                        )} />

                        <FormField name="bio" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl><Textarea placeholder="eg. Edit me" {...field} /></FormControl>
                                <FormMessage />
                                <FormDescription>
                                    Tell something about yourself.
                                </FormDescription>
                            </FormItem>
                        )} />

                        <FormField name="avatarFile" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Avatar</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            field.onChange(file);
                                        }}
                                    /></FormControl>
                                <FormMessage />
                                <FormDescription>
                                    Upload your avatar.
                                </FormDescription>
                            </FormItem>
                        )} />

                        <FormField name="backgroundFile" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            field.onChange(file);
                                        }}
                                    /></FormControl>
                                <FormMessage />
                                <FormDescription>
                                    Upload your background.
                                </FormDescription>
                            </FormItem>
                        )} />
                    </div>
                )}
            </form>
        </Form>
    );
}

export function EditFormLayout({ user }: { user: User | null }) {
    return (
        <div className="flex min-h-screen py-20 mt-10 px-5 sm:px-20 md:px-40 w-full">
            <div className="w-1/5">
                {!user ? (
                    <Skeleton className="h-10 w-2/3 mb-4" />
                ) : (
                    <h1 className="md:text-5xl text-3xl">Edit Account</h1>
                )}

                {!user ? (
                    <Skeleton className="h-6 w-2/3" />
                ) : (
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis reprehenderit, vitae quos eveniet quaerat doloribus nesciunt ducimus? Temporibus vitae, maxime fugit reiciendis debitis neque modi amet. Nam expedita harum alias?</p>
                )}

                <Separator className="my-4" />
            </div>

            <div>
                <Separator className="mx-5" orientation="vertical" />
            </div>

            <div className="w-4/5">
                <Tabs defaultValue="security" className="w-full">
                    <div className="flex justify-center items-center">
                        {!user ? (
                            <Skeleton className="h-10 w-1/2" />
                        ) : (
                            <TabsList className="w-1/2">
                                <TabsTrigger value="security">Security</TabsTrigger>
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                                <TabsTrigger value="other">Other</TabsTrigger>
                            </TabsList>
                        )}
                    </div>


                    <div>
                        <TabsContent value="security">
                            {!user ? (
                                <Skeleton className="h-60 w-full" />
                            ) : (
                                <EditForm user={user} type="security" onSubmit={() => { }} />
                            )}
                        </TabsContent>
                        <TabsContent value="profile">
                            {!user ? (
                                <Skeleton className="h-60 w-full" />
                            ) : (
                                <EditForm user={user} type="profile" onSubmit={() => { }} />
                            )}
                        </TabsContent>

                        <TabsContent value="other">
                            <Button variant="destructive"><Trash /> Delete Account</Button>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}