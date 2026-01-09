'use client'
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SearchIndex } from "./SearchIndex";

export function Navbar() {
    const router = useRouter()
    const { isAuthenticated, isLoading } = useConvexAuth()
    return (
        <nav className='flex justify-between items-center w-full py-5'>
            <div className="flex items-center gap-15">
                <div>
                    <Link href='/'>
                        <h1 className='text-4xl font-bold'>Next<span className='text-primary'>Pro</span></h1>
                    </Link>
                </div>
                <div className='flex items-center gap-4'>
                    <Link className={`${buttonVariants({ variant: "ghost" })} text-xl`} href='/'>Home</Link>
                    <Link className={`${buttonVariants({ variant: "ghost" })} text-xl`} href='/blog'>Blog</Link>
                    <Link className={`${buttonVariants({ variant: "ghost" })} text-xl`} href='/create'>Create</Link>
                </div>
            </div>
            <div className='flex items-center gap-4'>
                <div className="hidden md:block mr-2"><SearchIndex/></div>
                {isLoading ? null : isAuthenticated ? (
                    <Button onClick={()=>authClient.signOut({
                        fetchOptions:{
                            onSuccess: ()=>{
                                toast.success("Logged out succesfully")
                                router.push('/')
                            },
                            onError:(error)=>{
                                toast.error(error.error.message)
                            }
                        }
                    })} className={buttonVariants({variant: "destructive"})}>LogOut</Button>
                ) : (
                    <>
                        <Link className={buttonVariants()} href='/auth/signup'>SignUp</Link>
                        <Link className={buttonVariants({ variant: "outline" })} href='/auth/login'>Login</Link>
                    </>
                )}
                <ThemeToggle />
            </div>

        </nav>
    )
}