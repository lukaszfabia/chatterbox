"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const { authenticate, isLoading, error, isAuth, userID } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuth && userID) {
            router.push(`/profile/${userID}`);
        }
    }, [isAuth, userID, router]);


    const [formData, setFormData] = useState({ email_or_username: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        authenticate(formData, "login");
    };

    return (
        <section className="flex min-h-screen items-center justify-center px-5 md:px-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-5xl flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden bg-gray-50 border-gray-200 dark:bg-gray-950 border dark:border-gray-800"
            >

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="hidden md:flex flex-1 items-center justify-center dark:bg-gray-900 bg-gray-100 p-10"
                >
                    <Image
                        src="/img/undraw_secure-login_m11a.svg"
                        alt="Register Illustration"
                        width={400}
                        height={400}
                    />
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex-1 flex flex-col items-center justify-center p-10 space-y-5"
                >
                    <div className="w-full max-w-sm">
                        <h2 className="text-3xl font-bold text-center">Sign In</h2>
                        <p className="text-muted-foreground text-center">Enter your credintials</p>

                        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <Label htmlFor="register" className="text-muted-foreground">
                                    Username or Email
                                </Label>
                                <Input onChange={handleChange} value={formData.email_or_username} type="text" id="email_or_username" name="email_or_username" placeholder="joe.doe@example.com" className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-muted-foreground">
                                    Password
                                </Label>
                                <Input onChange={handleChange} value={formData.password} type="password" id="password" placeholder="••••••••" className="mt-1" />
                            </div>

                            {error && (
                                <p className="text-red-500 text-center text-sm">{error}</p>
                            )}

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button disabled={isLoading} className="w-full mt-4 flex items-center justify-center gap-2" type="submit">
                                    <span>Sign In</span>
                                    <ArrowRight />
                                </Button>
                            </motion.div>
                        </form>

                        <div className="flex items-center my-4">
                            <div className="flex-1 h-px bg-muted-foreground"></div>
                            <p className="mx-3 text-muted-foreground text-sm">or</p>
                            <div className="flex-1 h-px bg-muted-foreground"></div>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                                <Image src="/icons/google.svg" alt="Google Logo" width={20} height={20} />
                                Continue with Google
                            </Button>
                        </motion.div>

                        <p className="text-gray-400 text-center mt-3 text-sm">
                            Don't have an account? <a href="/register" className="text-blue-400">Sign Up</a>
                        </p>

                        <p className="text-muted-foreground text-sm text-center pt-4">
                            By clicking continue, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
                        </p>
                    </div>
                </motion.div>

            </motion.div>
        </section>
    );
}
