import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";

// Create a new task with the given text
export const createPost = mutation({

  args: { title: v.string(), body: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx)
    if(!user){
        throw new ConvexError("User is not authenticated")
    }
    const blogArticle = await ctx.db.insert("posts", {
        title: args.title,
        body: args.body,
        authorId: user._id
    });
    return blogArticle;
  },
});

export const getPost = query({

  args:{},
  handler: async (ctx)=>{
    const blogs = await ctx.db.query('posts').order('desc').collect()
    return blogs
  }
})