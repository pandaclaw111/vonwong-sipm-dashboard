# Compound Crisis Calculator — Integration Patch

## ⚠️ FILE CORRUPTION NOTICE

During the editing process, the `index.html` file was corrupted and lost its JavaScript section (all code after line ~1440). The HTML and CSS are intact, but the JavaScript needs to be restored.

## Files Created

1. `compound-calculator-notes.md` — Full documentation
2. `compound-calculator-patch.md` — This file
3. `index.html.corrupted` — Backup of corrupted file

## What Was Built

### 1. CSS Additions (add to existing `<style>` block)

```css
/* COMPOUND CRISIS CALCULATOR */
.scenario-buttons { display: flex; flex-wrap: wrap; gap: 8px; }
.scenario-btn {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 8px; padding: 12px 16px; cursor: pointer;
  transition: all 0.2s; text-align: left; min-width: 180px; flex: 1;
  max-width: 300px;
}
.scenario-btn:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,212,170,0.15); }
.scenario-btn:active { transform: scale(0.98); }
.scenario-btn .s-title { font-weight: 800; font-size: 13px; margin-bottom: 4px; color: var(--text); }
.scenario-btn .s-movements { font-size: 10px; color: var(--text-muted); line-height: 1.4; }
.scenario-btn .s-window { 
  display: inline-block; margin-top: 6px; padding: 2px 8px; 
  background: rgba(255,107,107,0.15); color: var(--danger); 
  border-radius: 4px; font-size: 9px; font-weight: 700;
}
.scenario-btn.active { border-color: var(--accent); background: rgba(0,212,170,0.08); }

.calc-select {
  width: 100%; background: var(--surface2); border: 1px solid var(--border);
  color: var(--text); padding: 10px 12px; border-radius: 8px;
  font-size: 12px; font-family: var(--font); cursor: pointer;
  transition: border-color 0.2s;
}
.calc-select:focus { border-color: var(--accent); outline: none; }
.calc-select option { background: var(--surface2); }

.calculator-result {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 10px; padding: 16px; margin-top: 16px;
}
.calc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 12px; }
.calc-score { font-size: 32px; font-weight: 900; }
.calc-score-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; }
.calc-movements { display: flex; flex-wrap: wrap; gap: 6px; }
.calc-movement-tag { 
  background: rgba(255,255,255,0.08); border-radius: 4px; 
  padding: 4px 10px; font-size: 11px; font-weight: 600;
}

.calc-section { margin-bottom: 16px; }
.calc-section:last-child { margin-bottom: 0; }
.calc-section-title { 
  font-size: 10px; font-weight: 700; text-transform: uppercase; 
  color: var(--text-muted); margin-bottom: 6px; display: flex; align-items: center; gap: 6px;
}
.calc-section-content { font-size: 12px; line-height: 1.7; color: #c8cad8; }

.calc-villain-list { list-style: none; }
.calc-villain-list li { 
  padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
  font-size: 12px; display: flex; align-items: center; gap: 8px;
}
.calc-villain-list li:last-child { border-bottom: none; }

.calc-visual-box {
  background: linear-gradient(135deg, rgba(108,92,231,0.1), rgba(0,212,170,0.05));
  border: 1px solid rgba(108,92,231,0.3); border-radius: 8px;
  padding: 12px 14px;
}
.calc-visual-box .label { 
  font-size: 9px; font-weight: 800; text-transform: uppercase; 
  color: var(--accent4); letter-spacing: 0.5px; margin-bottom: 4px;
}

.calc-window-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255,107,107,0.15); border: 1px solid rgba(255,107,107,0.3);
  border-radius: 6px; padding: 8px 12px; font-size: 12px; font-weight: 700;
  color: var(--danger);
}
.calc-window-badge.warm { background: rgba(255,217,61,0.15); border-color: rgba(255,217,61,0.3); color: var(--warning); }

.calc-explore-btn {
  background: linear-gradient(135deg, var(--accent), #00f5c4);
  border: none; color: #000; padding: 12px 20px; border-radius: 8px;
  font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s;
  margin-top: 16px; width: 100%;
}
.calc-explore-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,212,170,0.3); }

.shared-connection { 
  background: rgba(255,255,255,0.05); border-radius: 6px; 
  padding: 8px 12px; margin-bottom: 6px;
}
.shared-connection .conn-type { 
  font-size: 9px; font-weight: 700; text-transform: uppercase; 
  color: var(--accent); margin-bottom: 2px;
}
.shared-connection .conn-desc { font-size: 11px; color: var(--text-muted); }
```

### 2. HTML Section (add before closing `</div>` of page-network, after the two-col charts)

