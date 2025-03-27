import { Separator } from "@radix-ui/react-separator";
import { Skeleton } from "../ui/skeleton";

export function UserRowSkeleton() {
    return (
        <div className="bg-slate-100 dark:bg-slate-900 w-full rounded-xl shadow-sm p-4 my-5">
            <div className="flex items-center justify-between">
                <div className="flex space-x-4 items-center">
                    <Skeleton className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <Separator orientation="vertical" className="h-8" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32 bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-4 w-48 bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-3 w-24 bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
                <Skeleton className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
        </div>
    );
}