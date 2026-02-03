# Responsive Design Quick Reference

## Quick Start

### Enable Responsive Features

```jsx
// Add responsive={true} to components
<DataTable responsive={true} />
<Modal responsive={true} />
<FormField responsive={true} />
<Button responsive={true} />
<ResponsiveImage responsive={true} />
```

### Use Custom Hooks

```jsx
import { useIsMobile, useBreakpoint } from '@/utils/responsiveUtils';

const isMobile = useIsMobile();
const isTablet = useBreakpoint('md');
```

---

## Common Responsive Classes

### Text Sizing (Mobile-First)
```jsx
className="text-sm md:text-base lg:text-lg"
```

### Spacing (Mobile-First)
```jsx
className="p-4 md:p-6 lg:p-8"
className="mb-4 md:mb-6"
className="gap-4 md:gap-6"
```

### Grid Layout
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
```

### Flex Layout
```jsx
className="flex flex-col md:flex-row gap-4"
```

### Visibility
```jsx
className="hidden md:block"        // Hide on mobile
className="md:hidden"              // Hide on desktop
className="visible md:invisible"   // Toggle visibility
```

---

## Breakpoints at a Glance

| Class | Size | Usage |
|-------|------|-------|
| (none) | 0px | Mobile |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Small laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large screens |

---

## Touch Target Sizes

```javascript
TOUCH_SIZES = {
  small: 'min-h-8 min-w-8',    // 32px
  medium: 'min-h-11 min-w-11', // 44px ← Use this
  large: 'min-h-12 min-w-12',  // 48px
  xlarge: 'min-h-14 min-w-14'  // 56px
}
```

### Usage
```jsx
<button className={`${TOUCH_SIZES.medium} px-4`}>
  Touch-Friendly Button
</button>
```

---

## Component Responsive Behaviors

### DataTable
- **Mobile (<768px):** Card layout
- **Desktop (≥768px):** Table layout
- **Pagination:** Smart pagination for small screens

### Modal
- **Mobile:** Full-width with margins
- **Desktop:** Constrained width based on size prop
- **Max height:** 95vh mobile, 90vh desktop

### FormField
- **Mobile:** Larger inputs (py-3), wider checkboxes (20px)
- **Desktop:** Standard sizing
- **Labels:** Responsive font sizing

### Button
- **Mobile:** 44px minimum height (touch-friendly)
- **Desktop:** Standard height
- **Text:** Responsive sizing

### Navbar
- **Mobile (<768px):** Hamburger menu
- **Desktop (≥768px):** Horizontal menu
- **Dropdown:** Auto-responsive sizing

---

## Custom Hooks Cheat Sheet

### useIsMobile()
```jsx
const isMobile = useIsMobile();
// Returns true if viewport < 768px
```

### useBreakpoint(breakpoint)
```jsx
const isMobile = useBreakpoint('md');    // < 768px
const isTablet = useBreakpoint('lg');    // < 1024px
const isDesktop = useBreakpoint('xl');   // < 1280px
```

### useIsTablet()
```jsx
const isTablet = useIsTablet();
// Returns true if 768px ≤ viewport < 1024px
```

### useViewport()
```jsx
const { width, height } = useViewport();
// Returns current viewport dimensions
```

### useDebounce(callback, delay)
```jsx
const handleResize = useDebounce(() => {
  // Your resize logic
}, 300);
```

---

## Responsive Image Usage

```jsx
import { ResponsiveImage } from '@/components';

<ResponsiveImage
  src="photo.jpg"
  alt="Description"
  responsive={true}
  sizes="(max-width: 640px) 100vw, 50vw"
/>
```

**Auto-generated srcsets:**
- 640px (mobile)
- 1024px (tablet)
- 1440px (desktop)

---

## Testing Checklist

### Mobile
- [ ] No horizontal scrolling
- [ ] All buttons/inputs ≥ 44x44px
- [ ] Text readable without zoom
- [ ] Images don't overflow

### Forms
- [ ] Inputs vertically stacked
- [ ] Labels clearly visible
- [ ] Errors visible
- [ ] Keyboard doesn't hide content

### Tables
- [ ] Mobile: Card layout
- [ ] Desktop: Table layout
- [ ] Pagination touch-friendly

### Navigation
- [ ] Mobile menu appears
- [ ] Touch targets large enough
- [ ] Menu closes after selection

---

## Common Mistakes to Avoid

### ❌ DON'T - Desktop-first approach
```jsx
className="text-lg md:text-base"  // Wrong order!
```

### ✅ DO - Mobile-first approach
```jsx
className="text-sm md:text-base lg:text-lg"
```

### ❌ DON'T - Fixed widths
```jsx
className="w-1200px"  // Will overflow on mobile
```

### ✅ DO - Flexible widths
```jsx
className="w-full max-w-4xl"
```

### ❌ DON'T - Too small touch targets
```jsx
className="px-2 py-1 text-xs"
```

### ✅ DO - Proper touch sizing
```jsx
className={`${TOUCH_SIZES.medium} px-4 py-2`}
```

### ❌ DON'T - Oversized images
```jsx
<img src="4000x3000.jpg" style={{width: "400px"}} />
```

### ✅ DO - Responsive images
```jsx
<ResponsiveImage src="photo.jpg" responsive={true} />
```

---

## Responsive Utilities Export

From `@/utils/responsiveUtils`:

```javascript
// Constants
export const BREAKPOINTS
export const TOUCH_SIZES
export const CONTAINER_PADDING
export const RESPONSIVE_TEXT
export const RESPONSIVE_GRID
export const RESPONSIVE_SPACING
export const MOBILE_CLASSES
export const TABLE_RESPONSIVE
export const FORM_RESPONSIVE
export const MODAL_RESPONSIVE
export const NAV_RESPONSIVE
export const BUTTON_RESPONSIVE
export const INPUT_RESPONSIVE
export const CARD_RESPONSIVE

