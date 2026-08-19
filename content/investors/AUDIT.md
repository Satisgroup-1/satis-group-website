# Investor platform sample-data audit

**Date:** 19 August 2026
**Scope:** every dataset in `content/investors/` (`developments`, `cap-tables`, `cash-events`, `investors`, `updates`, `documents`, `opportunities`, `insights`, `market-fallback`), cross-checked against each other and against the public site content in `lib/property-pages.ts`, `app/about/page.tsx` and `app/page.tsx`.

The investor platform data is sample/seed data. Much of it is internally consistent, but a number of records contradict the public website (which appears to be the authoritative, client-supplied content), and all of the financial figures are invented and need replacing or confirming before real investors see them. Items needing client input are marked **[NEEDS INFO]**.

---

## 1. What checks out (verified)

- **Cap-table arithmetic reconciles everywhere.** For every SPV, the sum of `committed` equals the SPV's `totalCommitted` in `developments.json`, the `sharePercent` values sum to 100, and each holder's percentage matches their committed share pro-rata (e.g. Barrington Road: 700k + 933k + 700k = £2,333k; 933/2,333 = 40%).
- **Elm Row Capital's derived portfolio matches its stored history.** 20% × Court House equity £5.05m + 25% × Davenport equity £2.36m = £1.60m, which equals the Q3 2026 point in `investors.json` `valueHistory`.
- **Opportunity statuses are consistent with their close dates.** Woodfield Road (fully subscribed) closed 15 May 2026 (past); QUBE (open) closes 31 Oct 2026; St John's Corner II (coming soon) closes 31 Jan 2027.
- **The "-21% Stockport vs Trafford" stat** in the "Finding value beyond the core" insight matches the market table (304.9/386.2 − 1 = −21%).
- **The submarket table** in "Greater Manchester living" matches `market-fallback.json` exactly, and that table is superseded at runtime by the live HM Land Registry HPI feed (`lib/market-data.ts`), which is the right design. (The live API could not be reached from this audit environment — network egress blocked — so the fallback figures were sanity-checked against memory only: they are in a plausible range for mid-2026.)

---

## 2. Contradictions with the public website

The public portfolio pages (`lib/property-pages.ts`) disagree with the investor data on several schemes. One of the two is wrong in each case.

| # | Scheme | Investor platform says | Public site says | Issue |
|---|--------|------------------------|------------------|-------|
| 1 | **Barrington Road / Barrington House** | Under construction, 34% complete, "Structure" phase; July report: groundworks just completed, frame starting. Described as "townhouses and duplexes around a shared garden square". | **Completed and tenanted** — rooms To Let via SpareRoom from £995 pcm; finished-interior photo gallery. Described as a collection of residences (one-beds, two-beds, en-suite rooms). | **[NEEDS INFO]** Direct contradiction on both build status and product type. |
| 2 | **Davenport Park** | Under construction, 47%, frame at level three, tower crane down in October. | **Completed** residential development. | **[NEEDS INFO]** Direct contradiction. |
| 3 | **Court House / The Courthouse** | "Planning" phase, 18%, pre-construction for a next phase; **GDV £22.1m** — the largest in the portfolio. | Completed conversion of **13 apartments**, currently For Sale. | **[NEEDS INFO]** £22.1m GDV is implausible for 13 apartments in Macclesfield. Is there genuinely a Phase II with its own appraisal, and what is its real GDV? |
| 4 | **QUBE** | (opportunities.json) "design-led **workspace** over an activated ground floor". | Mixed-use redevelopment of **58 apartments and two commercial units** (formerly Petersgate House). | **[NEEDS INFO]** Wrong asset class in the raise description. |
| 5 | **St John's Corner, Phase II** | "Extending the restored-**workspace** cluster… adjacent to the **fully-let Phase I**". | St John's Corner is a **residential** scheme of eleven apartments at 3–5 St John Street, status "Coming Soon" (so nothing is "fully let"). | **[NEEDS INFO]** Wrong asset class, and "fully-let Phase I" matches nothing on the public site. If Phase I means 22 St John Street, the insights article only claims interest "covering the building more than twice over", not fully let. |
| 6 | **Woodfield Road** | "A **mews infill of eight family houses** behind Woodfield Road", quarterly reporting begins Q4 2026. | A completed **mixed-use corner building**: commercial unit behind a restored shopfront with homes above. | **[NEEDS INFO]** Wrong description of the product; and if the scheme is already completed, "first investor report alongside groundworks completion" is stale. |
| 7 | **Chester House / Hazelgate address** | "Chester House, **Chester Road**, Hazel Grove". | Public page address is "**London Road**, Hazel Grove" — but the same page's intro copy also says "the former Chester House on Chester Road". | **[NEEDS INFO]** The public site contradicts itself; the A6 through Hazel Grove is London Road. Which address is correct? (Affects the map pin too.) |
| 8 | **22 St John Street** | August report: "the first **show apartment** has been handed over to the **sales** team". Progress 76%, fit-out. | Workspace scheme (offices To Let), launched August 2026. | "Show apartment"/"sales team" is residential language for an office scheme — should presumably be "show suite"/"lettings team". Also confirm the real progress/phase given the launch has happened. |
| 9 | **Barnett House / Tabula** | 58% complete, weather-tight, first-fix MEP. | Status "Coming Soon". | Likely just public-page lag, but **[NEEDS INFO]** confirm real build status. |

