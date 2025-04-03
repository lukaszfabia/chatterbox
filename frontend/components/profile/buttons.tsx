import { motion } from "framer-motion"
import { Skeleton } from "../ui/skeleton"
import { Pencil } from "lucide-react"
import { Button } from "../ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="w-full" variant="outline">
                            <Pencil className="h-4 w-4" />
                            Send
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Do you want to create new chat?</AlertDialogTitle>
                            <AlertDialogDescription>
                                It looks like you haven't chat with "username" yet?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </motion.div>
    )
}
