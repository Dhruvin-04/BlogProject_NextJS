"use server"
import { z } from "better-auth";
import { blogSchema } from "./schemas/blogSchema";
import { fetchMutation } from "convex/nextjs";
import { redirect } from "next/navigation";
import { getToken } from "../lib/auth-server";
import { api } from "../convex/_generated/api";

export async function createBlogAction(data: z.infer<typeof blogSchema>) {
    const parsed = blogSchema.safeParse(data)

    if (!parsed.success) {
        throw new Error('Something went wrong')
    }

    const token = await getToken()

    try {
        const imageUrl = await fetchMutation(api.posts.imageUploadUrl, {}, { token })

        const uploadUrl = await fetch(imageUrl, {
            method: 'POST',
            headers: {
                "Content-Type": parsed.data.image.type
            },
            body: parsed.data.image
        })

        if (!uploadUrl.ok) {
            return {
                error: 'Failed to upload Image'
            }
        }

        const { storageId } = await uploadUrl.json()

        const blogCreate = await fetchMutation(api.posts.createPost,
            {
                title: parsed.data.title,
                body: parsed.data.content,
                imageStorageId: storageId
            },
            { token }
        )
    } catch (error) {
        return {
                error: "Failed to create a Post"
        }
    }

    return redirect('/')
}