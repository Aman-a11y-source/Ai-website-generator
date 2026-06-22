import { db } from "@/config/db";
import { chatTable, frameTable } from "@/config/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const frameId = searchParams.get("frameId");
        
        if (!frameId) {
            return NextResponse.json({ error: "Missing frameId" }, { status: 400 });
        }

        const frameResult = await db.select().from(frameTable)
            .where(eq(frameTable.frameId, frameId));

        const chatResult = await db.select().from(chatTable)
            .where(eq(chatTable.frameId, frameId));
        
        const finalResult= {
            ...frameResult[0],
            chatMessages: chatResult?.[0]?.chatMessage || []
        }
        return NextResponse.json(finalResult);
    } catch (error: any) {
        console.error("Error fetching frame details:", error);
        require('fs').appendFileSync('error.log', "Error in /api/frames GET: " + (error?.stack || error) + "\n");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req:NextRequest){
    try {
        const {designCode,projectId,frameId}= await req.json();

        if (!frameId || !projectId) {
            return NextResponse.json({ error: "Missing frameId or projectId" }, { status: 400 });
        }

        const result=await db.update(frameTable).set({
            designCode:designCode
        }).where(and(eq(frameTable.frameId,frameId),eq(frameTable.projectId,projectId)))
        
        return NextResponse.json({result:'Updated!'})
    } catch (error: any) {
        console.error("Error in /api/frames PUT:", error);
        require('fs').appendFileSync('error.log', "Error in /api/frames PUT: " + (error?.stack || error) + "\n");
        return NextResponse.json({ error: "Internal Server Error", message: error?.message }, { status: 500 });
    }
}
