import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingBlog(){
    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <Skeleton className="h-10 w-30"/>
            <Skeleton className="h-100 w-full rounded-xl mt-4"/>
            <div className="flex flex-col gap-3 mt-5">
                <Skeleton className="h-10 w-full"/>
                <Skeleton className="h-6 w-20"/>
            </div>
            <Skeleton className="w-full h-20 mt-4"/>
            <Skeleton className="w-full h-30 mt-4"/>
        </div>
    )
}