'use client'

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import usePresence from "@convex-dev/presence/react";
import FacePile from "@convex-dev/presence/facepile";

interface PresenceProps{
    roomId: Id<'posts'>,
    userId: string
}

export default function Presence({roomId, userId}: PresenceProps){
     const presenceState = usePresence(api.presence, roomId, userId);

     if(!presenceState || presenceState===null){
        return null
     }

     return(
        <div className="text-black">
            <FacePile presenceState={presenceState ?? []} />
        </div>
     )
}