// Hooks
export const useMediaQuery
export const useBreakpoint
export const useIsMobile
export const useIsTablet
export const useViewport
export const useDebounce

// Helpers
export const generateImageSrcSet
```

---

## Quick Examples

### Responsive Form Layout
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <FormField name="field1" responsive={true} />
  <FormField name="field2" responsive={true} />
  <FormField name="field3" responsive={true} />
</div>
```

### Responsive Card Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <Card key={item.id} className="h-full">
      {item.content}
    </Card>
  ))}
</div>
```

### Responsive Navigation Group
```jsx
<div className="flex flex-col sm:flex-row gap-2 md:gap-4">
  <Button responsive={true}>Primary</Button>
  <Button variant="outline" responsive={true}>Secondary</Button>
</div>
```

### Responsive Table/Cards
```jsx
<DataTable
  data={data}
  columns={columns}
  responsive={true}
  paginated={true}
/>
```

### Responsive Modal
```jsx
<Modal
  isOpen={open}
  onClose={handleClose}
  responsive={true}
  size="md"
>
  <FormField responsive={true} />
</Modal>
```

---

## Device Sizes Reference

| Device | Width | Type |
|--------|-------|------|
| iPhone SE | 375px | Mobile |
| iPhone 12/13 | 390px | Mobile |
| iPhone 14 Pro Max | 430px | Mobile |
| Galaxy S21 | 360px | Mobile |
| iPad (9th gen) | 768px | Tablet |
| iPad Air | 820px | Tablet |
| iPad Pro (11") | 834px | Tablet |
| iPad Pro (12.9") | 1024px | Tablet |
| MacBook Air (M1) | 1440px | Desktop |
| Desktop (24") | 1920px | Desktop |
| Desktop (27") | 2560px | Desktop |

---

## When to Use Each Hook

| Hook | Use Case |
|------|----------|
| `useIsMobile()` | Show/hide mobile-specific UI |
| `useBreakpoint('md')` | Check specific breakpoint |
| `useIsTablet()` | Tablet-specific logic |
| `useViewport()` | Get exact dimensions |
| `useDebounce()` | Optimize resize handlers |

---

## File Locations

```
src/
├── utils/
│   └── responsiveUtils.js    (All utilities & hooks)
├── components/
│   ├── DataTable.jsx         (Responsive tables)
│   ├── Modal.jsx             (Responsive modal)
│   ├── FormField.jsx         (Responsive forms)
│   ├── Button.jsx            (Responsive buttons)
│   ├── Navbar.jsx            (Responsive navbar)
│   └── ResponsiveImage.jsx   (Responsive images)
│
└── docs/
    ├── RESPONSIVE_DESIGN.md  (Full documentation)
    └── RESPONSIVE_QUICK_REF.md (This file)
```

---

## Performance Tips

1. **Use `useIsMobile()` hook** - Detects breakpoint once
2. **Use `useDebounce()`** - Optimize resize listeners
3. **Use `ResponsiveImage`** - Auto-generates srcsets
4. **Avoid unnecessary re-renders** - Use memo on breakpoint-dependent components
5. **Lazy load components** - Load mobile-specific code only on mobile

---

## Support & Resources

- **Full Documentation:** [RESPONSIVE_DESIGN.md](RESPONSIVE_DESIGN.md)
- **Tailwind CSS Responsive:** https://tailwindcss.com/docs/responsive-design
- **WCAG Touch Target:** https://www.w3.org/WAI/WCAG21/Understanding/target-size
- **Mobile Testing:** Chrome DevTools > Device Emulation

---

Last Updated: 2024 | HR Portal v1.0