### Portfolio-level totals

| Claim | Where | Value |
|-------|-------|-------|
| Sum of the six live-scheme GDVs in `developments.json` | Investor platform | **£89.6m** |
| "A £38m pipeline… 109,000 sq ft" | About page | **£38m** |
| "£120m in gross development value delivered" | Homepage / meta description | £120m (historic) |
| "6 live developments across three towns and the city core" | Insight "Why we stay in Greater Manchester" | 6 |
| "10 developments delivered and underway" | About page stats | 10 |

**[NEEDS INFO]** The £89.6m of live GDV in the investor platform cannot be reconciled with the £38m pipeline on the About page. Which figure is real? (The individual GDV, equity value, senior debt and IRR figures per scheme all need real numbers regardless — see §4.)

Also note the "Why we stay in Greater Manchester" insight positions the firm as Greater Manchester-only, while Court House is in **Macclesfield (Cheshire East)** — worth a caveat or rewording.

---

## 3. Internal contradictions between investor datasets

1. **Pipeline sequencing disagrees between `documents.json` and `opportunities.json`.** Documents describe "The Press, Great Moor" as the appraisal "for the **current raise**" and Springfield House as "the **next scheme** coming to the platform" — but the opportunities list has **QUBE** as the open raise and **St John's Corner II** coming soon, with The Press and Springfield absent. **[NEEDS INFO]** What is the actual raise sequence?
2. **Insight "Finding value beyond the core"** lists the firm's *Altrincham* exposure as "Chester House, Barrington Road" and *Stockport* exposure as "Court House, Davenport, QUBE". Per every other dataset, **Chester House is in Hazel Grove (Stockport borough), not Altrincham**, and **Court House is in Macclesfield, not Stockport**. The same article refers to "Chester House's **leasing** performance through 2026" — Hazelgate is a for-sale scheme (reservations open, sales handled in-house).
3. **Insight "The case for character-led offices"** names **Court House** as one of the office schemes "completing into the 2027–28 window" — the public site says it is a completed residential conversion. It also implies 22 St John Street completes into 2027–28, while `updates.json` says handover is autumn 2026.
4. **Cash-event type vs SPV structure.** Every opportunity is structured as "ordinary shares in a single-asset SPV", yet Elm Row's June 2026 cash event is an "**Interest payment**". Ordinary equity pays distributions/dividends; interest implies loan notes. **[NEEDS INFO]** What instrument do investors actually hold, and what should cash events be called?
5. **Capital call after full commitment.** Elm Row shows £950k committed and "Active" on Court House, plus a **forecast £150k capital call** in October 2026. Fine if commitments are drawn in tranches, but the data model doesn't distinguish committed vs drawn. **[NEEDS INFO]** Confirm intended mechanics.

