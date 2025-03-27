import { motion } from "framer-motion"
import { Skeleton } from "../ui/skeleton"
import { Pencil, MessageCircle } from "lucide-react"
import { Button } from "../ui/button"

export default function ActionButtons({ isMe, isLoading }: { isMe: boolean, isLoading?: boolean }) {
    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <Skeleton className="w-full h-10 mt-4 rounded-md" />
            </motion.div>
        )
    }

    return (
        <motion.div
            className="w-full mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            {isMe ? (
                <Button className="w-full" variant="outline">
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                </Button>
            ) : (
                <Button className="w-full" variant="outline">
                    <MessageCircle className="h-4 w-4" />
                    Send Message
                </Button>
            )}
        </motion.div>
    )
}
