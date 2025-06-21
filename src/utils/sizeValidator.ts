import { SIZE_CONSTRAINTS } from '../types/order';

export interface SizeValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateCanvasSize = (width: number, height: number): SizeValidationResult => {
  const errors: string[] = [];

  if (width < SIZE_CONSTRAINTS.MIN_WIDTH) {
    errors.push(`הרוחב המינימלי הוא ${SIZE_CONSTRAINTS.MIN_WIDTH} ס"מ`);
  }

  if (height < SIZE_CONSTRAINTS.MIN_HEIGHT) {
    errors.push(`הגובה המינימלי הוא ${SIZE_CONSTRAINTS.MIN_HEIGHT} ס"מ`);
  }

  if (width > SIZE_CONSTRAINTS.MAX_WIDTH) {
    errors.push(`הרוחב המקסימלי הוא ${SIZE_CONSTRAINTS.MAX_WIDTH} ס"מ`);
  }

  if (height > SIZE_CONSTRAINTS.MAX_HEIGHT) {
    errors.push(`הגובה המקסימלי הוא ${SIZE_CONSTRAINTS.MAX_HEIGHT} ס"מ`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const calculateDefaultSize = (aspectRatio: number): { width: number; height: number } => {
  const largerSide = SIZE_CONSTRAINTS.DEFAULT_LARGE_SIDE;
  
  if (aspectRatio >= 1) {
    // Width is larger or equal
    return {
      width: largerSide,
      height: Math.round(largerSide / aspectRatio)
    };
  } else {
    // Height is larger
    return {
      width: Math.round(largerSide * aspectRatio),
      height: largerSide
    };
  }
};

export const calculateDimensionFromOther = (
  knownDimension: number,
  aspectRatio: number,
  isWidth: boolean
): number => {
  if (isWidth) {
    // Calculate height from width
    return Math.round(knownDimension / aspectRatio);
  } else {
    // Calculate width from height
    return Math.round(knownDimension * aspectRatio);
  }
};

export const constrainSize = (width: number, height: number): { width: number; height: number } => {
  let constrainedWidth = Math.max(SIZE_CONSTRAINTS.MIN_WIDTH, Math.min(width, SIZE_CONSTRAINTS.MAX_WIDTH));
  let constrainedHeight = Math.max(SIZE_CONSTRAINTS.MIN_HEIGHT, Math.min(height, SIZE_CONSTRAINTS.MAX_HEIGHT));
  
  return {
    width: constrainedWidth,
    height: constrainedHeight
  };
};
