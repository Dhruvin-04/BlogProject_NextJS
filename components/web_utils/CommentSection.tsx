'use client'

import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError } from "../ui/field";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schemas/commentSchema";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Preloaded, usePreloadedQuery, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import z from "zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

export function CommentSection(props: {
    preloadedComments: Preloaded<typeof api.comment.getCommentbyPost>;
}) {
    const [isPending, startTransition] = useTransition()
    const params = useParams<{ blogId: Id<'posts'> }>()
    const data = usePreloadedQuery(props.preloadedComments)
    const createComment = useMutation(api.comment.createComment)
    const form = useForm({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            body: '',
            postId: params.blogId
        }
    })

    if (data == undefined) {
        return <p>Loading...</p>
    }

    const onSubmit = (data: z.infer<typeof commentSchema>) => {
        startTransition(async () => {
            try {
                await createComment(data)
                form.reset()
                toast.success("Comment posted")
            } catch (error) {
                toast.error('Failed to comment')
            }
        })
    }

    return (
        <Card>
            <CardHeader className="flex items-center gap-5">
                <MessageSquare className="size-5" />
                <h1 className="text-2xl font-bold">{data.length} Comments</h1>
            </CardHeader>
            <CardContent className="space-y-7 w-full">
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <Controller name='body' control={form.control} render={({ field, fieldState }) => (
                        <Field className='gap-y-2'>
                            <Textarea aria-invalid={fieldState.invalid} placeholder='Share Your Thougths' {...field} />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} />
                    <Button disabled={isPending}>{isPending ? (
                        <>
                            <Loader2 className='size-4 animate-spin' />
                            <span>Loading...</span>
                        </>
                    ) : (
                        <span>Comment</span>
                    )}</Button>
                </form>

                {data?.length > 0 && <Separator />}

                <section className="space-y-6">
                    {data?.map((comment) => (
                        <div key={comment._id} className="flex gap-4">
                            <Avatar className="size-11 shrink-0">
                                <AvatarImage src={`https://avatar.vercel.sh/${comment.authorName}?rounded=60`} alt={comment.authorName} />
                                <AvatarFallback>{comment.authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-semibold">{comment.authorName}</h2>
                                    <p className="text-muted-foreground/60 text-xs">Posted on: {new Date(comment._creationTime).toLocaleDateString('en-US')}</p>
                                </div>

                                <div className="text-muted-foreground text-sm">{comment.body}</div>
                            </div>
                        </div>
                    ))}
                </section>
            </CardContent>
        </Card>
    )
}