---

## 4. Placeholder data that needs real values (or explicit demo labelling)

None of the following can be verified from any source in the repository and all of it is investor-facing financial information. Under UK financial-promotion rules this needs to be right (or clearly marked as illustrative) before launch:

- **`developments.json`** — every `gdv`, `progress`, `phase`, `status`, `nextReport`, and every SPV `equityValue`, `totalCommitted`, `seniorDebt`, `forecastIrr`.
- **`cap-tables.json`** — all holders, commitments and percentages. "**The Hartwell Partnership**" and "**Elm Row Capital**" appear to be invented names — confirm they don't collide with real parties, or replace with real (consented) holders.
- **`investors.json`** — "Elm Row Capital / sarah@elmrowcapital.co.uk" demo account and its entire `valueHistory`. (The `satis-team` internal account uses the real info@satisgroup.co.uk address — confirm that's intended.)
- **`cash-events.json`** — all three events (amounts, dates, types).
- **`opportunities.json`** — target raises, raised-to-date, minimum commitments, target IRRs/multiples, horizons, close dates, SPV names, "senior debt agreed at 55% LTC", "off-market acquisition exchanging Q4 2026", "fully subscribed in twenty-one days".
- **`updates.json`** — all six monthly reports read as plausible fiction; each needs to be replaced by (or checked against) the real project reports.
- **`documents.json`** — the four prospective-investor documents and three Elm Row documents have no files attached (`file` is unset, so the portal shows a demo action). Real PDFs needed.
- **`insights.json` market statistics** presented as fact and attributed to "Satis Group investment committee/research": 6.2% Grade A vacancy; £45 psf prime rent (+12% in 3 yrs); c. 40% discount to replacement cost; the void/incentive table by building type; ~70% graduate retention; 8–12% Metrolink rent premium; office take-up in Stockport "doubled"; £1bn+ committed Stockport regeneration; £90bn+ city-region economy; "40 min maximum drive time to any site"; "every current scheme within ten minutes of a rail or Metrolink connection". Each needs a source (agency research, ONS, GMCA…) or softening, and the quotes need confirming that an "investment committee" exists and said something like this.
- **`market-fallback.json`** — curated rents/yields (the price columns self-heal from the live HPI feed; the rent and yield columns never do). Confirm the rent figures' source and refresh cadence.

---

## 5. Questions for Satis Group (consolidated)

1. **Which schemes are actually live SPVs on the platform, and at what stage?** The current six (22 St John Street, Barnett House/Tabula, Chester House/Hazelgate, Barrington, Court House, Davenport) include two the public site says are finished (Barrington House, Davenport Park).
2. **Real financials per SPV**: committed equity, current equity value, senior debt, forecast IRR, GDV — or confirmation the platform should launch with clearly-labelled illustrative data.
3. **What is the raise pipeline order?** QUBE → St John's Corner II (per opportunities) or The Press → Springfield House (per documents)?
4. **QUBE, St John's Corner II and Woodfield Road descriptions** — the correct asset mix for each (see §2 rows 4–6).
5. **Hazelgate's street address** — Chester Road or London Road? (Also fixes the public page's self-contradiction.)
6. **Is there a Court House Phase II**, and what is its real scope/GDV?
7. **Pipeline value** — is the live pipeline £38m (About page) or ~£90m (investor platform)?
8. **Investment instrument** — ordinary shares, loan notes, or a mix? (Determines whether cash events are "interest" or "distributions".)
9. **Are "The Hartwell Partnership" and "Elm Row Capital" safe fictional names**, or should the seed data use different placeholders?
10. **Sources for the market statistics** quoted in the insights articles, and confirmation of the "investment committee" attributions.

Until these are answered, treat everything in `content/investors/` as demo data and do not grant real investors access.
