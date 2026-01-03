import { Navbar } from "@/components/web_utils/Navbar";
import { ReactNode } from "react";

export default function SharedLayout({children}:{children: ReactNode}){
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}