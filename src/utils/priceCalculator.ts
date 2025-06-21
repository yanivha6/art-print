import { PRICING } from '../types/order';

export const calculatePrice = (width: number, height: number): number => {
  const area = width * height;
  const basePrice = area * PRICING.PRICE_PER_CM2;
  return Math.max(Math.round(basePrice), PRICING.MINIMUM_PRICE);
};

export const formatPrice = (price: number): string => {
  return `₪${price.toLocaleString('he-IL')}`;
};

export const calculateSizeForPrice = (targetPrice: number): { width: number; height: number } => {
  const targetArea = targetPrice / PRICING.PRICE_PER_CM2;
  const sideLength = Math.sqrt(targetArea);
  return {
    width: Math.round(sideLength),
    height: Math.round(sideLength)
  };
};
