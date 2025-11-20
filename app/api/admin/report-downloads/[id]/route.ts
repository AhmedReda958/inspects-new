import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

const updateReportDownloadSchema = z.object({
  status: z
    .enum(["new", "contacted", "qualified", "converted", "rejected"])
    .optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const download = await prisma.reportDownload.findUnique({
      where: { id },
    });

    if (!download) {
      return NextResponse.json(
        { error: "Report download not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: download });
  } catch (error) {
    console.error("Error fetching report download:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = updateReportDownloadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;
    const updateData: any = {};

    if (data.status) updateData.status = data.status;

    const updatedDownload = await prisma.reportDownload.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedDownload });
  } catch (error) {
    console.error("Error updating report download:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

