import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import Image from "next/image";
import Link from "next/link";
import { fetchQuery } from "convex/nextjs";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function BlogPage() {

    return (
        <div className="py-12 w-full">
            <div className="text-center">
                <h1 className="text-6xl tracking-tight font-extrabold">OUR BLOGS</h1>
                <p className="text-muted-foreground text-lg mt-1">Thoughts, Insights, Stories all across the World!</p>
            </div>

        <Suspense fallback={blogSkeleton()}>
            <LoadBlogs/>
        </Suspense>

        </div>
    )
}

async function LoadBlogs() {
    const data = await fetchQuery(api.posts.getPost)
    return (
        < div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3 mt-10" >
            {data?.map((post) => (
                <Card key={post._id} className="pt-0 h-113 relative">
                    <div className="w-full h-50 relative rounded overflow-hidden">
                        <Image
                            src='https://plus.unsplash.com/premium_photo-1710119487366-ef814031eaf4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                            alt="Image"
                            fill
                            className="rounded-t-lg"
                        />
                    </div>
                    <CardContent>
                        <Link className="text-2xl font-bold line-clamp-2" href={`/blog/${post._id}`}>{post.title}</Link>
                        <p className="text-muted-foreground line-clamp-3 pt-3">{post.body}</p>
                    </CardContent>
                    <CardFooter className="absolute bottom-6 w-full">
                        <Link href={`/blog/${post._id}`} className={buttonVariants({ className: "w-full" })}>Read More</Link>
                    </CardFooter>
                </Card>
            ))
            }
        </div >
    )
}

function blogSkeleton(){
    return(
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3 mt-10">
            {[...Array(6)].map((_, i)=>(
                <div key={i} className="flex flex-col space-y-4">
                    <Skeleton className="h-50 w-full rounded-xl"/>
                    <div className="flex flex-col space-y-3">
                        <Skeleton className="h-6 w-1/3"/>
                        <Skeleton className="h-10 w-full"/>
                        <Skeleton className="h-6 w-2/3 rounded-full"/>
                    </div>
                </div>
            ))}
        </div>
    )
}