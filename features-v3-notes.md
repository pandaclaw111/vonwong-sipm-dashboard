# SIPM Dashboard v3 Features — Implementation Notes

**Date:** March 15, 2026  
**For:** Benjamin Von Wong  

---

## Features Implemented

### Feature 1: Deploy Window Indicators 🚀🎯👁️💤

Every movement now has a **deployment signal** badge visible on:
- Case cards in the Cases grid
- Candidate cards in Forecast
- Network graph nodes (ACT NOW nodes pulse red)
- Modal views

**Badge Types:**
| Badge | Color | Criteria |
|-------|-------|----------|
| 🚀 ACT NOW | Red (pulsing) | SIPM ≥19 + trigger in 90 days OR already tipping |
| 🎯 PREPARE | Amber | SIPM ≥16 + trigger in 3-6 months |
| 👁️ WATCH | Teal | SIPM 13-18, no near trigger |
| 💤 DORMANT | Gray | SIPM <13 or failed tip |

**Network Visualization:**
- ACT NOW nodes have a subtle pulse animation
- Makes urgent opportunities visible at a glance

---

### Feature 2: Benjamin's Lens Tab 🎯

New dedicated tab in navigation: **"🎯 Benjamin's Lens"**

**Section A: Act Now (sorted by urgency)**
Currently showing 4 ACT NOW movements:
1. **US Democracy / Anti-Authoritarianism** (24/25 ↑↑)
   - Trigger: 25M+ protests, ACLU 400+ cases, Midterms Nov 2026
   - Visual Gap: Democracy WORKING — poll workers, judges, civil servants
   - Partner: ACLU or Protect Democracy
   - Lead Time: 2-4 weeks

2. **Pacific Islands ICJ Climate Opinion** (24/25 ↑↑)
   - Trigger: ICJ opinion delivered July 2025, implementation phase
   - Visual Gap: The Hague courtroom → Tuvalu village underwater
   - Partner: Pacific Island Students Fighting Climate Change
   - Lead Time: 4-8 weeks

3. **Fast Fashion / Atacama / Shein** (21/25 ↑)
   - Trigger: Shein IPO scrutiny, EU Greenwashing Directive Q1 2026
   - Visual Gap: Atacama photographed but not connected to WARDROBES
   - Partner: Fashion Revolution or Ellen MacArthur
   - Lead Time: 6-12 weeks

4. **Iran War / Compound Crisis** (22/25 ↑↑)
   - Trigger: Ongoing conflict, oil volatility, refugee flows
   - Visual Gap: "Every bomb is carbon" — not visualized
   - Partner: International Crisis Group
   - Lead Time: 2-4 weeks

**Section B: The Compound Villains**
7 actors appearing across multiple movements:
- **Saudi Aramco / Saudi Government** — Plastics + Iran + Loss & Damage + OPEC
- **LVMH / Fast Fashion** — Fast fashion + Water + Atacama + Greenwashing
- **Alphabet/Google** — AI surveillance + facial recognition + displacement
- **Amazon** — Labor + Rekognition + indigenous land + e-waste
- **Glencore / Mining** — Cobalt + deep sea + indigenous + climate
- **US Government** — Democracy + Plastics + Loss & Damage + AI weapons
- **Apple** — Cobalt/DRC + privacy contradiction + AI + e-waste

Each villain card shows:
- Which movements they're implicated in (as tags)
- Their specific harm
- Their public claim (the contradiction)
- **Benjamin's angle** — the visual opportunity

**Section C: Pattern Matching**
For each ACT NOW movement, historical parallels:
- US Democracy → South Korea 2016-2017 (institutions held)
- Fast Fashion → Plastic Straw Ban 2015-2018 (viral image → cascade)
- Plastics Treaty → Kyoto failure 2001 (14 years to Paris)
- Pacific ICJ → Urgenda 2019 (legal precedent → 1,800+ cases)

---

### Feature 3: Trajectory Arrows ↑↑↑→↓↓↓

Every score display now includes a **trajectory indicator**:

| Arrow | Color | Meaning |
|-------|-------|---------|
| ↑↑ | Bright green | Rising fast (+3 points in 6 months) |
| ↑ | Teal | Rising (+1-2 points) |
| → | Gray | Stable |
| ↓ | Orange | Declining (post-tip, energy dissipating) |
| ↓↓ | Red | Stalled (failed tip, rebuilding) |

Trajectories assigned based on:
- Recent news and developments
- Movement activity indicators
- Policy/institutional changes
- Media attention trends

---

## Data Sources for Assignments

**Deploy Windows assigned based on:**
- SIPM score (from 100-case library)
- Upcoming trigger events (from forecast calendar)
- Current movement momentum
- Policy windows (elections, treaty negotiations, court decisions)

**Trajectories assigned based on:**
- 2024-2026 news analysis
- Academic movement tracking
- Policy implementation status
- Organizational activity levels

---

## Technical Implementation

- All existing tabs preserved (Network, Cases, Forecast, Ecosystem, About)
- New tab inserted after Forecast in nav
- Deploy badges use CSS animation for ACT NOW pulse
- Trajectory arrows use color-coded spans
- Network graph highlights ACT NOW nodes with drop-shadow animation
- Responsive grid layouts for all new sections

---

## Next Steps / Future Enhancements

1. **Live data updates** — Connect to real-time news APIs
2. **Historical trajectory charts** — Show score changes over time
3. **Alert system** — Push notifications when movements shift to ACT NOW
4. **Visual opportunity database** — Catalog what's been made vs. gaps
5. **Partnership tracker** — CRM for org relationships
6. **Campaign calendar integration** — Sync with Benjamin's production schedule

---

*Built by PandaClaw for Benjamin Von Wong / Activism.Studio*
