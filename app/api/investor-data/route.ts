import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { getPlatformSnapshot } from "@/lib/investor-platform";

// Admin-gated export of the full investor-platform dataset, in exactly the
// shape the /admin/platform bulk importer accepts.
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getPlatformSnapshot(), {
    headers: {
      "Content-Disposition": 'attachment; filename="investor-platform.json"',
      "Cache-Control": "no-store",
    },
  });
}
