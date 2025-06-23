/**
 * Color utilities for Blacksquare
 *
 * This library provides helper functions for working with the color system.
 * It includes tools for OKLCH color manipulation, contrast checking, and theme handling.
 */

// OKLCH color type
interface OklchColor {
  l: number;  // Lightness: 0-1
  c: number;  // Chroma: 0-0.4 typically
  h: number;  // Hue: 0-360
}

// RGB color type
interface RgbColor {
  r: number;  // Red: 0-255
  g: number;  // Green: 0-255
  b: number;  // Blue: 0-255
}

/**
 * Convert OKLCH to RGB
 * This is a simplified implementation
 * For production, use a library like culori or color2k
 */
export function oklchToRgb(oklch: OklchColor): RgbColor {
  // This is a simplified approximation
  // In a real app, use a proper color conversion library
  // Converting from OKLCH to RGB is complex and requires multiple steps

  // Example implementation (very simplified)
  const { l, c, h } = oklch;

  // Convert hue to radians
  const hueRadians = h * (Math.PI / 180);

  // Simple conversion (not accurate, just for demo)
  const r = Math.round(255 * (l + c * Math.cos(hueRadians)));
  const g = Math.round(255 * (l + c * Math.cos(hueRadians - (2 * Math.PI / 3))));
  const b = Math.round(255 * (l + c * Math.cos(hueRadians + (2 * Math.PI / 3))));

  return {
    r: Math.max(0, Math.min(255, r)),
    g: Math.max(0, Math.min(255, g)),
    b: Math.max(0, Math.min(255, b))
  };
}

/**
 * Convert RGB to CSS string format for Tailwind
 */
export function rgbToCssString(rgb: RgbColor): string {
  return `${rgb.r} ${rgb.g} ${rgb.b}`;
}

/**
 * Convert OKLCH directly to CSS string
 */
export function oklchToCssString(oklch: OklchColor): string {
  return rgbToCssString(oklchToRgb(oklch));
}

/**
 * Calculate the contrast ratio between two colors
 * WCAG 2.1 requires:
 * - 4.5:1 for normal text
 * - 3:1 for large text
 * - 7:1 for enhanced contrast
 */
export function getContrastRatio(rgb1: RgbColor, rgb2: RgbColor): number {
  // Calculate relative luminance for each color
  const luminance1 = calculateRelativeLuminance(rgb1);
  const luminance2 = calculateRelativeLuminance(rgb2);

  // Calculate contrast ratio
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance according to WCAG 2.1
 */
function calculateRelativeLuminance(rgb: RgbColor): number {
  // Convert RGB to linear values
  const rsrgb = rgb.r / 255;
  const gsrgb = rgb.g / 255;
  const bsrgb = rgb.b / 255;

  // Convert to linear RGB
  const r = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
  const g = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
  const b = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);

  // Calculate luminance (L = 0.2126 * R + 0.7152 * G + 0.0722 * B)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Check if color meets WCAG contrast requirements
 */
export function meetsContrastRequirements(
  foreground: RgbColor,
  background: RgbColor,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);

  if (level === 'AA') {
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  } else {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
}

/**
 * Adjust lightness to meet contrast requirements
 */
export function adjustLightnessForContrast(
  color: OklchColor,
  backgroundColor: OklchColor,
  targetRatio: number = 4.5
): OklchColor {
  let adjustedColor = { ...color };
  let rgbColor = oklchToRgb(adjustedColor);
  let rgbBackground = oklchToRgb(backgroundColor);

  // Check current contrast
  let currentRatio = getContrastRatio(rgbColor, rgbBackground);

  // Determine if we need to lighten or darken
  const needsLightening = backgroundColor.l < 0.5;

  // Iteratively adjust lightness until we meet contrast
  let steps = 0;
  const maxSteps = 20; // Prevent infinite loops

  while (currentRatio < targetRatio && steps < maxSteps) {
    if (needsLightening) {
      adjustedColor.l = Math.min(1, adjustedColor.l + 0.05);
    } else {
      adjustedColor.l = Math.max(0, adjustedColor.l - 0.05);
    }

    rgbColor = oklchToRgb(adjustedColor);
    currentRatio = getContrastRatio(rgbColor, rgbBackground);
    steps++;
  }

  return adjustedColor;
}

/**
 * Get current theme mode
 */
export function getCurrentTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';

  // Check for class-based dark mode
  if (document.documentElement.classList.contains('dark')) {
    return 'dark';
  }

  // Check for stored preference
  const storedTheme = localStorage.getItem('darkMode');
  if (storedTheme === 'true') return 'dark';
  if (storedTheme === 'false') return 'light';

  // Check for system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

/**
 * Toggle theme mode
 */
export function toggleTheme(): void {
  if (typeof document === 'undefined') return;

  const isDark = document.documentElement.classList.contains('dark');
  document.documentElement.classList.toggle('dark', !isDark);
  localStorage.setItem('darkMode', (!isDark).toString());
}

/**
 * Set specific theme mode
 */
export function setTheme(mode: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;

  document.documentElement.classList.toggle('dark', mode === 'dark');
  localStorage.setItem('darkMode', (mode === 'dark').toString());
}
