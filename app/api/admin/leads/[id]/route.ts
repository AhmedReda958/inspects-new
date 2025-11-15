import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

const updateLeadSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "converted", "rejected"]).optional(),
  notes: z.string().optional(),
  assignedTo: z.string().optional(),
  followUpDate: z.string().optional(),
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
    const submission = await prisma.calculatorSubmission.findUnique({
      where: { id },
      include: {
        city: true,
        neighborhood: true,
        package: true,
        propertyAge: true,
        inspectionPurpose: true,
        notifications: true,
      },
    });

    if (!submission) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: submission });
  } catch (error) {
    console.error("Error fetching lead:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
    const validation = updateLeadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;
    const updateData: any = {};

    if (data.status) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.assignedTo !== undefined) updateData.assignedTo = data.assignedTo;
    if (data.followUpDate) updateData.followUpDate = new Date(data.followUpDate);

    const updatedLead = await prisma.calculatorSubmission.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

