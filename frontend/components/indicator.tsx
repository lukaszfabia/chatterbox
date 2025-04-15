import { Loader2Icon } from "lucide-react";

export default function Loading() {
    return (
        <div className="md:max-w-5xl min-h-screen max-w-xl mx-auto bg-background rounded-t-xl px-5 md:px-20 flex items-center justify-center">
            <Loader2Icon className="animate-spin" />
        </div>
    )
}