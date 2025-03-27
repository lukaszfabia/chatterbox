import { transformTime } from "@/lib/time";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function BioSection({ bio, createdAt, isLoading }: { bio?: string | null, createdAt?: Date, isLoading?: boolean }) {
    const variants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    if (isLoading) {
        return (
            <motion.div
                className="py-3 text-center space-y-4"
                initial="hidden"
                animate="visible"
                variants={variants}
            >
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <div className="flex items-center justify-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            className="py-3 text-center"
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ delay: 0.2 }}
        >
            {bio && (
                <motion.p
                    className="leading-relaxed py-4 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {bio}
                </motion.p>
            )}
            <motion.p
                className="text-muted-foreground flex items-center justify-center space-x-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <Calendar size={16} />
                <span className="font-bold">Joined</span>
                <span>{createdAt ? transformTime(createdAt) : ''}</span>
            </motion.p>
        </motion.div>
    )
}