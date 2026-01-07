import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const createComment = mutation({
    args:{postId: v.id('posts'), body: v.string()},
    handler:async (ctx, args)=>{
        const user = await authComponent.safeGetAuthUser(ctx)
        if(!user){
            throw new ConvexError('User is not authenticated')
        }

        const comment = await ctx.db.insert('comments',{
            authorId: user._id,
            authorName: user.name,
            postId: args.postId,
            body: args.body
        })
        return comment
    }
})

export const getCommentbyPost = query({
    args: {postId: v.id('posts')},
    handler:async (ctx, args)=>{
        const comment = await ctx.db.query('comments').filter(q=>q.eq(q.field('postId'), args.postId)).order('desc').collect()
        return comment
    }
})