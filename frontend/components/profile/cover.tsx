import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { host } from "../images";

export default function Cover({ url, isLoading }: { url?: string | null; isLoading?: boolean }) {
    return (
        <div className="h-48 relative overflow-hidden rounded-t-xl">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="skeleton"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Skeleton className="h-48 w-full" />
                    </motion.div>
                ) : url ? (
                    <motion.div
                        key="image"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src={`http://${host}/${url}`}
                            alt="background"
                            fill
                            className="object-cover shadow-xl"
                            unoptimized={true}
                            priority
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="gradient"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 h-full w-full"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
