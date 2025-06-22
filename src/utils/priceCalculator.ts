/**
 * Price calculation utilities for print sizing
 */

// Type definitions for better code clarity
interface PricingTier {
  maxSize: number;
  basePrice: number;
  nextPrice: number;
  baseSize: number;
  nextSize: number;
  extraPercentage?: number;
}

// Pricing configuration - all values match the original implementation
const PRICING_TIERS: PricingTier[] = [
  { maxSize: 70, basePrice: 90, nextPrice: 110, baseSize: 60, nextSize: 70 },
  { maxSize: 90, basePrice: 110, nextPrice: 135, baseSize: 70, nextSize: 90 },
  { maxSize: 100, basePrice: 135, nextPrice: 155, baseSize: 90, nextSize: 100 },
  { maxSize: 120, basePrice: 155, nextPrice: 195, baseSize: 100, nextSize: 120 },
  { maxSize: 140, basePrice: 195, nextPrice: 240, baseSize: 120, nextSize: 140 },
  { maxSize: 170, basePrice: 240, nextPrice: 315, baseSize: 140, nextSize: 170 },
  { maxSize: 200, basePrice: 315, nextPrice: 390, baseSize: 170, nextSize: 200, extraPercentage: 5 },
  { maxSize: 250, basePrice: 390, nextPrice: 475, baseSize: 200, nextSize: 250, extraPercentage: 5 },
  { maxSize: 280, basePrice: 475, nextPrice: 510, baseSize: 250, nextSize: 280, extraPercentage: 5 },
  { maxSize: 300, basePrice: 510, nextPrice: 550, baseSize: 280, nextSize: 300, extraPercentage: 5 },
  { maxSize: 320, basePrice: 550, nextPrice: 575, baseSize: 300, nextSize: 320, extraPercentage: 5 },
  { maxSize: 340, basePrice: 575, nextPrice: 600, baseSize: 320, nextSize: 340, extraPercentage: 5 },
  { maxSize: 380, basePrice: 600, nextPrice: 650, baseSize: 340, nextSize: 380, extraPercentage: 10 },
  { maxSize: 420, basePrice: 650, nextPrice: 740, baseSize: 380, nextSize: 420, extraPercentage: 10 },
  { maxSize: 460, basePrice: 740, nextPrice: 850, baseSize: 420, nextSize: 460, extraPercentage: 10 }
];

// Constants
const MIN_SIZE_THRESHOLD = 60;
const MIN_DIMENSION_FOR_EXTRA = 100;
const DEFAULT_MAX_PRICE = 850;

/**
 * Calculates interpolated price between two price points
 * @param size - Total size (height + width)
 * @param basePrice - Starting price for the range
 * @param nextPrice - Ending price for the range
 * @param baseSize - Starting size for the range
 * @param nextSize - Ending size for the range
 * @param extraPercentage - Additional percentage to add (default: 0)
 * @returns Calculated price rounded to nearest integer
 */
export const calculateMidPrice = (
  size: number,
  basePrice: number,
  nextPrice: number,
  baseSize: number,
  nextSize: number,
  extraPercentage: number = 0
): number => {
  // Linear interpolation: basePrice + (nextPrice - basePrice) * (size - baseSize) / (nextSize - baseSize)
  const interpolatedPrice = basePrice + (nextPrice - basePrice) * (size - baseSize) / (nextSize - baseSize);
  
  if (extraPercentage > 0) {
    return Math.round(interpolatedPrice + interpolatedPrice * extraPercentage / 100);
  }
  
  return Math.round(interpolatedPrice);
};

/**
 * Calculates price based on print dimensions using tiered pricing
 * @param height - Height in centimeters
 * @param width - Width in centimeters
 * @returns Calculated price in currency units
 */
