import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { getSessionInvestorId } from "@/lib/investor-auth";
import {
  INVESTOR_FILES_ROUTE,
  isSafeFileName,
  readInvestorPdf,
} from "@/lib/investor-files";
import {
  getDevelopmentDocumentsFor,
  getDocumentsFor,
  getInvestorById,
  getInvestorTier,
  getPositionsFor,
  getUpdates,
} from "@/lib/investor-platform";

// Authenticated downloads for uploaded investor PDFs. Nothing in
// content/investors/files/ is publicly routable; every request must carry
// an admin session, or an investor session with the right to the specific
// document the file belongs to (their own documents, SPV papers for
// vehicles they hold a cap-table position in, or monthly reports for
// their sites). A file no record references is served to no one.
export const dynamic = "force-dynamic";

/** True when this investor may download the file at this portal path. */
function investorMayAccess(investorId: string, filePath: string): boolean {
  const investor = getInvestorById(investorId);
  if (!investor) return false;
  const tier = getInvestorTier(investor);
  if (getDocumentsFor(investorId, tier).some((doc) => doc.file === filePath)) {
    return true;
  }
  if (tier !== "invested") return false;
  const memberDevelopmentIds = new Set(
    getPositionsFor(investorId).map((p) => p.developmentId)
  );
  for (const developmentId of memberDevelopmentIds) {
    if (
      getDevelopmentDocumentsFor(investorId, developmentId).some(
        (doc) => doc.file === filePath
      )
    ) {
      return true;
    }
  }
  return getUpdates().some(
    (update) =>
      update.file === filePath && memberDevelopmentIds.has(update.developmentId)
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  if (!isSafeFileName(name)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const admin = await isAuthenticated();
  if (!admin) {
    const investorId = await getSessionInvestorId();
    if (!investorId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!investorMayAccess(investorId, `${INVESTOR_FILES_ROUTE}/${name}`)) {
      // 404, not 403: don't confirm to a signed-in account that a file it
      // cannot see exists.
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  const content = await readInvestorPdf(name);
  if (!content) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return new NextResponse(new Uint8Array(content), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(content.byteLength),
      "Content-Disposition": `inline; filename="${name}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
