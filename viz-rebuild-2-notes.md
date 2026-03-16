# Network Visualization Rebuild v2 — Notes

**Date:** 2026-03-15  
**Engineer:** Subagent (Frontend + Data Viz)

---

## Summary

Major rebuild of the SIPM dashboard network visualization and legend system. Transformed the basic static legend into a full **Interactive Control Panel** with filtering, edge type visualization, trajectory tracking, and Benjamin's Lens feature.

---

## Changes Made

### 1. Interactive Legend Control Panel (New)

Replaced the basic legend with a proper sidebar/panel control system:

**Section 1: Node Size = SIPM Score**
- Visual scale with 3 clickable node sizes
- High (20-25), Medium (14-19), Low (<14)
- Click to filter to that size bracket

**Section 2: Node Color = Category**
- 6 category filters with color swatches
- Climate (teal), Democracy (amber), Labor (red), Health (purple), Digital (blue), Indigenous (orange)
- Click to filter; shows count next to each

**Section 3: Edge Type Filter (NEW KEY FEATURE)**
- 4 distinct edge types with visual styles:
  - 🔴 **Compound Crisis** — thick orange dashed line (10 edges)
  - 🔵 **Shared Actors** — medium blue solid line (6 edges)
  - 🟢 **Narrative Dependency** — thin green dotted line (6 edges)
  - 🟡 **Geographic Overlap** — thin yellow line (6 edges)
- Toggle each type on/off with checkboxes
- Default: all shown

**Section 4: Trajectory Filter (NEW)**
- 🔴 Tipping Now | 🟡 Building | 🟢 Early Stage
- Click to show only movements at that stage

**Section 5: Benjamin's Lens Toggle (UNIQUE)**
- Toggle ON: highlights only movements with visual opportunities
- Shows glowing ring around Benjamin-opportunity nodes
- Non-opportunity nodes fade to 30% opacity

### 2. Network Interconnections (Expanded)

Added **28 typed edges** telling the story of how movements connect:

**Compound Crisis (10):**
- Fast Fashion ↔ Plastics Treaty (same material system)
- Fast Fashion ↔ Indigenous Rights (Atacama sacrifice zone)
- Fast Fashion ↔ Deep Sea Mining (resource extraction logic)
- Cobalt Mining ↔ Indigenous Rights (same communities)
- Cobalt Mining ↔ Fast Fashion (same supply chain logic)
- Iran War ↔ Fossil Fuel Subsidies (same economic actors)
- Iran War ↔ Loss & Damage (compound crisis amplifier)
- AI Displacement ↔ Global Debt Crisis (economic precarity)
- Plastics Treaty ↔ Microplastics (same pollution chain)
- Food System ↔ Water Rights (same agricultural system)

**Shared Actors (6):**
- Plastics Treaty ↔ Indigenous Rights (petrostate + indigenous land)
- AI Displacement ↔ AI Surveillance (same tech companies)
- Digital Rights ↔ AI Surveillance (same legislative battles)
- Fast Fashion ↔ Anti-Austerity (same low-income workers)
- Fossil Subsidies ↔ Loss & Damage (same blocking governments)
- Deep Sea Mining ↔ Pacific ICJ (same Pacific nations)

**Narrative Dependency (6):**
- Pacific ICJ ↔ Loss & Damage (ICJ strengthens L&D legal case)
- MeToo ↔ US Democracy (same permission structure shift)
- Kenya Gen Z ↔ South Korea Democracy (leaderless model)
- Microplastics ↔ Plastics Treaty (science builds narrative)
- Water Rights ↔ Fast Fashion (Atacama water/dye connection)
- PFAS ↔ Plastics Treaty (forever chemicals urgency)

**Geographic Overlap (6):**
- Brazil Land Rights ↔ Loss & Damage (Amazon/COP30)
- Pacific ICJ ↔ Deep Sea Mining (Pacific Ocean)
- Kenya Gen Z ↔ Global Debt Crisis (same economic pressure)
- Indigenous Rights ↔ Brazil Land Rights (Global South)
- France Far-Right ↔ US Democracy (same authoritarian wave)
- South Korea ↔ US Democracy (democratic backsliding pattern)