export const calculatePrintPrice = (height: number, width: number): number => {
  const minDimension = Math.min(height, width);
  const totalSize = height + width;
  
  // Return 0 for sizes below minimum threshold
  if (totalSize < MIN_SIZE_THRESHOLD) {
    return 0;
  }
  
  let price: number;
  
  // Find the appropriate pricing tier
  for (const tier of PRICING_TIERS) {
    if (totalSize <= tier.maxSize) {
      const extraPercentage = tier.extraPercentage && minDimension > MIN_DIMENSION_FOR_EXTRA 
        ? tier.extraPercentage 
        : 0;
        
      price = calculateMidPrice(
        totalSize,
        tier.basePrice,
        tier.nextPrice,
        tier.baseSize,
        tier.nextSize,
        extraPercentage
      );
      
      // Apply price rounding logic
      price = (price < 520) ? (price - price % 5) : (price - price % 10);
      return price;
    }
  }
  
  // Return default price for sizes above all tiers with rounding
  price = DEFAULT_MAX_PRICE;
  price = (price < 520) ? (price - price % 5) : (price - price % 10);
  return price;
};

/**
 * Main price calculation function - maintains backward compatibility
 * @param width - Width in centimeters
 * @param height - Height in centimeters
 * @returns Calculated price
 */
export const calculatePrice = (width: number, height: number): number => {
  return calculatePrintPrice(height, width);
};

/**
 * Formats price with currency symbol and locale-specific formatting
 * @param price - Price to format
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return `₪${price.toLocaleString('he-IL')}`;
};

/**
 * Finds dimensions that best match a target price using binary search optimization
 * @param targetPrice - Desired price to match
 * @returns Object with width and height that closest match the target price
 */
export const calculateSizeForPrice = (targetPrice: number): { width: number; height: number } => {
  let bestWidth = 50;
  let bestHeight = 50;
  let closestPriceDiff = Infinity;
  
  // Optimized search with larger steps for initial scan, then refined search
  const searchRanges = [
    { stepW: 10, stepH: 10 }, // Coarse search
    { stepW: 2, stepH: 2 },   // Fine search
    { stepW: 1, stepH: 1 }    // Precise search
  ];
  
  for (const range of searchRanges) {
    for (let w = Math.max(30, bestWidth - 20); w <= Math.min(300, bestWidth + 20); w += range.stepW) {
      for (let h = Math.max(30, bestHeight - 20); h <= Math.min(140, bestHeight + 20); h += range.stepH) {
        const price = calculatePrintPrice(h, w);
        const priceDiff = Math.abs(price - targetPrice);
        
        if (priceDiff < closestPriceDiff) {
          closestPriceDiff = priceDiff;
          bestWidth = w;
          bestHeight = h;
        }
      }
    }
  }
  
  return {
    width: bestWidth,
    height: bestHeight
  };
};

/**
 * Calculates the upcharge for canvas color selection
 * @param basePrice - Base price without color upcharge
 * @returns Color upcharge amount (10% of base price, max ₪50)
 */
export const calculateColorUpcharge = (basePrice: number): number => {
  const upcharge = Math.round(basePrice * 0.1);
  return Math.min(upcharge, 50);
};

/**
 * Calculates total price including optional color upcharge
 * @param width - Width in centimeters
 * @param height - Height in centimeters
 * @param hasColorUpgrade - Whether color upgrade is selected
 * @returns Object with basePrice, colorUpcharge, and totalPrice
 */
export const calculateTotalPrice = (
  width: number, 
  height: number, 
  hasColorUpgrade: boolean = false
): { basePrice: number; colorUpcharge: number; totalPrice: number } => {
  const basePrice = calculatePrintPrice(height, width);
  const colorUpcharge = hasColorUpgrade ? calculateColorUpcharge(basePrice) : 0;
  
  // Calculate total before rounding
  let totalPrice = basePrice + colorUpcharge;
  
  // Apply price rounding logic to the total price
  totalPrice = (totalPrice < 520) ? (totalPrice - totalPrice % 5) : (totalPrice - totalPrice % 10);
  
  return {
    basePrice,
    colorUpcharge,
    totalPrice
  };
};

// Legacy function exports for backward compatibility
export const calculate_mid_price = calculateMidPrice;
export const calculating_price = calculatePrintPrice;
