# Network Visualization Rebuild Notes

**Date:** March 15, 2026
**Author:** PandaClaw

## What Changed

Replaced the unusable force-directed "hairball" network with a clean, WEF-inspired risk map.

### Two-Mode Responsive Design

1. **Desktop (≥768px):** Grouped force-directed layout
   - Nodes clustered by category (Climate, Democracy, Labor, Health, Digital, Indigenous)
   - Custom cluster force pulls nodes toward category centers
   - Top 25 movements only (not all 100)
   - Hover dims unconnected nodes, highlights edges
   - Labels shown for score ≥20 nodes

2. **Mobile (<768px):** D3 bubble pack layout
   - Zoomable/scrollable circle packing
   - Bubbles sized by SIPM score squared (area-proportional)
   - Colored by category
   - Tap to open detail modal
   - Much more usable on phone

### Node Data (Top 25 by SIPM)

Used the specified 25 movements with their categories:
- Climate: Fast Fashion, Plastics Treaty, Pacific ICJ, Loss & Damage, Deep Sea Mining, COP31, Iran War, Fossil Subsidies, Water Rights, Food System
- Democracy: US Anti-Authoritarianism, Kenya Gen Z, France Far-Right, South Korea, MeToo
- Labor: Anti-Austerity, AI Displacement, Global Debt Crisis
- Health: PFAS, Microplastics
- Digital: AI Surveillance, Digital Rights
- Indigenous: Indigenous Rights, Brazil Land, Cobalt Mining

### Edge/Connection Types

Defined 23 meaningful connections across 4 types:
- **Compound crisis:** Same system (e.g., Fast Fashion ↔ Plastics, AI Labor ↔ AI Surveillance)
- **Shared actors:** Same corporations/governments
- **Narrative dependency:** One movement's success helps another
- **Geographic overlap:** Same region

### Visual Design

- Dark background (#0a0a0f with radial gradient)
- Category colors per spec:
  - Climate: #00c8a0 (teal)
  - Democracy: #f59e0b (amber)
  - Labor: #ef4444 (red)
  - Health: #8b5cf6 (purple)
  - Digital: #3b82f6 (blue)
  - Indigenous: #f97316 (orange)
- Edge colors: dim by default (#ffffff12), bright on hover (#ffffff60)
- Compound crisis edges are thicker/solid; narrative edges are dashed
- Node labels only for top-scored movements

### Category Filters

Added filter buttons at top:
- All | Climate | Democracy | Labor | Health | Digital | Indigenous
- Clicking filters both nodes AND edges to that category
- Smooth re-render when filter changes

### Interactions

- **Hover (desktop):** Dims other nodes, highlights connected edges, shows tooltip
- **Click/Tap:** Opens custom modal with movement details and connections list
- **Drag (desktop):** Can drag nodes around
- **Mobile hint:** "👆 Tap bubbles for details" shown only on mobile

### Legend

Updated legend to show:
- All 6 category colors
- Edge type indicators (compound vs shared actors)
- Note that node size = SIPM score

## Technical Notes

- D3 v7 from CDN
- All inline, no external files
- Custom forces: `forceCluster` (pulls nodes to category centers), `forceBounds` (keeps in view)
- Uses `d3.pack()` for mobile bubble layout
- Network modal (`openNetworkNodeModal`) separate from case modal (`openCaseModal`)
- All other tabs (Cases, Forecast, Ecosystem, About) unchanged and fully functional

## What Makes This Better

1. **Readable:** Only 25 nodes vs 100 = no hairball
2. **Hierarchy:** Node size shows importance at a glance
3. **Meaningful clusters:** Category grouping shows systemic relationships
4. **Mobile-first:** Bubble pack actually works on phone
5. **Focused edges:** Only showing meaningful connections, not "related"
6. **Interactive:** Hover/tap reveals context without clutter
7. **Filterable:** Can focus on single category when needed

## Files Modified

- `/Users/pandaclaw/.openclaw/workspace/dashboard/index.html` — full replacement
- Created this notes file