### 3. Polycrisis Clusters Visual (NEW)

Desktop force graph now shows:
- Soft ellipse backgrounds behind each category cluster
- Semi-transparent fills with subtle strokes
- Makes clustering visually obvious before hover

### 4. Enhanced Tooltips (Improved)

On hover/touch, tooltips now show:
- Movement name
- Category with color indicator
- SIPM score with trajectory badge (Tipping/Building/Early)
- Description
- Connected movements count with first 3 listed
- Connection type indicators (colored dots)
- "Tap to explore →" hint

### 5. Mobile Improvements

- Legend panel collapses by default (starts hidden)
- "▼ Expand" button to reveal filters
- Bubble pack layout preserved
- Touch-friendly tap handling
- Benjamin's Lens glow visible on mobile
- Category filter buttons remain at top for quick access

### 6. Responsive Design

- **Desktop (≥1024px):** Side-by-side layout with sticky legend panel (280px)
- **Tablet (768-1023px):** Legend above network, collapsible
- **Mobile (<768px):** Legend collapsed, expand on demand, bubble pack view

---

## Technical Implementation

### State Management

```javascript
let activeFilters = {
  category: 'All',              // Filter by category
  edgeTypes: ['compound', 'actors', 'narrative', 'geographic'],
  trajectory: null,             // null = all, or 'tipping'/'building'/'early'
  sizeFilter: null,             // null = all, or 'high'/'medium'/'low'
  benjaminLens: false           // Highlight visual opportunities
};
```

### Edge Rendering

Edges use distinct visual styles:
- **Compound:** 3px width, dashed (`6,3`), orange
- **Actors:** 2px width, solid, blue
- **Narrative:** 1.5px width, dotted (`3,3`), green
- **Geographic:** 1.5px width, solid, yellow

### Node Rendering with Benjamin's Lens

When Benjamin's Lens is active:
```javascript
// Glow ring around opportunity nodes
nodeG.filter(d => d.benjamin)
  .append('circle')
  .attr('r', d => d.radius + 8)
  .attr('stroke', '#00d4aa')
  .attr('filter', 'url(#glow)');

// Fade non-opportunity nodes
.attr('fill-opacity', d => activeFilters.benjaminLens && !d.benjamin ? 0.3 : 0.9)
```

---

## Preserved Functionality

All existing tabs work unchanged:
- ✅ Cases list with search/filter/sort
- ✅ Forecast calendar with events
- ✅ Ecosystem domains and funders
- ✅ Methodology/About page
- ✅ All modals (case detail, candidate, forecast event, network node)
- ✅ Statistics grid
- ✅ Charts (score distribution, outcome distribution)

---

## Design Decisions

1. **Legend as Control Panel:** The legend isn't just explanatory — it's the primary exploration tool. Every element is clickable/toggleable.

2. **Edge Types Tell Stories:** The four edge types correspond to how Benjamin thinks about movement interconnection — not just "related" but WHY they're related.

3. **Benjamin's Lens is Special:** This is a unique filter that surfaces the artist's perspective on where visual intervention could matter most.

4. **Mobile-First Collapse:** On mobile, the full control panel would be overwhelming. Collapse by default, let users expand when curious.

5. **Reset Button:** Given the complexity, a single "Reset All Filters" button is essential for getting back to baseline.

---

## Next Steps (Potential)

1. **Cluster Auto-Zoom:** Double-click a category to zoom into just that cluster
2. **Time Animation:** Show how connections evolved over time
3. **Shareable Filter States:** URL params for specific filter configurations
4. **Export:** PNG/SVG export of current network view
5. **Connection Storytelling:** Click an edge to see the full story of how two movements relate

---

## File

Updated: `/Users/pandaclaw/.openclaw/workspace/dashboard/index.html`

Single HTML file, D3 v7 CDN, dark theme, mobile-responsive.
