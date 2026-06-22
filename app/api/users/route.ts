import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";

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

    const userResult = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (userResult.length === 0) {
      const data = {
        name: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        email: user.primaryEmailAddress?.emailAddress ?? '',
        credits: 2
      };

      const result = await db
        .insert(usersTable)
        .values({
          ...data
        })
        .returning();

      return NextResponse.json({ user: result[0] });
    }

    return NextResponse.json({ user: userResult[0] });
  } catch (error) {
    console.error("Error handling user signup:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    const userResult = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentCredits = userResult[0].credits ?? 2;
    if (currentCredits <= 0) {
      return NextResponse.json({ error: "No credits remaining" }, { status: 400 });
    }

    const updatedUser = await db
      .update(usersTable)
      .set({ credits: currentCredits - 1 })
      .where(eq(usersTable.email, email))
      .returning();

    return NextResponse.json({ user: updatedUser[0] });
  } catch (error) {
    console.error("Error decrementing credits:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
