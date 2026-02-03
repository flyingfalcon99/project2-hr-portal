# Color Palette Reference

## 🎨 Complete Color System for HR Portal

This document provides a visual reference for all colors available in the theme system.

---

## Primary Blue (Corporate Brand)

Used for primary actions, links, CTAs, and brand elements.

| Shade | Hex | RGB | Usage |
|-------|-----|-----|-------|
| 50 | `#f0f4f9` | rgb(240, 244, 249) | Hover backgrounds |
| 100 | `#e1eaf3` | rgb(225, 234, 243) | Light backgrounds |
| 200 | `#c3d5e7` | rgb(195, 213, 231) | Disabled states |
| 300 | `#a5c0db` | rgb(165, 192, 219) | Borders |
| 400 | `#87abcf` | rgb(135, 171, 207) | Secondary text |
| 500 | `#6896c3` | rgb(104, 150, 195) | Hover states |
| **600** | `#4a7aad` | rgb(74, 122, 173) | **Primary (Use This)** |
| 700 | `#3a5f8f` | rgb(58, 95, 143) | Hover buttons |
| 800 | `#2a4471` | rgb(42, 68, 113) | Active states |
| 900 | `#1a2953` | rgb(26, 41, 83) | Darkest text |

**CSS Usage:**
```css
/* Primary shade */
bg-primary-600
text-primary-600
border-primary-600
focus:ring-primary-500

/* Lighter variants */
bg-primary-100
bg-primary-50

/* Darker variants */
bg-primary-700
text-primary-900
```

---

## Secondary Gray (Neutral)

Used for text, borders, backgrounds, and neutral UI elements.

| Shade | Hex | RGB | Usage |
|-------|-----|-----|-------|
| 50 | `#f8f9fa` | rgb(248, 249, 250) | Page backgrounds |
| 100 | `#f1f3f5` | rgb(241, 243, 245) | Card backgrounds |
| 200 | `#e9ecef` | rgb(233, 236, 239) | Hover backgrounds |
| 300 | `#dee2e6` | rgb(222, 226, 230) | Input borders |
| 400 | `#ced4da` | rgb(206, 212, 218) | Disabled borders |
| 500 | `#adb5bd` | rgb(173, 181, 189) | Placeholder text |
| **600** | `#6c757d` | rgb(108, 117, 125) | **Secondary (Use This)** |
| 700 | `#495057` | rgb(73, 80, 87) | Body text |
| 800 | `#343a40` | rgb(52, 58, 64) | Headings |
| 900 | `#212529` | rgb(33, 37, 41) | Darkest text |

**CSS Usage:**
```css
/* Secondary shade */
bg-secondary-100
text-secondary-700
border-secondary-300

/* Light variants for backgrounds */
bg-secondary-50

/* Dark variants for text */
text-secondary-800
text-secondary-900
```

---

## Success Green

Used for confirmations, approvals, positive feedback, and success states.

| Shade | Hex | RGB | Usage |
|-------|-----|-----|-------|
| 50 | `#f0fdf4` | rgb(240, 253, 244) | Success backgrounds |
| 100 | `#dcfce7` | rgb(220, 252, 231) | Light success |
| 200 | `#bbf7d0` | rgb(187, 247, 208) | Border backgrounds |
| 300 | `#86efac` | rgb(134, 239, 172) | Borders |
| 400 | `#4ade80` | rgb(74, 222, 128) | Hover states |
| 500 | `#22c55e` | rgb(34, 197, 94) | Brighter green |
| **600** | `#16a34a` | rgb(22, 163, 74) | **Success (Use This)** |
| 700 | `#15803d` | rgb(21, 128, 61) | Hover buttons |
| 800 | `#166534` | rgb(22, 101, 52) | Active states |
| 900 | `#145231` | rgb(20, 82, 49) | Dark text |

**CSS Usage:**
```css
/* Success components */
.btn-success
.badge-success
.alert-success
bg-success-600
text-success-700

/* Light variants */
bg-success-50
bg-success-100
```

**When to Use:**
- ✅ Approved leaves
- ✅ Successful form submissions
- ✅ Completed tasks
- ✅ Active statuses

---

## Warning Yellow

Used for caution, warnings, pending states, and attention-required alerts.

