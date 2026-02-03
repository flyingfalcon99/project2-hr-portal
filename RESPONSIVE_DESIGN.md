# Responsive Design System Documentation

## Overview

The HR Portal includes a comprehensive responsive design system built with mobile-first principles. All components have been optimized for mobile, tablet, and desktop devices with proper touch target sizing and accessibility support.

## Table of Contents

1. [Breakpoints](#breakpoints)
2. [Touch Targets](#touch-targets)
3. [Responsive Components](#responsive-components)
4. [Utilities & Hooks](#utilities--hooks)
5. [Mobile-First Approach](#mobile-first-approach)
6. [Testing Guidelines](#testing-guidelines)
7. [Best Practices](#best-practices)

---

## Breakpoints

The responsive system uses Tailwind CSS breakpoints:

| Breakpoint | Size | Usage |
|-----------|------|-------|
| `xs` | 0px | Mobile phones |
| `sm` | 640px | Large phones & small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

### Breakpoint Usage

```jsx
// Mobile-first approach (no prefix = mobile, then add screen sizes)
className="text-sm md:text-base lg:text-lg"

// Using breakpoint hooks
const isTablet = useBreakpoint('md');
const isMobile = useIsMobile();
```

---

## Touch Targets

All interactive elements follow WCAG accessibility guidelines with minimum 44x44px touch targets on mobile.

### Touch Sizes

Available touch sizes via `TOUCH_SIZES` constant:

```javascript
{
  small: 'min-h-8 min-w-8',      // 32px
  medium: 'min-h-11 min-w-11',   // 44px (recommended)
  large: 'min-h-12 min-w-12',    // 48px
  xlarge: 'min-h-14 min-w-14'    // 56px
}
```

### Implementation

```jsx
import { TOUCH_SIZES } from '@/utils/responsiveUtils';

<button className={`${TOUCH_SIZES.medium} px-4 py-2`}>
  Touch-Friendly Button
</button>
```

---

## Responsive Components

### 1. DataTable (Responsive Cards)

**Mobile Behavior:** Converts to card layout on screens < 768px
**Features:**
- Auto-responsive card view with all data visible
- Touch-friendly pagination
- Responsive checkbox sizing
- Mobile-optimized spacing

**Usage:**
```jsx
<DataTable
  data={employees}
  columns={columns}
  responsive={true}
  paginated={true}
  selectable={true}
/>
```

**Mobile View:**
```
┌─────────────────┐
│ Field Label 1: Value │
│ Field Label 2: Value │
│ Field Label 3: Value │
└─────────────────┘
```

**Desktop View:** Traditional HTML table

---

### 2. Modal (Mobile Optimization)

**Mobile Behavior:** Full-width on mobile, proper sizing on desktop
**Features:**
- Auto-adjusted padding and height
- Touch-friendly close button
- Responsive font sizing
- Scrollable content on small screens

**Usage:**
```jsx
<Modal
  isOpen={open}
  onClose={handleClose}
  title="Form Title"
  responsive={true}
  size="md"
>
  {/* Content */}
</Modal>
```

**Sizes:**
- `sm`: Mobile: full-width, Desktop: 24rem
- `md`: Mobile: full-width, Desktop: 28rem
- `lg`: Mobile: full-width, Desktop: 32rem
- `xl`: Mobile: full-width, Desktop: 36rem
- `full`: Always full-width with margins

---

### 3. FormField (Touch-Optimized)

**Mobile Behavior:** Larger inputs, adjusted padding, responsive text
**Features:**
- Responsive padding (mobile: px-4, desktop: px-5)
- Responsive height (mobile: py-3, desktop: py-3.5)
- Larger checkboxes/radio buttons on mobile (20px vs 16px)
- Touch-friendly spacing between options

**Usage:**
```jsx
<FormField
  control={control}
  name="email"
  label="Email"
  type="email"
  responsive={true}
/>
```

**Responsive Variants:**
```javascript
// Mobile
Input height: 48px, Padding: 16px
Checkbox size: 20px x 20px

// Desktop
Input height: 40px, Padding: 20px
Checkbox size: 16px x 16px
```

---

### 4. Button (Adaptive Sizing)

**Mobile Behavior:** Minimum 44x44px touch target
**Features:**
- Auto-sized for touch on mobile
- Responsive text sizing
- Accessible focus states
- Loading state support

**Usage:**
```jsx
<Button
  size="md"
  responsive={true}
>
  Click Me
</Button>
```

**Size Mapping:**
| Size | Mobile | Desktop |
|------|--------|---------|
| `sm` | 40px height | auto |
| `md` | 44px height (default) | auto |
| `lg` | 48px height | auto |
| `touch` | 44px height + wider padding | auto |

---

### 5. Navbar (Mobile Menu)

**Mobile Behavior:** Hamburger menu for navigation, responsive dropdown
**Features:**
- Mobile hamburger menu (< 768px)
- Touch-friendly button sizing
- Responsive profile dropdown sizing
- Auto-hide on route change

**Usage:**
```jsx
<Navbar />
```

**Mobile Menu Features:**
- Full-width navigation menu
- Touch targets: 44x44px minimum
- Accessible open/close button
- Smooth animations

**Desktop Menu:** Always visible horizontal navigation

---

### 6. ResponsiveImage (Image Optimization)

**Features:**
- Automatic srcset generation
- Responsive sizing
- Progressive loading with fallback
- Format optimization

**Usage:**
```jsx
<ResponsiveImage
  src="photo.jpg"
  alt="Description"
  responsive={true}
  sizes="(max-width: 640px) 100vw, 50vw"
  width="400px"
  height="300px"
/>
```

**Generated Srcsets:**
```
photo.jpg 640w    (mobile)
photo.jpg 1024w   (tablet)
photo.jpg 1440w   (desktop)
```

---

## Utilities & Hooks

### Custom React Hooks

#### `useIsMobile()`
Detects if viewport is mobile (< 768px)

```jsx
const isMobile = useIsMobile();

return isMobile ? <MobileLayout /> : <DesktopLayout />;
```

#### `useBreakpoint(breakpoint)`
Detects specific breakpoint

```jsx
const isTablet = useBreakpoint('md');
const isDesktop = useBreakpoint('lg');

if (isDesktop) {
  // Show desktop content
}
```

#### `useIsTablet()`
Detects if viewport is tablet (768px - 1024px)

```jsx
const isTablet = useIsTablet();
```

#### `useViewport()`
Gets current viewport dimensions

```jsx
const { width, height } = useViewport();
```

#### `useDebounce(callback, delay)`
Debounces callback for resize events

```jsx
const handleResize = useDebounce(() => {
  // Handle resize
}, 300);

window.addEventListener('resize', handleResize);
```

### Responsive Class Helpers

#### `TABLE_RESPONSIVE`
Classes for responsive table styling

```javascript
{
  wrapper: 'overflow-x-auto',
  table: 'w-full border-collapse',
  // Cards on mobile, table on desktop
}
```

#### `FORM_RESPONSIVE`
Grid layout classes for forms

```javascript
{
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  twoColumn: 'grid grid-cols-1 md:grid-cols-2',
}
```

#### `MODAL_RESPONSIVE`
Modal sizing classes

```javascript
{
  mobile: 'max-w-full mx-4 max-h-[95vh]',
  desktop: 'max-w-md max-h-[90vh]',
}
```

#### `BUTTON_RESPONSIVE`
Button sizing for different screens

```javascript
{
  sm: 'text-xs md:text-sm',
  md: 'text-sm md:text-base',
  lg: 'text-base md:text-lg',
}
```

#### `INPUT_RESPONSIVE`
Input field sizing

```javascript
{
  mobile: 'px-4 py-3',
  desktop: 'px-5 py-3.5',
}
```

---

## Mobile-First Approach

### Principle

Start with mobile styles, then enhance for larger screens:

```jsx
// ✅ CORRECT - Mobile-first
className="text-sm md:text-base lg:text-lg"

// ❌ AVOID - Desktop-first
className="text-lg md:text-base sm:text-sm"
```

### Implementation Pattern

```jsx
// Mobile by default
className="
  w-full px-4 py-3 text-sm
  md:w-1/2 md:px-6 md:py-4 md:text-base
  lg:w-1/3 lg:px-8 lg:text-lg
"
```

### Container Padding

```javascript
CONTAINER_PADDING = {
  mobile: 'px-4',      // 16px
  tablet: 'px-6',      // 24px
  desktop: 'px-8',     // 32px
}
```

---

## Testing Guidelines

### Mobile Testing Checklist

#### Device Sizes to Test
- [ ] iPhone SE (375px)
- [ ] iPhone 12 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop 1440px+
- [ ] Desktop 4K (2560px)

#### Testing Focus Areas

**1. Layout & Spacing**
- [ ] No horizontal scrolling on any device
- [ ] Proper padding/margins on all breakpoints
- [ ] Text readable without zooming
- [ ] Images don't overflow containers

**2. Touch Interaction**
- [ ] All buttons ≥ 44x44px on mobile
- [ ] Proper spacing between interactive elements
- [ ] No overlapping touch targets
- [ ] Form inputs easy to tap

**3. Forms**
- [ ] All input fields vertically stacked on mobile
- [ ] Labels clearly associated with inputs
- [ ] Error messages visible
- [ ] Keyboard doesn't hide content

**4. Tables**
- [ ] Desktop: Traditional table layout
- [ ] Mobile: Card layout
- [ ] Pagination touch-friendly
- [ ] Selection works on cards

**5. Navigation**
- [ ] Hamburger menu appears on mobile
- [ ] Menu items easy to tap (44px+)
- [ ] Menu auto-closes after selection
- [ ] Current page highlighted

**6. Modals**
- [ ] Close button always visible
- [ ] Modal fits on screen without scrolling
- [ ] Content scrollable if needed
- [ ] Backdrop clickable on desktop

**7. Performance**
- [ ] Images load quickly
- [ ] Smooth animations on mobile
- [ ] No janky scrolling
- [ ] Responsive to touch

### Browser Testing

- [ ] Chrome (mobile & desktop)
- [ ] Firefox (mobile & desktop)
- [ ] Safari (iOS & macOS)
- [ ] Edge (Windows)
- [ ] Samsung Internet (Android)

### Testing Tools

1. **Chrome DevTools**
   - Device emulation
   - Touch simulation
   - Performance profiling

2. **Responsively App**
   - Multiple device preview
   - Network throttling

3. **BrowserStack**
   - Real device testing
   - Platform coverage

---

## Best Practices

### 1. Mobile-First CSS

```jsx
// ✅ DO: Start with mobile
className="text-sm md:text-base"

// ❌ DON'T: Start with desktop
className="text-lg sm:text-sm"
```

### 2. Flexible Layouts

```jsx
// ✅ DO: Use flexible grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// ❌ DON'T: Fixed width
className="w-1200px"
```

### 3. Touch Target Sizing

```jsx
// ✅ DO: 44px minimum
className={`${TOUCH_SIZES.medium} px-4 py-2`}

// ❌ DON'T: Too small
className="px-2 py-1 text-xs"
```

### 4. Responsive Typography

```jsx
// ✅ DO: Adjust text size
className="text-sm md:text-base lg:text-lg"

// ❌ DON'T: Single fixed size
className="text-lg"
```

### 5. Image Optimization

```jsx
// ✅ DO: Use ResponsiveImage component
<ResponsiveImage src="photo.jpg" responsive={true} />

// ❌ DON'T: Oversized images
<img src="4000x3000.jpg" style={{width: "400px"}} />
```

### 6. Conditional Rendering

```jsx
// ✅ DO: Use hooks
const isMobile = useIsMobile();
return isMobile ? <MobileMenu /> : <DesktopMenu />;

// ❌ DON'T: CSS display-none only
className="hidden md:block"
```

### 7. Performance

```jsx
// ✅ DO: Lazy load on mobile
const isMobile = useIsMobile();
if (isMobile) {
  return <MobileVersion />;
}

// Use debounce for resize
const handleResize = useDebounce(updateLayout, 300);
```

### 8. Accessibility

```jsx
// ✅ DO: Proper focus states
className="focus:ring-2 focus:ring-primary-500"

// ✅ DO: Sufficient color contrast
className="text-gray-900 bg-white"

// ✅ DO: Semantic HTML
<button> not <div onClick={}>

// ✅ DO: ARIA labels
<button aria-label="Close menu">
```

---

## Component Responsive Prop Reference

All major components accept a `responsive` prop to enable responsive features:

```jsx
<DataTable responsive={true} />
<Modal responsive={true} />
<FormField responsive={true} />
<Button responsive={true} />
<ResponsiveImage responsive={true} />
```

When `responsive={true}`:
- Components adapt to screen size automatically
- Touch targets are optimized for mobile
- Layouts change based on breakpoints
- Text sizes adjust appropriately

---

## Common Responsive Patterns

### Full-Width Container with Padding

```jsx
className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8"
```

### Responsive Grid

```jsx
className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
```

### Responsive Typography

```jsx
className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
```

### Responsive Spacing

```jsx
className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6"
```

### Flexible Button Group

```jsx
className="flex flex-col sm:flex-row gap-2 md:gap-4"
```

---

## Troubleshooting

### Issue: Content overflows on mobile

**Solution:** Check max-width and padding
```jsx
// ✅ Correct
className="w-full max-w-md px-4"

// ❌ Wrong
className="w-96"
```

### Issue: Touch targets too small

**Solution:** Use TOUCH_SIZES constants
```jsx
// ✅ Correct
className={`${TOUCH_SIZES.medium} px-4`}

// ❌ Wrong
className="px-2 py-1"
```

### Issue: Layout breaks at certain sizes

**Solution:** Check breakpoint visibility
```jsx
// Use hidden/block utilities
className="hidden md:block"  // Hide on mobile
className="block md:hidden"  // Hide on desktop
```

### Issue: Images not responsive

**Solution:** Use ResponsiveImage component
```jsx
// ✅ Correct
<ResponsiveImage src="..." responsive={true} />

// ❌ Wrong - Fixed size
<img src="..." style={{width: "500px"}} />
```

---

## Summary

The responsive design system provides:

✅ Mobile-first breakpoints (xs to 2xl)
✅ Touch-friendly components (44px+ minimum)
✅ Automatic responsive layouts
✅ Custom React hooks for breakpoint detection
✅ Comprehensive component updates
✅ WCAG accessibility compliance
✅ Performance optimization
✅ Easy-to-use utility helpers

All components work seamlessly across mobile, tablet, and desktop devices with optimal user experience on every screen size.
