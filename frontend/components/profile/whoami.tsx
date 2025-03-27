import { motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";

export default function WhoAmI({ firstName, lastName, username, isLoading }: {
    firstName?: string | null,
    lastName?: string | null,
    username?: string,
    isLoading?: boolean
}) {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1
            }
        })
    };

    if (isLoading) {
        return (
            <motion.div
                className="flex flex-col items-center text-center space-y-2"
                initial="hidden"
                animate="visible"
            >
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-32" />
            </motion.div>
        )
    }

    return (
        <motion.div
            className="flex flex-col items-center text-center"
            initial="hidden"
            animate="visible"
        >
            {firstName && lastName ? (
                <div className="flex flex-col items-center">
                    <motion.div
                        className="flex gap-2 items-center"
                        custom={0}
                        variants={itemVariants}
                    >
                        <h1 className="text-3xl font-bold">
                            {firstName} <span className="text-gray-500">{lastName}</span>
                        </h1>
                    </motion.div>
                    <motion.p
                        className="text-lg text-muted-foreground"
                        custom={1}
                        variants={itemVariants}
                    >
                        @{username}
                    </motion.p>
                </div>
            ) : (
                <motion.h1
                    className="text-3xl font-bold"
                    custom={0}
                    variants={itemVariants}
                >
                    {username}
                </motion.h1>
            )}
        </motion.div>
    )
}
