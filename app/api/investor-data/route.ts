import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { getInvestorPlatformData } from "@/lib/investor-platform";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getInvestorPlatformData(), {
    headers: { "Content-Disposition": 'attachment; filename="investor-platform.json"' },
  });
}
