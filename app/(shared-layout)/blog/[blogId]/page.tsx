import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CommentSection } from "@/components/web_utils/CommentSection"
import Presence from "@/components/web_utils/Presence"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { getToken } from "@/lib/auth-server"
import { fetchQuery, preloadQuery } from "convex/nextjs"
import { ConvexError } from "convex/values"
import { ArrowLeft } from "lucide-react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

interface BlogUserProps {
    params: Promise<{
        blogId: Id<'posts'>
    }>
}

export async function generateMetadata({ params }: BlogUserProps): Promise<Metadata> {
  const { blogId } = await params
  const data = await fetchQuery(api.posts.getUserData, { postId: blogId })
  if(!data || data === undefined){
    return{
        title: 'Blog Not Found'
    }
  }
  return {
    title: `Blog | ${data?.title}`,
    description: data.body,
  }
}

export default async function BlogUser({ params }: BlogUserProps) {
    const { blogId } = await params

    const token = await getToken()
    const [post, preloadedComments, user] = await Promise.all([
        await fetchQuery(api.posts.getUserData, { postId: blogId }),
        await preloadQuery(api.comment.getCommentbyPost, { postId: blogId }),
        await fetchQuery(api.presence.getUserById, {}, {token})
    ])

    if(!user){
        return redirect('/auth/login')
    }
    

    if (!post) {
        return (
            <div>
                <h1 className="text-5xl flex items-center justify-center text-red-500">Not Found</h1>
            </div>
        )
    }
    return (
        <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
            <Link href={'/blog'} className={buttonVariants({ variant: "outline" })}>
                <ArrowLeft />
                Go Back
            </Link>

            <div className="h-100 w-full relative rounded-xl overflow-hidden shadow-sm mt-4">
                <Image className="object-cover hover:scale-105 transition-transform duration-500" src={post?.imageUrl ?? 'https://unsplash-assets.imgix.net/empty-states/photos.png?auto=format&fit=crop&q=60'} alt='Blog Image' fill />
            </div>
            <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-bold tracking-tight mt-4">{post?.title}</h1>
                <div className="flex gap-5">
                    <p className="text-muted-foreground">Posted on: {new Date(post._creationTime).toLocaleDateString("en-US")}</p>
                    <Presence roomId={blogId} userId={user.name}/>
                </div>
            </div>
            <Separator className="my-8" />
            <div className="text-lg text-muted-foreground/80 whitespace-pre-wrap leading-relaxed">
                {post.body}
            </div>
            <Separator className="my-8" />
            <CommentSection preloadedComments={preloadedComments} />
        </div>
    )
}