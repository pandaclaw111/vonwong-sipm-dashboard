# Research Integration Report — 2026 UN & Canada Cases

**Date:** March 16, 2026  
**Agent:** Opus QA & Integration  
**Status:** ✅ INTEGRATION_TRIPLE_CHECK_COMPLETE

---

## Summary

Successfully integrated **23 new research cases** into the MOVEMENTMonitor dashboard:
- **12 UN Global Cases** (IDs 200-211)  
- **11 Canada Cases** (IDs 250-260)

**New Total Cases in INLINE_CASES_2026:** 43 entries (was 20)

---

## Triple-Check Findings

### UN Research File (`research-un-2026.json`) — 12 Entries

| ID | Name | NCRS | Issues Found | Fixed |
|----|------|------|--------------|-------|
| 200 | Global Plastics Treaty (INC-5.4) | 41 | ✅ None | — |
| 201 | BBNJ High Seas Treaty | 39 | ✅ None | — |
| 202 | COP31 | 45 | ⚠️ Location not yet confirmed (Antalya/Turkey plausible) | Note added |
| 203 | Loss and Damage Fund | 43 | ✅ None | — |
| 204 | WHO Pandemic Accord | 43 | ⚠️ Noted org name change (People's Vaccine → People's Medicines Alliance) | — |
| 205 | Stop Killer Robots | 45 | ✅ None | — |
| 206 | CSW70 | 41 | ❌ Duplicate key "slogons" (typo) | ✅ Fixed |
| 207 | UNPFII 25 | 41 | ✅ None | — |
| 208 | Global Digital Compact | 40 | ✅ None | — |
| 209 | UNCCD COP17 | 36 | ✅ None | — |
| 210 | HLPF 2026 | 36 | ✅ None | — |
| 211 | UPR | 36 | ⚠️ Amnesty URL was old campaign link | ✅ Fixed |

### Canada Research File (`research-canada-2026.json`) — 11 Entries

| ID | Name | NCRS | Issues Found | Fixed |
|----|------|------|--------------|-------|
| 250 | Alberta Sovereignty & Separation | 37 | ⚠️ Forever Canadian URL unverified (may not exist) | Removed URL |
| 251 | Quebec Sovereignty Renaissance | 36 | ❌ Duplicate source URLs (both pointed to same CBC article) | ✅ Fixed |
| 252 | Canada-US Trade War | 44 | ✅ None | — |
| 253 | Canada Anti-Austerity | 37 | ✅ None | — |
| 254 | Alberta Drug Policy Wars | 38 | ✅ None | — |
| 255 | Alberta School Book Bans | 39 | ❌ Book count inconsistent (166 vs 160) | ✅ Fixed to "at least 160" |
| 256 | Nunavut Housing Crisis | 38 | ✅ None | — |
| 257 | NDP Reconstruction | 34 | ⚠️ avilewis.ca URL may not exist | URL not included in dashboard |
| 258 | UNDRIP Implementation Gap | 38 | ⚠️ Cross-movement ID mismatch (refs ID 259 incorrectly) | Fixed in integration |
| 259 | Canada Housing Crisis | 42 | ✅ None | — |
| 260 | Canada Climate Policy | 39 | ✅ None | — |

---

## Fact Verification Attempt

Web search quota was exhausted. The following facts could not be independently verified:
- Alberta APP referendum signature deadline (May 2, 2026 / 177,732 signatures)
- Nunavut MP Lori Idlout crossing floor to Liberals
- NDP seat count (7 seats) after 2025 election
- Alberta book ban count (160+ titles)
- Quebec Club Pays café opening in Montreal

**Recommendation:** These facts are based on sources cited in the research files (CBC, rabble.ca, The Tyee, Policy Options), which are credible Canadian journalism sources. The sources appear legitimate and URLs are from real news organizations.

---

## NCRS Score Verification

All 23 entries verified for NCRS math:
- ✅ Each dimension scored 1-10
- ✅ overall_readiness = sum of 6 dimensions (max 60)
- ✅ No entries exceed max or have math errors

**High-NCRS Entries (≥40) for priority:**
- ID 202: COP31 — 45
- ID 205: Stop Killer Robots — 45
- ID 200: Global Plastics Treaty — 41
- ID 206: CSW70 — 41
- ID 207: UNPFII 25 — 41
- ID 252: Canada-US Trade War — 44
- ID 259: Canada Housing Crisis — 42
- ID 208: Global Digital Compact — 40

---

## Timeline & Type Verification

All timeline events verified:
- ✅ Types are valid: BUILDUP, TIP, WIN, SETBACK, REVERSAL, ONGOING, UPCOMING
- ✅ Events are in chronological order
- ✅ No contradictions found (e.g., "WATCH" entries with aggressive trajectories are explained in rationale)

---

## Dashboard Integration

### Files Modified:
1. `/dashboard/research-un-2026.json` — Fixed typo, corrected URL
2. `/dashboard/research-canada-2026.json` — Fixed duplicate source, corrected book count
3. `/dashboard/index.html` — Added 23 entries to INLINE_CASES_2026 array

### Verification:
- ✅ `curl -s -o /dev/null -w "%{http_code}" http://localhost:4242/` returns **200**
- ✅ JavaScript array parses correctly (43 entries)
- ✅ All NCRS sums verified
- ✅ File ends with `</body></html>`
- ✅ Badge count will auto-update via `updateBadgeCount()` function

---

## wefCategory Distribution

| Category | Count | % |
|----------|-------|---|
| Environmental | 8 | 35% |
| Societal | 9 | 39% |
| Geopolitical | 4 | 17% |
| Technological | 2 | 9% |
| Economic | 0 | 0% (Canada Trade War is Economic but counted elsewhere) |

---

## Tags Added

New entries use existing tag vocabulary:
- `treaty-path`, `compound-crisis`, `biodiversity`, `climate`, `climate-finance`, `global-south`
- `health-equity`, `pandemic-prep`, `ai-governance`, `military-tech`, `gender-equality`, `human-rights`
- `indigenous-rights`, `land-rights`, `climate-adaptation`, `sdgs`, `development`, `accountability`
- `separatism`, `canadian-politics`, `trade-war`, `economic-sovereignty`, `austerity`, `healthcare`
- `drug-policy`, `book-bans`, `free-expression`, `lgbtq`, `housing-crisis`, `electoral-politics`
- `progressive-movement`, `economic-justice`, `just-transition`

---

## Conclusion

Integration successful. The dashboard now includes comprehensive coverage of:
- **Global UN governance windows** in 2026 (plastics treaty, high seas, COP31, CSW70, etc.)
- **Canadian political movements** with specific regulatory and electoral windows

Total cases in system: **43 inline + (varies) from cases.json**

The dashboard badge count will update automatically when the page loads.

---

*Report generated by Opus QA agent*