```html
<!-- COMPOUND CRISIS CALCULATOR -->
<div class="card" id="compound-calculator">
  <div class="card-title" style="color: var(--accent); display: flex; align-items: center; gap: 8px;">
    <span style="font-size: 16px;">🔗</span> Compound Crisis Calculator
  </div>
  <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 16px;">
    Movements rarely tip in isolation. This calculator reveals how crises compound — shared villains, narrative connections, and windows where multiple movements can tip together.
  </p>
  
  <div class="compound-scenarios" id="compound-scenarios">
    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px;">⚡ Prebuilt Compound Scenarios</div>
    <div class="scenario-buttons" id="scenario-buttons"></div>
  </div>
  
  <div class="custom-calculator" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border);">
    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px;">🧮 Custom Compound Calculator</div>
    <div class="calculator-inputs" style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px;">
      <div style="flex: 1; min-width: 200px;">
        <label style="font-size: 10px; color: var(--text-muted); display: block; margin-bottom: 4px;">Movement 1</label>
        <select id="calc-movement-1" class="calc-select"><option value="">Select a movement...</option></select>
      </div>
      <div style="flex: 1; min-width: 200px;">
        <label style="font-size: 10px; color: var(--text-muted); display: block; margin-bottom: 4px;">Movement 2</label>
        <select id="calc-movement-2" class="calc-select"><option value="">Select a movement...</option></select>
      </div>
      <div style="flex: 1; min-width: 200px;">
        <label style="font-size: 10px; color: var(--text-muted); display: block; margin-bottom: 4px;">Movement 3 (optional)</label>
        <select id="calc-movement-3" class="calc-select"><option value="">Select a movement...</option></select>
      </div>
    </div>
    <div id="calculator-result" class="calculator-result" style="display: none;"></div>
  </div>
</div>
```

### 3. JavaScript Data (add to script section)

