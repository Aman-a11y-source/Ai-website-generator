import { db } from "@/config/db";
import { chatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import {NextRequest, NextResponse} from "next/server";

export async function PUT(req:NextRequest){
    try {
        const {messages,frameId}=await req.json();

        if (!frameId) {
            return NextResponse.json({ error: "Missing frameId" }, { status: 400 });
        }

        const result = await db.update(chatTable).set({
            chatMessage:messages,
        }).where(eq(chatTable.frameId,frameId))
        return NextResponse.json({result:'updated'})
    } catch (error: any) {
        console.error("Error in /api/chats PUT:", error);
        require('fs').appendFileSync('error.log', "Error in /api/chats PUT: " + (error?.stack || error) + "\n");
        return NextResponse.json({ error: "Internal Server Error", message: error?.message }, { status: 500 });
    }
}
