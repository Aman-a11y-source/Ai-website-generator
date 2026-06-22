import { db } from "@/config/db";
import { chatTable, frameTable, projectTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    const { projectId, frameId, messages } = await req.json();

    await db.insert(projectTable).values({
      projectId: projectId,
      createdBy: email,
    });

    await db.insert(frameTable).values({
      frameId: frameId,
      projectId: projectId,
    });

    await db.insert(chatTable).values({
      frameId: frameId,
      chatMessage: messages,
      createdBy: email,
    });

    return NextResponse.json({
      projectId, frameId, messages
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
