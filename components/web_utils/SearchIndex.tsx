import { Loader2, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export function SearchIndex(){
    const [input, setInput] = useState('')
    const [open, setOpen] = useState(false)

    const results = useQuery(api.posts.searchQuery, input.length >=2?{limit:5, term:input}:'skip')
    return(
        <div className="relative w-full max-w-sm z-10">
            <div className="relative">
                <Search className="size-4 absolute top-2.5 left-2.5 text-muted-foreground"/>
                <Input value={input} onChange={(e)=>{setInput(e.target.value), setOpen(true)}} type="search" placeholder="Search..." className="w-full pl-8 bg-background text-muted-foreground font-medium leading-loose"/>
            </div>
            {open && input.length>=2 && (
                <div className="absolute top-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-sm outline-none animate-in fade-in-0 zoom-in-95">
                    {results == undefined? (
                        <div className="flex items-center justify-center text-sm p-4 text-muted-foreground">
                            <Loader2 className="my-2 size-4 animate-spin"/>
                            Searching ...
                        </div>
                    ): results.length === 0?(
                        <p className="p-4 text-sm text-muted-foreground text-center">No Result Found!</p>
                    ):(
                        <div className="py-1">
                            {results.map((post)=>(
                                <Link onClick={()=>{setOpen(false), setInput('')}} className="flex flex-col px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer" href={`/blog/${post._id}`} key={post._id}>
                                    <p className="font-medium truncate">{post.title}</p>
                                    <p className="text-xs text-muted-foreground pt-1">{post.body.substring(0,50)}</p>
                                </Link>
                                
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}