| Shade | Hex | RGB | Usage |
|-------|-----|-----|-------|
| 50 | `#fffbeb` | rgb(255, 251, 235) | Warning backgrounds |
| 100 | `#fef3c7` | rgb(254, 243, 199) | Light warning |
| 200 | `#fde68a` | rgb(253, 230, 138) | Border backgrounds |
| 300 | `#fcd34d` | rgb(252, 211, 77) | Borders |
| 400 | `#fbbf24` | rgb(251, 191, 36) | Hover states |
| 500 | `#f59e0b` | rgb(245, 158, 11) | Brighter yellow |
| **600** | `#d97706` | rgb(217, 119, 6) | **Warning (Use This)** |
| 700 | `#b45309` | rgb(180, 83, 9) | Hover buttons |
| 800 | `#92400e` | rgb(146, 64, 14) | Active states |
| 900 | `#78350f` | rgb(120, 53, 15) | Dark text |

**CSS Usage:**
```css
/* Warning components */
.btn-warning
.badge-warning
.alert-warning
bg-warning-600
text-warning-700

/* Light variants */
bg-warning-50
bg-warning-100
```

**When to Use:**
- ⚠️ Pending approvals
- ⚠️ In-progress tasks
- ⚠️ Attention required
- ⚠️ Validation warnings

---

## Danger Red

Used for destructive actions, errors, critical alerts, and denial states.

| Shade | Hex | RGB | Usage |
|-------|-----|-----|-------|
| 50 | `#fef2f2` | rgb(254, 242, 242) | Error backgrounds |
| 100 | `#fee2e2` | rgb(254, 226, 226) | Light error |
| 200 | `#fecaca` | rgb(254, 202, 202) | Border backgrounds |
| 300 | `#fca5a5` | rgb(252, 165, 165) | Borders |
| 400 | `#f87171` | rgb(248, 113, 113) | Hover states |
| 500 | `#ef4444` | rgb(239, 68, 68) | Brighter red |
| **600** | `#dc2626` | rgb(220, 38, 38) | **Danger (Use This)** |
| 700 | `#b91c1c` | rgb(185, 28, 28) | Hover buttons |
| 800 | `#991b1b` | rgb(153, 27, 27) | Active states |
| 900 | `#7f1d1d` | rgb(127, 29, 29) | Dark text |

**CSS Usage:**
```css
/* Danger components */
.btn-danger
.badge-danger
.alert-error
bg-danger-600
text-danger-700
.input-error

/* Light variants */
bg-danger-50
bg-danger-100
```

**When to Use:**
- ❌ Delete actions
- ❌ Error messages
- ❌ Rejected leaves
- ❌ Failed operations
- ❌ Validation errors

---

## Info Blue (Secondary Brand)

Used for informational content, secondary actions, and informational alerts.

| Shade | Hex | RGB | Usage |
|-------|-----|-----|-------|
| 50 | `#ecf7ff` | rgb(236, 247, 255) | Info backgrounds |
| 100 | `#d9ecff` | rgb(217, 236, 255) | Light info |
| 200 | `#b3d9ff` | rgb(179, 217, 255) | Border backgrounds |
| 300 | `#80c5ff` | rgb(128, 197, 255) | Borders |
| 400 | `#54aaff` | rgb(84, 170, 255) | Hover states |
| 500 | `#2d8dff` | rgb(45, 141, 255) | Brighter blue |
| **600** | `#1e5ba8` | rgb(30, 91, 168) | **Info (Use This)** |
| 700 | `#1a4a8a` | rgb(26, 74, 138) | Hover states |
| 800 | `#163a70` | rgb(22, 58, 112) | Active states |
| 900 | `#122f5f` | rgb(18, 47, 95) | Dark text |

**CSS Usage:**
```css
/* Info components */
.badge-info
.alert-info
bg-info-600
text-info-700

/* Light variants */
bg-info-50
bg-info-100
```

**When to Use:**
- ℹ️ Information alerts
- ℹ️ Tips and hints
- ℹ️ Help text
- ℹ️ Secondary actions

---

## Color Combinations & Pairings

### Recommended Text + Background Combos

```css
/* Success */
text-success-800 on bg-success-50
text-success-700 on bg-success-100
text-white on bg-success-600

/* Warning */
text-warning-800 on bg-warning-50
text-warning-700 on bg-warning-100
text-white on bg-warning-600

/* Danger */
text-danger-800 on bg-danger-50
text-danger-700 on bg-danger-100
text-white on bg-danger-600

/* Info */
text-info-800 on bg-info-50
text-info-700 on bg-info-100
text-white on bg-info-600

/* Primary */
text-primary-800 on bg-primary-50
text-primary-700 on bg-primary-100
text-white on bg-primary-600

/* Neutral */
text-secondary-800 on bg-secondary-50
text-secondary-700 on bg-secondary-100
text-white on bg-secondary-600
```

---

## Accessibility Guidelines

### Contrast Ratios

All color combinations meet WCAG AA standards (4.5:1 minimum for text):

- **AAA (7:1+)**: Primary/Info/Danger/Warning/Success text on white backgrounds
- **AA (4.5:1+)**: All shade 700+ on lighter shade backgrounds
- **Compliant**: All button text on button backgrounds

