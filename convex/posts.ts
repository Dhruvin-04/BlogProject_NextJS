import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";
import { Doc } from "./_generated/dataModel";

// Create a new task with the given text
export const createPost = mutation({

  args: { title: v.string(), body: v.string(), imageStorageId: v.id('_storage') },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx)
    if (!user) {
      throw new ConvexError("User is not authenticated")
    }
    const blogArticle = await ctx.db.insert("posts", {
      title: args.title,
      body: args.body,
      authorId: user._id,
      imageStorageId: args.imageStorageId
    });
    return blogArticle;
  },
});

export const getPost = query({

  args: {},
  handler: async (ctx) => {
    const blogs = await ctx.db.query('posts').order('desc').collect();

    return await Promise.all(
      blogs.map(async (blog) => {
        const resolvedImageUrl = blog.imageStorageId !== undefined ? await ctx.storage.getUrl(blog.imageStorageId) : null
        return {
          ...blog,
          imageUrl: resolvedImageUrl
        }
      })
    )
  }
})

export const imageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx)
    if (!user) {
      throw new ConvexError("User is not authenticated")
    }

    const uploadUrl = await ctx.storage.generateUploadUrl()
    return uploadUrl
  }
})

export const getUserData = query({

  args: {postId: v.id('posts')},
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.postId)
    if(!blog){
      return null
    }
    const resolvedImageUrl = blog.imageStorageId !== undefined ? await ctx.storage.getUrl(blog.imageStorageId) : null
    return {
      ...blog,
      imageUrl: resolvedImageUrl
    }
  }
})

interface resultType{
  _id: string,
  title: string,
  body: string
}

export const searchQuery = query({
  args:{
    term: v.string(),
    limit: v.number()
  },
  handler:async (ctx, args)=>{
    const limit = args.limit
    const results:Array<resultType> = []
    const seen = new Set()

    const pushDocs = async(docs: Array<Doc<'posts'>>)=>{
      for (const doc of docs){
        if(seen.has(doc._id)) continue
        seen.add(doc._id)

        results.push({
          _id: doc._id,
          title: doc.title,
          body: doc.body
        })

        if(results.length >= limit) break
      }
    }

    const titleMatches = await ctx.db.query('posts').withSearchIndex('search_title', q=>q.search('title', args.term)).take(limit)
    await pushDocs(titleMatches)

    if(results.length < limit){
      const bodyMatches = await ctx.db.query('posts').withSearchIndex('search_body', q=>q.search('body', args.term)).take(limit)
      await pushDocs(bodyMatches)
    }

    return results
  }
})