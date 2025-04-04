"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginDTO } from "@/lib/dto/login";
import { RegisterDTO } from "@/lib/dto/register";
import { getUnionSchema, loginSchema, registerSchema } from "./schemas";
import { TextInputField } from "./form-components";



const formSchema = getUnionSchema(loginSchema, registerSchema)


function AuthImageSection({ type }: { type: "login" | "register" }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden md:flex flex-1 items-center justify-center dark:bg-gray-900 bg-gray-100 p-10"
        >
            <Image
                src={type === "login" ? "/img/undraw_secure-login_m11a.svg" : "/img/undraw_messaging-fun_ouh4.svg"}
                alt={`${type} illustration`}
                width={400}
                height={400}
            />
        </motion.div>
    );
}

function AuthSwitchPrompt({ type }: { type: "login" | "register" }) {
    return (
        <p className="text-gray-400 text-center mt-3 text-sm">
            {type === "login" ? (
                <>Don't have an account? <Link href="/register" className="text-blue-400">Sign Up</Link></>
            ) : (
                <>Already have an account? <Link href="/login" className="text-blue-400">Sign In</Link></>
            )}
        </p>
    );
}

function AuthFormFields({ type, onSubmit }: { type: "login" | "register", onSubmit: (values: z.infer<typeof formSchema>) => void }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mode: type,
            username: "",
            email: "",
            email_or_username: "",
            password: "",
        },
    });

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center justify-center p-10 space-y-5"
        >
            <div className="w-full max-w-sm">
                <h2 className="text-3xl font-bold text-center">{type === "login" ? "Sign In" : "Sign Up"}</h2>
                <p className="text-muted-foreground text-center">{type === "login" ? "Enter your credentials" : "Create your account today!"}</p>

                <Form {...form}>
                    <form className="mt-5 space-y-4" onSubmit={form.handleSubmit(onSubmit)} action="post">
                        {type === "register" && (
                            <>
                                <TextInputField name="username" control={form.control} label="Username" placeholder="Joey" />
                                <TextInputField name="email" control={form.control} label="Email" placeholder="joe.doe@example.com" />
                            </>
                        )}

                        {type === "login" && (
                            <TextInputField name="email_or_username" control={form.control} label="Email or Username" placeholder="joe.doe@example.com or Joe2003" />
                        )}

                        <TextInputField name="password" control={form.control} label="Password" placeholder="*******" type="password" />

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button type="submit" className="w-full mt-4 flex items-center justify-center gap-2">
                                <span>{type === "login" ? "Sign In" : "Sign Up"}</span>
                                <ArrowRight />
                            </Button>
                        </motion.div>
                    </form>
                </Form>

                <div className="flex items-center my-4">
                    <div className="flex-1 h-px bg-muted-foreground" />
                    <p className="mx-3 text-muted-foreground text-sm">or</p>
                    <div className="flex-1 h-px bg-muted-foreground" />
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                        <Image src="/icons/google.svg" alt="Google Logo" width={20} height={20} />
                        Continue with Google
                    </Button>
                </motion.div>

                <AuthSwitchPrompt type={type} />

                <p className="text-muted-foreground text-sm text-center pt-4">
                    By clicking continue, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
                </p>
            </div>
        </motion.div>
    );
}

function AuthFormLayout({ type, authenticate }: { type: "login" | "register", authenticate: (data: LoginDTO | RegisterDTO, type: "login" | "register") => void }) {
    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        const payload: LoginDTO | RegisterDTO = values.mode === "register"
            ? { username: values.username!, email: values.email!, password: values.password }
            : { email_or_username: values.email_or_username!, password: values.password };

        console.log('handling submit for', values.mode)
        console.log("Submitted values:", values);

        authenticate(payload, values.mode);
    };

    return (
        <>
            {type === "register" && <AuthImageSection type={type} />}
            <AuthFormFields type={type} onSubmit={handleSubmit} />
            {type === "login" && <AuthImageSection type={type} />}
        </>
    );
}

export default function AuthPage({ type }: { type: "login" | "register" }) {
    const { authenticate, isAuth, userID } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuth && userID) {
            router.push(`/profile/${userID}`);
        }
    }, [isAuth, userID, router]);

    return (
        <section className="flex min-h-screen items-center justify-center px-5 md:px-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-5xl flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden bg-gray-50 border-gray-200 dark:bg-gray-950 border dark:border-gray-800"
            >
                <AuthFormLayout type={type} authenticate={authenticate} />
            </motion.div>
        </section>
    );
}