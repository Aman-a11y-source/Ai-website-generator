import { db } from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq, inArray, desc } from "drizzle-orm";
import { chatTable, frameTable, projectTable } from "@/config/schema";

export async function GET(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user || !user.primaryEmailAddress?.emailAddress) {
            return NextResponse.json([]);
        }

        const projects = await db.select().from(projectTable)
        .where(eq(projectTable.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(projectTable.createdOn));

        let results: {
            projectId: string;
            frameId: string;
            chats: { id: number; chatMessage: any; createdBy: string; createdOn: Date }[];
        }[] = [];

        for (const project of projects) {
            if (!project.projectId) continue;

            const frames = await db
                .select({ frameId: frameTable.frameId })
                .from(frameTable)
                .where(eq(frameTable.projectId, project.projectId));

            const frameIds = frames.map((f: any) => f.frameId);
            let chats: any[] = [];
            if (frameIds.length > 0) {
                chats = await db
                    .select()
                    .from(chatTable)
                    .where(inArray(chatTable.frameId, frameIds));
            }

            for (const frame of frames) {
                results.push({
                    projectId: project.projectId ?? '',
                    frameId: frame.frameId ?? '',
                    chats: chats.filter((c) => c.frameId === frame.frameId),
                });
            }
        }

        return NextResponse.json(results);
    } catch (error: any) {
        console.error("Error in /api/get-app-projects:", error);
        return NextResponse.json([]);
    }
}
