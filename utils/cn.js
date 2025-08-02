/**
 * Utility function untuk menggabungkan className dengan conditional logic
 * Mirip dengan clsx atau classnames library
 */
export function cn(...classes) {
  return classes.flat().filter(Boolean).join(" ");
}
