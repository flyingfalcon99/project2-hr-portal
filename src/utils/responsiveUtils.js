/**
 * Responsive Design Utilities and Constants
 * Provides breakpoints, responsive helpers, and design patterns
 */

/**
 * Tailwind CSS Breakpoints
 * Mobile-first approach
 */
export const BREAKPOINTS = {
  xs: 0,        // Extra small (mobile)
  sm: 640,      // Small (landscape mobile)
  md: 768,      // Medium (tablet)
  lg: 1024,     // Large (desktop)
  xl: 1280,     // Extra large (wide desktop)
  '2xl': 1536,  // 2X large (ultra-wide)
};

/**
 * Device Detection Helpers
 * Use in hooks for responsive behavior
 */
export const DEVICE_QUERIES = {
  mobile: '@media (max-width: 639px)',           // xs to sm
  mobileLandscape: '@media (max-width: 1023px)', // xs to lg
  tablet: '@media (min-width: 768px)',           // md and up
  desktop: '@media (min-width: 1024px)',         // lg and up
  wideDesktop: '@media (min-width: 1280px)',     // xl and up
};

/**
 * Touch Target Sizes (minimum 44x44px for accessibility)
 */
export const TOUCH_SIZES = {
  small: 'h-8 w-8',      // 32x32px - small buttons
  medium: 'h-10 w-10',   // 40x40px - standard buttons
  large: 'h-12 w-12',    // 48x48px - large buttons (mobile)
  xlarge: 'h-14 w-14',   // 56x56px - extra large buttons
};

/**
 * Responsive Container Padding
 */
export const CONTAINER_PADDING = {
  mobile: 'px-4',        // 16px padding on mobile
  tablet: 'px-6',        // 24px padding on tablet
  desktop: 'px-8',       // 32px padding on desktop
  combined: 'px-4 md:px-6 lg:px-8',
};

/**
 * Responsive Font Sizes
 */
export const RESPONSIVE_TEXT = {
  h1: 'text-3xl sm:text-4xl lg:text-5xl',
  h2: 'text-2xl sm:text-3xl lg:text-4xl',
  h3: 'text-xl sm:text-2xl lg:text-3xl',
  h4: 'text-lg sm:text-xl lg:text-2xl',
  body: 'text-base sm:text-base lg:text-base',
  small: 'text-sm sm:text-sm lg:text-base',
  xs: 'text-xs sm:text-xs lg:text-sm',
};

/**
 * Responsive Grid Layouts
 */
