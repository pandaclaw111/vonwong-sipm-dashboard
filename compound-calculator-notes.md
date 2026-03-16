# Compound Crisis Calculator — Implementation Notes

## Overview

The Compound Crisis Calculator is a new section added to the SIPM Dashboard's Network tab. It helps activists understand how movements intersect and amplify each other, revealing compound crises that are more powerful than individual movements.

## Features

### 1. Prebuilt Compound Scenarios (5 curated)

Each scenario includes:
- **Title** — Memorable name for the compound
- **Movements** — 2-4 movements that compound together
- **Shared Villains** — Corporations/governments implicated across ALL movements
- **Compound Narrative** — 2-3 sentence narrative linking them
- **The Image That Hasn't Been Made** — Visual gap / opportunity
- **Historical Parallel** — Precedent for this compound
- **Best Trigger Window** — When all movements are elevated simultaneously

#### The 5 Scenarios:

1. **"Sacrifice Zone"** — Fast Fashion + Cobalt Mining + Indigenous Rights
   - Window: Q2 2026 (EU Battery Regulation + Shein scrutiny)
   
2. **"Democracy Under Siege"** — US + South Korea + Kenya Gen Z + France Far-Right
   - Window: Nov 2026 US Midterms + COP31
   
3. **"The Invisible Poison"** — Microplastics + PFAS + Fast Fashion + Plastics Treaty
   - Window: Ongoing (frequent science announcements)
   
4. **"The AI Contradiction"** — AI Displacement + AI Surveillance + Digital Rights
   - Window: EU AI Act enforcement milestones 2026
   
5. **"Green Sacrifice"** — Cobalt Mining + Deep Sea Mining + Fossil Fuel Subsidies + Loss & Damage
   - Window: ISA session March 2026 ongoing

### 2. Custom Calculator

Users can:
- Select 2-3 movements from dropdowns (populated from NETWORK_NODES)
- See dynamically generated analysis:
  - Combined SIPM score (average + connection bonus)
  - Shared connections from NETWORK_EDGES
  - Shared villains (from VILLAIN_DATABASE)
  - Simple narrative template
  - "Explore" button for full modal analysis

## Data Structures

### COMPOUND_SCENARIOS
Array of prebuilt scenarios with full analysis data.

### VILLAIN_DATABASE
Object mapping movement IDs to arrays of associated villains (corporations, lobby groups, governments).

## Scoring Logic

1. **Base Score**: Average SIPM of selected movements
2. **Connection Bonus**: +0.5 for each shared connection in NETWORK_EDGES
3. **Combined Score**: min(25, base + bonus)

## UI Components

- **Scenario Buttons**: Card-based, show title, movements, and window badge
- **Custom Calculator**: Three dropdowns with real-time calculation
- **Result Display**: Card showing score, connections, villains, narrative
- **Explore Modal**: Full analysis with all fields

## CSS Classes

- `.scenario-btn` — Prebuilt scenario button
- `.calc-select` — Calculator dropdown
- `.calculator-result` — Results container
- `.calc-section` — Section within results
- `.calc-villain-list` — Villain list styling
- `.calc-visual-box` — "Image that hasn't been made" highlight
- `.calc-window-badge` — Trigger window badge
- `.calc-explore-btn` — Full analysis button
- `.shared-connection` — Network connection display

## Functions

- `renderCompoundCalculator()` — Initialize UI and populate dropdowns
- `showScenario(scenarioId)` — Display prebuilt scenario analysis
- `calculateCustomCompound()` — Calculate and display custom compound
- `openCompoundModal(scenarioId)` — Open full modal for prebuilt scenario
- `openCustomCompoundModal(movements)` — Open full modal for custom compound

## Integration Points

- Uses `NETWORK_NODES` for movement data
- Uses `NETWORK_EDGES` for connection detection
- Uses `CATEGORY_COLORS` for visual consistency
- Reuses existing modal system
- Follows existing dark theme design

## Future Enhancements

- Add more prebuilt scenarios as new compound crises emerge
- Expand VILLAIN_DATABASE with more detailed corporate data
- Add "Save compound" functionality
- Add "Share compound" with URL parameters
- Connect to external data sources for real-time updates