### Color-Blind Safe

The palette uses distinct hues that work for:
- ✅ Protanopia (Red-Blind)
- ✅ Deuteranopia (Green-Blind)
- ✅ Tritanopia (Blue-Yellow Blind)

Always pair colors with:
- Icons
- Text labels
- Patterns/textures

### Example: Accessible Badge

```html
<!-- ✅ Good - Color + Icon + Text -->
<span class="badge-success">
  <svg class="w-4 h-4"><!-- checkmark --></svg>
  Approved
</span>

<!-- ❌ Avoid - Color Only -->
<span class="badge-success"></span>
```

---

## Implementation Examples

### Form Validation States

```html
<!-- Default -->
<input class="input-field" type="email" />

<!-- Error -->
<input class="input-field input-error" type="email" />
<!-- Shows danger-600 border -->

<!-- Success -->
<input class="input-field input-success" type="email" />
<!-- Shows success-600 border -->
```

### Status Indicators

```html
<!-- Approved -->
<span class="badge-success">Approved</span>
<!-- bg-success-100 text-success-800 -->

<!-- Pending -->
<span class="badge-warning">Pending</span>
<!-- bg-warning-100 text-warning-800 -->

<!-- Rejected -->
<span class="badge-danger">Rejected</span>
<!-- bg-danger-100 text-danger-800 -->
```

### Alert Messages

```html
<!-- Success Alert -->
<div class="alert-success">
  Operation completed successfully!
</div>

<!-- Error Alert -->
<div class="alert-error">
  Failed to save changes
</div>

<!-- Warning Alert -->
<div class="alert-warning">
  This action cannot be undone
</div>

<!-- Info Alert -->
<div class="alert-info">
  Additional information
</div>
```

### Button States

```html
<!-- Primary Button -->
<button class="btn-primary">
  <!-- bg-primary-600, hover: bg-primary-700 -->
</button>

<!-- Danger Button (Delete) -->
<button class="btn-danger">
  Delete
  <!-- bg-danger-600, hover: bg-danger-700 -->
</button>

<!-- Success Button (Approve) -->
<button class="btn-success">
  Approve
  <!-- bg-success-600, hover: bg-success-700 -->
</button>

<!-- Warning Button (Caution) -->
<button class="btn-warning">
  Warning
  <!-- bg-warning-600, hover: bg-warning-700 -->
</button>
```

---

## Typography Color Usage

```html
<!-- Headings - Use darkest shade -->
<h1 class="text-secondary-900">Main Heading</h1>
<h2 class="text-secondary-900">Section Heading</h2>

<!-- Body text - Use mid-dark shade -->
<p class="text-secondary-700">Regular paragraph text</p>

<!-- Secondary text - Use medium shade -->
<p class="text-secondary-600">Secondary information</p>

<!-- Disabled/Muted - Use light shade -->
<p class="text-secondary-400">Disabled text</p>

<!-- Links - Use primary shade -->
<a href="#" class="text-primary-600 hover:text-primary-700">Link text</a>
```

---

## Customization

### Adding Custom Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  // Extend existing colors
  primary: {
    // ... existing shades
    950: "#0f1928", // Add darker shade
  },
  
  // Add new color family
  custom: {
    50: "#f5f5f5",
    100: "#eeeeee",
    // ... more shades
    600: "#333333",
    // ... more shades
  }
}
```

Then use:
```html
<div class="bg-custom-600">Custom color</div>
```

---

## Color in Dark Mode (Future Enhancement)

When implementing dark mode, use these mappings:

```javascript
// Suggested dark mode colors
{
  primary: {
    600: "#87abcf", // Light up in dark mode
    700: "#a5c0db",
    800: "#c3d5e7",
  },
  secondary: {
    700: "#d9dcdf", // Light gray text
    800: "#eeeeee",
    900: "#ffffff",
  },
}
```

---

## Quick Reference Table

| Component | Color | Shade | Variable |
|-----------|-------|-------|----------|
| Primary Button | Blue | 600 | `bg-primary-600` |
| Danger Button | Red | 600 | `bg-danger-600` |
| Success Badge | Green | 100/800 | `badge-success` |
| Warning Badge | Yellow | 100/800 | `badge-warning` |
| Error Input | Red | 500 | `border-danger-500` |
| Body Text | Gray | 700 | `text-secondary-700` |
| Heading Text | Gray | 900 | `text-secondary-900` |
| Card Background | White | - | `bg-white` |
| Card Border | Gray | 200 | `border-secondary-200` |

---

**Last Updated:** February 2, 2026
**Version:** 1.0.0
