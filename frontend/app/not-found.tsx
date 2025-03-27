"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound404() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen flex md:flex-row flex-col items-center justify-center px-5 md:px-20 bg-background"
        >
            <motion.div
                variants={itemVariants}
                className="flex-1 flex items-center justify-center p-10 max-sm:hidden"
            >
                <Image
                    src="/img/undraw_void_wez2.svg"
                    alt="404 Not Found illustration"
                    width={500}
                    height={500}
                    priority
                    className="w-full max-w-[500px] h-auto"
                />
            </motion.div>

            <motion.div
                variants={containerVariants}
                className="sm:flex-1 space-y-6 md:space-y-8 max-w-2xl"
            >
                <motion.h1
                    variants={itemVariants}
                    className="md:text-6xl text-4xl font-extrabold leading-tight"
                >
                    Page <span className="text-red-500">Not</span>{' '}
                    <span className="font-medium font-playfair text-primary">Found</span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-lg text-muted-foreground"
                >
                    Oops! The page you're looking for doesn't exist or has been moved.
                    Please check the URL or return to the homepage.
                </motion.p>

                <motion.div variants={itemVariants}>
                    <Link href="/" passHref>
                        <Button
                            size="lg"
                            className="group px-6"
                            asChild
                        >
                            <motion.div className="flex items-center gap-2">
                                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                                <span>Return Home</span>
                            </motion.div>
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}