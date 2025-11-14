import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser, createAuditLog } from "@/lib/auth";

const ruleSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  valueType: z.enum(["number", "boolean", "string"]),
  description: z.string().min(1, "Description is required"),
  category: z.string().default("general"),
  isActive: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rules = await prisma.calculationRule.findMany({
      orderBy: { category: "asc" },
    });

    return NextResponse.json({ success: true, data: rules });
  } catch (error) {
    console.error("Error fetching calculation rules:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Expect array of rules to update
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Expected array of rules" },
        { status: 400 }
      );
    }

    const results = [];
    
    for (const rule of body) {
      const validation = ruleSchema.partial().safeParse(rule);
      
      if (!validation.success) {
        continue;
      }

      if (rule.id) {
        // Update existing rule
        const oldRule = await prisma.calculationRule.findUnique({
          where: { id: rule.id },
        });

        const updated = await prisma.calculationRule.update({
          where: { id: rule.id },
          data: validation.data,
        });

        await createAuditLog({
          userId: user.id,
          action: "UPDATE",
          tableName: "calculation_rules",
          recordId: updated.id,
          oldValues: oldRule,
          newValues: validation.data,
          ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
          userAgent: request.headers.get("user-agent") || undefined,
        });

        results.push(updated);
      }
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Error updating calculation rules:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

