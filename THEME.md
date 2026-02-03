# HR Portal Theme Configuration

This document outlines the comprehensive theme system for the HR Portal, built with Tailwind CSS.

## 📋 Table of Contents

1. [Color Palette](#color-palette)
2. [Spacing Scale](#spacing-scale)
3. [Typography System](#typography-system)
4. [Shadow & Depth](#shadow--depth)
5. [Border Radius Standards](#border-radius-standards)
6. [Transitions & Animations](#transitions--animations)
7. [Responsive Breakpoints](#responsive-breakpoints)
8. [Component Utilities](#component-utilities)

---

## 🎨 Color Palette

### Primary Blue (Corporate)
Used for primary actions, links, and brand elements.

```
primary-50:   #f0f4f9  (Lightest)
primary-100:  #e1eaf3
primary-200:  #c3d5e7
primary-300:  #a5c0db
primary-400:  #87abcf
primary-500:  #6896c3
primary-600:  #4a7aad  (Primary - Use as default)
primary-700:  #3a5f8f  (Hover state)
primary-800:  #2a4471  (Active state)
primary-900:  #1a2953  (Darkest)
```

**Usage:**
- Buttons: `.btn-primary`
- Links: `text-primary-600`
- Badges: `.badge-primary`
- Focus rings: `focus:ring-primary-500`

---

### Secondary Gray (Neutral)
Used for text, borders, and neutral backgrounds.

```
secondary-50:   #f8f9fa  (Lightest)
secondary-100:  #f1f3f5
secondary-200:  #e9ecef
secondary-300:  #dee2e6
secondary-400:  #ced4da
secondary-500:  #adb5bd
secondary-600:  #6c757d
secondary-700:  #495057  (Secondary - Use as default)
secondary-800:  #343a40
secondary-900:  #212529  (Darkest)
```

**Usage:**
- Text: `text-secondary-700`, `text-secondary-800`
- Borders: `border-secondary-300`, `border-secondary-200`
- Backgrounds: `bg-secondary-50`, `bg-secondary-100`
- Disabled states

---

### Success Green
Used for positive actions, confirmations, and success states.

```
success-50:   #f0fdf4  (Lightest)
success-100:  #dcfce7
success-200:  #bbf7d0
success-300:  #86efac
success-400:  #4ade80
success-500:  #22c55e
success-600:  #16a34a  (Success - Use as default)
success-700:  #15803d
success-800:  #166534
success-900:  #145231  (Darkest)
```

**Usage:**
- Success buttons: `.btn-success`
- Success badges: `.badge-success`
- Status indicators: `text-success-600`
- Alerts: `.alert-success`

---

### Warning Yellow
Used for caution, warnings, and pending states.

```
warning-50:   #fffbeb  (Lightest)
warning-100:  #fef3c7
warning-200:  #fde68a
warning-300:  #fcd34d
warning-400:  #fbbf24
warning-500:  #f59e0b
warning-600:  #d97706  (Warning - Use as default)
warning-700:  #b45309
warning-800:  #92400e
warning-900:  #78350f  (Darkest)
```

**Usage:**
- Warning buttons: `.btn-warning`
- Warning badges: `.badge-warning`
- Status indicators: `text-warning-600`
- Alerts: `.alert-warning`

---

### Danger Red
Used for destructive actions, errors, and critical states.

```
danger-50:    #fef2f2  (Lightest)
danger-100:   #fee2e2
danger-200:   #fecaca
danger-300:   #fca5a5
danger-400:   #f87171
danger-500:   #ef4444
danger-600:   #dc2626  (Danger - Use as default)
danger-700:   #b91c1c
danger-800:   #991b1b
danger-900:   #7f1d1d  (Darkest)
```

**Usage:**
- Delete buttons: `.btn-danger`
- Error badges: `.badge-danger`
- Status indicators: `text-danger-600`
- Alerts: `.alert-error`
- Validation errors: `.input-error`

---

### Info Blue
Used for informational content and secondary actions.

```
info-50:    #ecf7ff  (Lightest)
info-100:   #d9ecff
info-200:   #b3d9ff
info-300:   #80c5ff
info-400:   #54aaff
info-500:   #2d8dff
info-600:   #1e5ba8  (Info - Use as default)
info-700:   #1a4a8a
info-800:   #163a70
info-900:   #122f5f  (Darkest)
```

**Usage:**
- Info alerts: `.alert-info`
- Info badges: `.badge-info`
- Informational text

---

## 📐 Spacing Scale

The spacing scale is based on 4px units (0.25rem), providing consistent and predictable spacing throughout the application.

```
1  = 0.25rem  (4px)
2  = 0.5rem   (8px)
3  = 0.75rem  (12px)
4  = 1rem     (16px)
5  = 1.25rem  (20px)
6  = 1.5rem   (24px)
7  = 1.75rem  (28px)
8  = 2rem     (32px)
9  = 2.25rem  (36px)
10 = 2.5rem   (40px)
12 = 3rem     (48px)
14 = 3.5rem   (56px)
16 = 4rem     (64px)
20 = 5rem     (80px)
24 = 6rem     (96px)
28 = 7rem     (112px)
32 = 8rem     (128px)
```

**Usage:**
- Padding: `p-4`, `px-6`, `py-3`
- Margin: `m-4`, `mx-auto`, `mb-8`
- Gap: `gap-4`, `gap-x-3`, `gap-y-6`

**Common Combinations:**
- Page padding: `px-4 md:px-6 lg:px-8`
- Card padding: `p-6`
- Button padding: `px-4 py-2`
- Section spacing: `py-8 md:py-12 lg:py-16`

---

## 🔤 Typography System

### Font Families

- **Sans (Default)**: Inter, system-ui, sans-serif
- **Serif**: Georgia, serif
- **Mono**: Fira Code, monospace

### Font Sizes with Line Height

```
xs     = 0.75rem    (12px)  - line-height: 1rem
sm     = 0.875rem   (14px)  - line-height: 1.25rem
base   = 1rem       (16px)  - line-height: 1.5rem
lg     = 1.125rem   (18px)  - line-height: 1.75rem
xl     = 1.25rem    (20px)  - line-height: 1.75rem
2xl    = 1.5rem     (24px)  - line-height: 2rem
3xl    = 1.875rem   (30px)  - line-height: 2.25rem
4xl    = 2.25rem    (36px)  - line-height: 2.5rem
5xl    = 3rem       (48px)  - line-height: 1
```

### Heading Components

```html
<!-- h1 - Page Title -->
<h1 class="h1">Main Heading</h1>
<!-- Result: text-4xl font-bold text-secondary-900 tracking-tight -->

<!-- h2 - Section Title -->
<h2 class="h2">Section Heading</h2>
<!-- Result: text-3xl font-bold text-secondary-900 tracking-tight -->

<!-- h3 - Subsection -->
<h3 class="h3">Subsection</h3>
<!-- Result: text-2xl font-semibold text-secondary-900 -->

<!-- h4, h5, h6 - Further nesting -->
<h4 class="h4">Sub-subsection</h4>
```

### Body Text

```html
<!-- Large body text -->
<p class="body-lg">Larger paragraph text with relaxed line-height</p>

<!-- Regular body text -->
<p class="body">Standard paragraph text</p>

<!-- Small body text -->
<p class="body-sm">Smaller paragraph text</p>
```

### Helper Text

```html
<!-- Caption (labels, timestamps) -->
<span class="caption">UPDATED 2 HOURS AGO</span>

<!-- Helper text (form hints) -->
<p class="helper-text">Enter a valid email address</p>
```

### Font Weights

- Thin: `font-thin` (100)
- Extralight: `font-extralight` (200)
- Light: `font-light` (300)
- Normal: `font-normal` (400)
- Medium: `font-medium` (500)
- Semibold: `font-semibold` (600)
- Bold: `font-bold` (700)
- Extrabold: `font-extrabold` (800)
- Black: `font-black` (900)

### Line Height

- Tight: `leading-tight` (1.25)
- Normal: `leading-normal` (1.5)
- Relaxed: `leading-relaxed` (1.625)
- Loose: `leading-loose` (2)

---

## 🌑 Shadow & Depth

The shadow system provides visual depth and hierarchy:

```
shadow-none        = No shadow
shadow-xs          = Minimal shadow (1px)
shadow-sm          = Small shadow
shadow-base        = Default shadow (use for cards)
shadow-md          = Medium shadow
shadow-lg          = Large shadow (use for modals)
shadow-xl          = Extra large shadow
shadow-2xl         = Double extra large shadow
shadow-inner       = Inset shadow
shadow-input       = Input-specific shadow
shadow-card        = Card shadow (prefer .card component)
shadow-card-hover  = Card hover shadow
shadow-card-active = Card active shadow
shadow-input-focus = Input focus ring shadow
```

**Usage:**

```html
<!-- Default card shadow -->
<div class="shadow-base rounded-lg p-6">Card content</div>

<!-- Card with hover effect -->
<div class="shadow-card hover:shadow-card-hover transition-shadow duration-300">
  Card with hover
</div>

<!-- Modal shadow -->
<div class="shadow-xl bg-white rounded-lg">Modal content</div>
```

---

## 🔲 Border Radius Standards

```
xs          = 0.125rem   (2px)    - Subtle curves
sm          = 0.25rem    (4px)    - Small elements
base/button = 0.375rem   (6px)    - Default for buttons
md          = 0.5rem     (8px)    - Standard
lg          = 0.75rem    (12px)   - Cards
xl          = 1rem       (16px)   - Large modals
2xl         = 1.5rem     (24px)   - Extra large
3xl         = 2rem       (32px)   - Massive
full        = 9999px     - Perfect circles (with square size)
```

**Component-specific:**
- `rounded-card` - Cards (0.5rem)
- `rounded-input` - Input fields (0.375rem)
- `rounded-button` - Buttons (0.375rem)
- `rounded-modal` - Modals (0.5rem)

**Usage:**

```html
<!-- Button with standard radius -->
<button class="rounded-button">Click Me</button>

<!-- Card with larger radius -->
<div class="rounded-card shadow-base p-6">Card</div>

<!-- Circle avatar -->
<img class="w-10 h-10 rounded-full" src="avatar.jpg" />
```

---

## ⏱️ Transitions & Animations

### Transition Durations

```
0     = 0ms
75    = 75ms   - Quick feedback (default)
100   = 100ms  - Standard
150   = 150ms  - Slightly slower
200   = 200ms  - Smooth (default for many)
300   = 300ms  - Extended (default for animations)
500   = 500ms  - Slow
700   = 700ms  - Very slow
1000  = 1000ms - Very extended
```

### Transition Timing Functions

```
linear          - No easing
in              - Ease in
out             - Ease out (default)
in-out          - Ease in-out (smooth)
ease-in-sine    - Sine easing
ease-out-sine   - Sine easing out
ease-in-out-sine - Sine easing both
ease-in-quad    - Quadratic easing
ease-out-quad   - Quadratic easing out
```

### Built-in Animations

```
animate-fade-in      - Fade in over 300ms
animate-slide-down   - Slide down from top
animate-slide-up     - Slide up from bottom
animate-slide-right  - Slide in from left
animate-pulse-ring   - Pulsing ring effect
```

**Usage:**

```html
<!-- Smooth background transition -->
<div class="bg-primary-600 hover:bg-primary-700 transition-colors duration-200">
  Hover me
</div>

<!-- Animated modal entrance -->
<div class="animate-slide-down">Modal</div>

<!-- Smooth all transitions -->
<div class="transition-all duration-300">Element</div>
```

---

## 📱 Responsive Breakpoints

```
xs    = 320px   - Extra small (mobile)
sm    = 640px   - Small (landscape phone)
md    = 768px   - Medium (tablet)
lg    = 1024px  - Large (desktop)
xl    = 1280px  - Extra large (wide desktop)
2xl   = 1536px  - 2xl (ultra-wide)
```

**Usage Pattern:**

```html
<!-- Mobile first approach -->
<div class="w-full md:w-1/2 lg:w-1/3">
  Full width on mobile, half on tablet, third on desktop
</div>

<!-- Hide/Show on breakpoints -->
<div class="md:hidden">Visible only on mobile</div>
<div class="hidden md:block">Visible on tablet+</div>

<!-- Responsive padding -->
<div class="px-4 md:px-6 lg:px-8">
  16px on mobile, 24px on tablet, 32px on desktop
</div>
```

---

## 🧩 Component Utilities

### Button Components

```html
<!-- Primary Button -->
<button class="btn-primary">Primary Action</button>
<!-- Secondary Button -->
<button class="btn-secondary">Secondary Action</button>
<!-- Danger Button -->
<button class="btn-danger">Delete</button>
<!-- Success Button -->
<button class="btn-success">Confirm</button>
<!-- Warning Button -->
<button class="btn-warning">Warning</button>
<!-- Outline Button -->
<button class="btn-outline">Outline</button>
<!-- Ghost Button -->
<button class="btn-ghost">Ghost</button>

<!-- Button Sizes -->
<button class="btn-primary btn-sm">Small</button>
<button class="btn-primary">Medium (default)</button>
<button class="btn-primary btn-lg">Large</button>
```

### Input Fields

```html
<!-- Base input -->
<input type="text" class="input-field" placeholder="Enter text" />

<!-- With label and error -->
<label>Email</label>
<input type="email" class="input-field input-error" />
<span class="helper-text text-danger-600">Invalid email</span>

<!-- Disabled input -->
<input type="text" class="input-field input-disabled" disabled />

<!-- Success state -->
<input type="text" class="input-field input-success" />
```

### Cards

```html
<!-- Default card -->
<div class="card">
  Card content
</div>

<!-- Hoverable card -->
<div class="card-hover">
  Click me
</div>

<!-- Elevated card -->
<div class="card-elevated">
  Elevated card
</div>
```

### Badges

```html
<!-- Primary badge -->
<span class="badge-primary">Primary</span>
<!-- Success badge -->
<span class="badge-success">Approved</span>
<!-- Warning badge -->
<span class="badge-warning">Pending</span>
<!-- Danger badge -->
<span class="badge-danger">Rejected</span>
<!-- Outline badge -->
<span class="badge-outline">Outline</span>
```

### Alerts

```html
<!-- Success alert -->
<div class="alert-success">Operation successful!</div>
<!-- Error alert -->
<div class="alert-error">An error occurred</div>
<!-- Warning alert -->
<div class="alert-warning">Please review</div>
<!-- Info alert -->
<div class="alert-info">Information message</div>
```

### Layout Utilities

```html
<!-- Centered layout -->
<div class="container-md mx-auto">Centered content</div>

<!-- Flex utilities -->
<div class="flex-center">Centered flex container</div>
<div class="flex-between">Space between items</div>
<div class="flex-col-center">Centered column</div>

<!-- Text truncation -->
<p class="truncate-1">Single line truncation...</p>
<p class="truncate-2">Two line truncation...</p>
<p class="truncate-3">Three line truncation...</p>
```

---

## 🎯 Best Practices

### Color Usage
1. Use primary colors for main actions and focus states
2. Use secondary colors for text and neutral backgrounds
3. Use semantic colors (success, warning, danger) for status
4. Never use colors for meaning alone; combine with icons or text

### Spacing
1. Always use the spacing scale; never use custom spacing
2. Follow a pattern: `p-4`, `m-6`, `gap-3`
3. Use responsive spacing: `px-4 md:px-6 lg:px-8`

### Typography
1. Use semantic heading levels: h1 > h2 > h3
2. Use `.body` class for most paragraph text
3. Use `.helper-text` for form hints and metadata
4. Use `.caption` for timestamps and labels

### Shadows
1. Use `shadow-base` for cards
2. Use `shadow-lg` for modals
3. Use hover shadows for interactive elements
4. Combine with transitions: `hover:shadow-lg transition-shadow duration-300`

### Animations
1. Use `transition-all duration-200` for quick feedback
2. Use `transition-colors duration-300` for color changes
3. Use `animate-*` classes for entrance animations
4. Always include duration in transitions

### Responsive Design
1. Mobile-first approach: start with mobile styles
2. Use breakpoint prefixes: `md:`, `lg:`, `xl:`
3. Test at all breakpoints: 320px, 768px, 1024px, 1280px
4. Hide/show content appropriately per breakpoint

---

## 📝 Examples

### Complete Form Example

```html
<form class="space-y-6">
  <!-- Form group -->
  <div>
    <label class="block text-sm font-medium text-secondary-700 mb-2">
      Email Address
    </label>
    <input 
      type="email" 
      class="input-field" 
      placeholder="john@example.com"
    />
    <p class="helper-text mt-2">We'll never share your email</p>
  </div>

  <!-- Form group -->
  <div>
    <label class="block text-sm font-medium text-secondary-700 mb-2">
      Password
    </label>
    <input 
      type="password" 
      class="input-field" 
      placeholder="••••••••"
    />
  </div>

  <!-- Buttons -->
  <div class="flex gap-3">
    <button type="submit" class="btn-primary">Sign In</button>
    <button type="reset" class="btn-outline">Cancel</button>
  </div>
</form>
```

### Card with Header & Footer

```html
<div class="card">
  <!-- Header -->
  <div class="mb-4 pb-4 border-b border-secondary-200">
    <h3 class="h4">Employee Information</h3>
  </div>

  <!-- Content -->
  <div class="space-y-4">
    <div>
      <p class="helper-text">Name</p>
      <p class="body font-semibold">John Doe</p>
    </div>
    <div>
      <p class="helper-text">Position</p>
      <p class="body font-semibold">Senior Developer</p>
    </div>
  </div>

  <!-- Footer -->
  <div class="mt-6 pt-4 border-t border-secondary-200 flex gap-3">
    <button class="btn-primary">Edit</button>
    <button class="btn-outline">Cancel</button>
  </div>
</div>
```

---

## 🔄 Customization

To customize the theme, edit `tailwind.config.js`:

```javascript
// Add custom colors
colors: {
  custom: {
    50: "#f5f5f5",
    // ... more shades
  }
}

// Add custom spacing
spacing: {
  custom: "5.5rem"
}

// Add custom animations
extend: {
  keyframes: {
    custom: {
      "0%": { opacity: "0" },
      "100%": { opacity: "1" }
    }
  }
}
```

---

**Last Updated:** February 2, 2026
**Version:** 1.0.0