```javascript
// COMPOUND CRISIS SCENARIOS
const COMPOUND_SCENARIOS = [
  {
    id: 'sacrifice-zone',
    title: '"Sacrifice Zone"',
    movements: ['fast-fashion', 'cobalt-mining', 'indigenous-green'],
    movementNames: ['Fast Fashion', 'Cobalt Mining', 'Indigenous Rights'],
    sharedVillains: [
      { name: 'LVMH', type: 'Fashion/Luxury' },
      { name: 'Apple', type: 'Tech' },
      { name: 'Tesla', type: 'EV/Tech' },
      { name: 'H&M', type: 'Fast Fashion' },
      { name: 'Shein', type: 'Ultra-Fast Fashion' }
    ],
    narrative: 'The same communities are stripped for your phone, your car, and your clothes.',
    visualGap: 'Side-by-side of Atacama textile graveyard and DRC cobalt mine — same sky, different extraction.',
    historicalParallel: 'Colonial extraction zones — rubber in Congo, silver in Potosí, cotton in the American South.',
    window: 'Q2 2026',
    windowDetail: 'EU Battery Regulation enforcement + Shein IPO scrutiny peak',
    windowHot: true
  },
  {
    id: 'democracy-siege',
    title: '"Democracy Under Siege"',
    movements: ['us-democracy', 'sk-democracy', 'kenya-genz', 'france-right'],
    movementNames: ['US Anti-Authoritarianism', 'South Korea Democracy', 'Kenya Gen Z', 'France Far-Right Rise'],
    sharedVillains: [
      { name: 'Authoritarian-aligned billionaires', type: 'Finance' },
      { name: 'Social media platforms', type: 'Tech/Disinformation' }
    ],
    narrative: "Democracy isn't dying — it's being defended by young people on every continent.",
    visualGap: 'Four protest photos, four countries, one gesture — hands up.',
    historicalParallel: '1989 — Berlin Wall, Tiananmen, Velvet Revolution.',
    window: 'Nov 2026',
    windowDetail: 'US Midterms + COP31',
    windowHot: true
  },
  {
    id: 'invisible-poison',
    title: '"The Invisible Poison"',
    movements: ['microplastics', 'pfas', 'fast-fashion', 'plastics-treaty'],
    movementNames: ['Microplastics', 'PFAS Forever Chemicals', 'Fast Fashion', 'Plastics Treaty'],
    sharedVillains: [
      { name: 'BASF', type: 'Chemicals' },
      { name: 'Dow Chemical', type: 'Chemicals' },
      { name: 'DuPont/Chemours', type: 'Chemicals/PFAS' },
      { name: '3M', type: 'Chemicals/PFAS' }
    ],
    narrative: "It's in your blood, your heart, your brain — and they've known for decades.",
    visualGap: 'Human body cross-section showing where microplastics accumulate — the body as evidence.',
    historicalParallel: 'Lead in gasoline, asbestos, tobacco. Same playbook.',
    window: 'Ongoing',
    windowDetail: 'Any PFAS/microplastics science announcement',
    windowHot: false
  },
  {
    id: 'ai-contradiction',
    title: '"The AI Contradiction"',
    movements: ['ai-labor', 'ai-surveillance', 'digital-rights'],
    movementNames: ['AI Displacement', 'AI Surveillance', 'Digital Rights'],
    sharedVillains: [
      { name: 'Alphabet/Google', type: 'Big Tech' },
      { name: 'Meta', type: 'Big Tech' },
      { name: 'Microsoft', type: 'Big Tech' },
      { name: 'Amazon', type: 'Big Tech' }
    ],
    narrative: 'The same system that watches you, replaces you, and melts glaciers to run.',
    visualGap: 'A data center consuming a river to power a surveillance camera pointing at a protest.',
    historicalParallel: 'Industrial Revolution — machines replaced workers, created fortunes.',
    window: 'EU AI Act Milestones 2026',
    windowDetail: 'EU AI Act enforcement milestones',
    windowHot: false
  },
  {
    id: 'green-sacrifice',
    title: '"Green Sacrifice"',
    movements: ['cobalt-mining', 'deep-sea-mining', 'fossil-subsidies', 'loss-damage'],
    movementNames: ['Cobalt Mining', 'Deep Sea Mining', 'Fossil Fuel Subsidies', 'Loss & Damage'],
    sharedVillains: [
      { name: 'The Metals Company', type: 'Deep Sea Mining' },
      { name: 'Glencore', type: 'Mining' },
      { name: 'Shell/BP/ExxonMobil', type: 'Fossil Fuels' }
    ],
    narrative: "The green transition is being built on the same bodies it promised to save.",
    visualGap: 'EV charging station built on a cobalt mine — the clean energy contradiction.',
    historicalParallel: 'Colonial "development" projects — green colonialism.',
    window: 'ISA session March 2026',
    windowDetail: 'ISA sessions, EU Battery Regulation, COP finance',
    windowHot: true
  }
];

// Villain database for custom calculator
const VILLAIN_DATABASE = {
  'fast-fashion': ['LVMH', 'H&M', 'Zara/Inditex', 'Shein', 'ASOS', 'Primark'],
  'cobalt-mining': ['Apple', 'Tesla', 'Microsoft', 'Google', 'Samsung', 'Glencore'],
  'indigenous-green': ['Mining corporations', 'Agribusiness', 'Energy companies'],
  'plastics-treaty': ['ExxonMobil', 'Shell', 'SABIC', 'Dow', 'American Chemistry Council'],
  'microplastics': ['Petrochemical industry', 'Textile manufacturers'],
  'pfas': ['3M', 'DuPont/Chemours', 'BASF', 'Solvay'],
  'ai-labor': ['Alphabet', 'Meta', 'Microsoft', 'Amazon', 'OpenAI'],
  'ai-surveillance': ['Alphabet', 'Meta', 'Amazon', 'Palantir', 'Clearview AI'],
  'digital-rights': ['Meta', 'Alphabet', 'TikTok/ByteDance'],
  'deep-sea-mining': ['The Metals Company', 'GSR'],
  'fossil-subsidies': ['Shell', 'BP', 'ExxonMobil', 'Chevron', 'Saudi Aramco'],
  'loss-damage': ['Major emitting nations', 'Fossil fuel companies'],
  'us-democracy': ['Political operatives', 'Dark money groups'],
  'sk-democracy': ['Political actors'],
  'kenya-genz': ['Kenyan government', 'IMF'],
  'france-right': ['RN/Le Pen', 'Far-right media']
};
```

### 4. JavaScript Functions (add to script section)

See `compound-calculator-notes.md` for full function implementations:
- `renderCompoundCalculator()`
- `showScenario(scenarioId)`
- `calculateCustomCompound()`
- `openCompoundModal(scenarioId)`
- `openCustomCompoundModal(movements)`

### 5. Event Listeners (add to DOMContentLoaded)

```javascript
// Compound Calculator events
document.getElementById('scenario-buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('.scenario-btn');
  if (btn && btn.dataset.scenario) {
    showScenario(btn.dataset.scenario);
  }
});

['calc-movement-1', 'calc-movement-2', 'calc-movement-3'].forEach(id => {
  document.getElementById(id).addEventListener('change', calculateCustomCompound);
});

// Add to render calls:
renderCompoundCalculator();
```

## Recovery Steps

1. Get a clean copy of the original `index.html` (before March 15 edits)
2. Apply the CSS additions to the `<style>` block
3. Add the HTML section inside `#page-network`, after the two-col charts
4. Add the JavaScript data and functions to the `<script>` block
5. Add the event listeners to `DOMContentLoaded`

## What the Calculator Does

- **5 Prebuilt Scenarios**: Curated compound crises with full analysis
- **Custom Calculator**: Select 2-3 movements from dropdowns
- **Analysis Shows**:
  - Combined SIPM score (average + connection bonus)
  - Shared villains across movements
  - Narrative connections
  - "The Image That Hasn't Been Made"
  - Historical parallels
  - Best trigger windows
