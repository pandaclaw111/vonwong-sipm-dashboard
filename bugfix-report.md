# SIPM Dashboard Bug Fix Report
**Date:** March 15, 2026  
**Fixed by:** PandaClaw (Subagent)

---

## Issues Reported
1. **Weird side-scrolling** on some pages/tabs — horizontal overflow
2. **Boxes and fields not clickable** — interactive elements not responding reliably

---

## Bugs Found & Fixes Applied

### Side-Scrolling Issues

| Bug | Location | Fix |
|-----|----------|-----|
| Missing `box-sizing` on pseudo-elements | Global CSS | Added `*, *::before, *::after { box-sizing: border-box; }` |
| No `overflow-x: hidden` on html | `html` selector | Added `overflow-x: hidden` |
| Missing `overflow-x: hidden` on page containers | `.page` class | Added `overflow-x: hidden; width: 100%;` |
| Calendar track using `min-width: max-content` | `.calendar-track` | Changed to `width: max-content` (allows parent's `overflow-x: auto` to work properly) |
| Calendar wrap not extending to edges for proper scroll | `.calendar-wrap` | Added negative margins and padding: `margin: 0 -16px; padding: 0 16px;` |
| No `max-width: 100%` on network SVG | `#network-svg` | Added `max-width: 100%; display: block;` |
| Domain cards could overflow | `.domain-card` | Added `max-width: 100%; overflow: hidden;` |

### Clickability Issues

| Bug | Location | Fix |
|-----|----------|-----|
| Modal overlay blocking clicks when closed | `.modal-overlay` | Added `pointer-events: none; visibility: hidden;` on closed state, `pointer-events: auto; visibility: visible;` on open |
| Case cards using inline `onclick` | `renderCaseCard()` | Removed `onclick`, added `role="button" tabindex="0"`, implemented event delegation on `#cases-grid` |
| No touch tap highlight for mobile | Global | Added `-webkit-tap-highlight-color: rgba(0,212,170,0.2)` to all interactive elements |
| No `touch-action: manipulation` | Global | Added to prevent double-tap zoom delays on buttons/cards |
| Filter buttons too small for touch | `.filter-btn` | Increased to `min-height: 44px; min-width: 44px` |
| Nav tabs too small for touch | `.nav-tab` | Added `min-height: 44px; min-width: 44px` with flexbox centering |
| Page buttons too small for touch | `.page-btn` | Increased to `min-width: 44px; min-height: 44px` |
| Network filter buttons too small | `.network-filter-btn` | Increased padding, added `min-height: 36px; min-width: 36px` |
| Eco tab buttons too small | `.eco-tab-btn` | Increased padding, added `min-height: 44px` |
| Modal close button too small | `.modal-close` | Increased from 28x28 to 44x44px |
| Org items too small for tap | `.org-item` | Added `min-height: 44px` with flex layout |
| Calendar events no user-select | `.calendar-event` | Added `user-select: none; -webkit-user-select: none;` |
| Case cards no user-select | `.case-card` | Added `user-select: none; -webkit-user-select: none;` |
| Nav tabs using individual listeners | Init code | Changed to event delegation on `nav` container |
| Eco tabs using individual listeners | Init code | Changed to event delegation on `.eco-tabs` |
| Sort buttons using individual listeners | Init code | Changed to event delegation |
| Pagination using `onclick` | `renderCases()` | Changed to `data-page` attribute with event delegation |
| No keyboard accessibility for case cards | Init code | Added `keydown` listener for Enter/Space |
| No Escape key to close modal | Init code | Added `keydown` listener for Escape |
| Network nodes no touch support | D3 render | Added `touchstart`, `touchmove`, `touchend` handlers with tap-vs-drag detection |

### Mobile UX Improvements

| Enhancement | Fix |
|-------------|-----|
| Active/pressed feedback on buttons | Added `:active { transform: scale(0.95-0.98); }` to nav-tab, filter-btn, page-btn, case-card, calendar-event, eco-tab-btn, candidate-card, funder-card |
| Candidate cards not interactive-feeling | Added `cursor: pointer; transition` and hover/active states |
| Funder cards not interactive-feeling | Added `cursor: pointer; transition` and hover/active states |
| Touch scrolling optimization | Added `-webkit-overflow-scrolling: touch` to body |

---

## Tab-by-Tab Verification

### ✅ Network Tab
- Nodes are now clickable via both mouse and touch
- Touch-drag vs touch-tap properly distinguished  
- No horizontal scroll
- Zoom/pan works (D3 drag)
- Tooltip works on hover/touch
- Filter buttons have proper tap targets

### ✅ Cases Tab
- Cards clickable via event delegation (not inline onclick)
- Keyboard accessible (Enter/Space opens modal)
- Filter buttons have 44px min touch targets
- Search input works
- Sort buttons work
- Pagination works
- No horizontal overflow

### ✅ Forecast Tab  
- Calendar timeline scrolls WITHIN its container horizontally
- Page itself does not scroll horizontally
- Calendar events have proper tap targets (12px padding, 44px min-height)
- Candidate cards have cursor and active states

### ✅ Ecosystem Tab
- Tab buttons have proper touch targets
- Domain cards contained within bounds
- Org links are tappable with proper hit area
- Funder cards have hover/active feedback

### ✅ About/Methodology Tab
- Clean layout
- No horizontal overflow
- Condition cards properly styled

### ✅ Modal
- Closes on overlay click
- Closes on X button click  
- Closes on Escape key
- Close button is 44x44px (mobile-friendly)
- Doesn't block page clicks when closed (pointer-events: none)
- Body scroll locked when open

---

## Remaining Known Issues

1. **None critical** — All reported issues have been fixed.

2. **Minor consideration:** On very old mobile browsers, the `touch-action: manipulation` property may not be fully supported, but modern iOS Safari and Chrome handle it correctly.

3. **Performance note:** The D3 network graph with 100 nodes can be CPU-intensive on older devices. This is a known characteristic of force-directed layouts, not a bug.

---

## Testing Recommendations

1. Test on iPhone Safari (primary mobile target)
2. Test on Android Chrome
3. Test landscape and portrait orientations
4. Test with VoiceOver/TalkBack for accessibility
5. Verify no horizontal scroll by swiping left/right on each tab

---

*Report generated by PandaClaw subagent*