export const RESPONSIVE_GRID = {
  twoColumns: 'grid grid-cols-1 md:grid-cols-2',
  threeColumns: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  fourColumns: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  twoColumnsMobile: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

/**
 * Responsive Spacing
 */
export const RESPONSIVE_SPACING = {
  section: 'py-8 md:py-12 lg:py-16',
  container: 'mx-auto max-w-7xl px-4 md:px-6 lg:px-8',
  gap: 'gap-4 md:gap-6 lg:gap-8',
};

/**
 * Mobile-Optimized Classes
 */
export const MOBILE_CLASSES = {
  // Hide on mobile, show on tablet+
  hideMobile: 'hidden md:block',
  
  // Show only on mobile
  showMobile: 'md:hidden',
  
  // Responsive height
  mobileHeight: 'h-auto md:h-full',
  
  // Mobile-friendly columns
  mobileStack: 'flex flex-col md:flex-row',
};

/**
 * Responsive Table Classes
 * For converting tables to card layout on mobile
 */
export const TABLE_RESPONSIVE = {
  wrapper: 'w-full overflow-x-auto md:overflow-visible',
  table: 'w-full border-collapse',
  headerHide: 'hidden md:table-header-group',
  bodyCell: 'block md:table-cell w-full md:w-auto',
  cellLabel: "data-label before:content-[attr(data-label)] before:font-bold before:mr-4 block md:hidden",
};

/**
 * Form Responsive Classes
 */
export const FORM_RESPONSIVE = {
  row: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  rowThree: 'grid grid-cols-1 md:grid-cols-3 gap-4',
  fullWidth: 'md:col-span-2',
};

/**
 * Modal Responsive Classes
 */
export const MODAL_RESPONSIVE = {
  container: 'fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4',
  modal: 'w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh]',
  header: 'px-4 md:px-6 py-4',
  body: 'px-4 md:px-6 py-4 overflow-y-auto',
  footer: 'px-4 md:px-6 py-4 gap-2',
};

/**
 * Navigation Responsive Classes
 */
export const NAV_RESPONSIVE = {
  menu: 'hidden md:flex',
  mobileMenu: 'md:hidden',
  button: 'h-10 w-10 md:h-12 md:w-12', // Touch-friendly
};

/**
 * Button Responsive Classes
 */
export const BUTTON_RESPONSIVE = {
  primary: 'px-4 py-2 md:px-6 md:py-3 text-sm md:text-base',
  small: 'px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm',
  large: 'px-6 py-3 md:px-8 md:py-4 text-base md:text-lg',
  block: 'w-full',
};

/**
 * Input Responsive Classes
 */
export const INPUT_RESPONSIVE = {
  base: 'w-full px-3 md:px-4 py-2 md:py-3 text-base md:text-base',
  large: 'w-full px-4 py-3 md:px-5 md:py-4 text-base md:text-lg',
};

/**
 * Card Responsive Classes
 */
export const CARD_RESPONSIVE = {
  padding: 'p-4 md:p-6 lg:p-8',
  gap: 'gap-4 md:gap-6',
};

/**
 * Custom Hook: useMediaQuery
 * Usage: const isMobile = useMediaQuery('(max-width: 768px)');
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
}

/**
 * Custom Hook: useBreakpoint
 * Usage: const isMobile = useBreakpoint('sm');
 */
export function useBreakpoint(breakpoint = 'md') {
  const breakpointValue = BREAKPOINTS[breakpoint] || 768;
  const query = `(min-width: ${breakpointValue}px)`;
  return useMediaQuery(query);
}

/**
 * Custom Hook: useIsMobile
 * Quick check if device is mobile
 */
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
}

/**
 * Custom Hook: useIsTablet
 * Quick check if device is tablet or larger
 */
export function useIsTablet() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
}

/**
 * Responsive Image Helper
 * Generate responsive image srcsets
 */
export function generateImageSrcSet(baseUrl, sizes = [640, 768, 1024, 1280]) {
  return sizes
    .map((size) => {
      const url = baseUrl.replace(/\.(jpg|png|webp)$/, `_${size}.$1`);
      return `${url} ${size}w`;
    })
    .join(', ');
}

/**
 * Debounce Hook for responsive callbacks
 * Usage: const debouncedCallback = useDebounce(callback, 250);
 */
export function useDebounce(callback, delay = 250) {
  const timeoutRef = React.useRef(null);

  return React.useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

/**
 * Get viewport dimensions
 */
export function useViewport() {
  const [dimensions, setDimensions] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}

/**
 * Example Usage:
 * 
 * // In a component
 * import { useIsMobile, TOUCH_SIZES, RESPONSIVE_GRID } from '@/utils/responsiveUtils';
 * 
 * function MyComponent() {
 *   const isMobile = useIsMobile();
 *   
 *   return (
 *     <div className={RESPONSIVE_GRID.threeColumns}>
 *       <button className={TOUCH_SIZES.large}>
 *         {isMobile ? 'Tap' : 'Click'} Me
 *       </button>
 *     </div>
 *   );
 * }
 */

export default {
  BREAKPOINTS,
  DEVICE_QUERIES,
  TOUCH_SIZES,
  CONTAINER_PADDING,
  RESPONSIVE_TEXT,
  RESPONSIVE_GRID,
  RESPONSIVE_SPACING,
  MOBILE_CLASSES,
  TABLE_RESPONSIVE,
  FORM_RESPONSIVE,
  MODAL_RESPONSIVE,
  NAV_RESPONSIVE,
  BUTTON_RESPONSIVE,
  INPUT_RESPONSIVE,
  CARD_RESPONSIVE,
};
