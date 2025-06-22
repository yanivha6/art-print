/**
 * Utility functions for basket operations
 */

import type { BasketItem, BasketState, BasketSummary } from '../types/order';

// Storage key for localStorage
export const BASKET_STORAGE_KEY = 'artprint_basket';

// Maximum items in basket
export const MAX_BASKET_ITEMS = 100;

// Maximum quantity per item
export const MAX_ITEM_QUANTITY = 99;

/**
 * Generate a unique ID for basket items
 */
export const generateBasketItemId = (): string => {
  return `basket_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate basket summary from items
 */
export const calculateBasketSummary = (items: BasketItem[]): BasketSummary => {
  const itemCount = items.length;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
  
  return {
    itemCount,
    totalItems,
    subtotal,
    totalPrice: subtotal // No additional fees for now
  };
};

/**
 * Save basket state to localStorage
 */
export const saveBasketToStorage = (basketState: BasketState): boolean => {
  try {
    const serializedState = JSON.stringify({
      ...basketState,
      lastUpdated: new Date().toISOString()
    });
    localStorage.setItem(BASKET_STORAGE_KEY, serializedState);
    return true;
  } catch (error) {
    console.error('Failed to save basket to localStorage:', error);
    return false;
  }
};

/**
 * Load basket state from localStorage
 */
export const loadBasketFromStorage = (): BasketState | null => {
  try {
    const serializedState = localStorage.getItem(BASKET_STORAGE_KEY);
    if (!serializedState) {
      return null;
    }

    const parsedState = JSON.parse(serializedState);
    
    // Validate the structure
    if (!parsedState.items || !Array.isArray(parsedState.items)) {
      return null;
    }

    // Convert date strings back to Date objects
    const items: BasketItem[] = parsedState.items.map((item: any) => ({
      ...item,
      addedAt: new Date(item.addedAt)
    }));

    return {
      items,
      maxItems: parsedState.maxItems || MAX_BASKET_ITEMS,
      lastUpdated: new Date(parsedState.lastUpdated)
    };
  } catch (error) {
    console.error('Failed to load basket from localStorage:', error);
    return null;
  }
};

/**
 * Clear basket from localStorage
 */
export const clearBasketStorage = (): void => {
  try {
    localStorage.removeItem(BASKET_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear basket from localStorage:', error);
  }
};

/**
 * Validate basket item data integrity
 */
export const validateBasketItem = (item: any): item is BasketItem => {
  return (
    typeof item.id === 'string' &&
    typeof item.quantity === 'number' &&
    item.quantity > 0 &&
    item.quantity <= MAX_ITEM_QUANTITY &&
    typeof item.basePrice === 'number' &&
    typeof item.totalPrice === 'number' &&
    item.image &&
    item.canvasSize &&
    item.canvasOptions &&
    item.addedAt instanceof Date
  );
};

/**
 * Clean invalid items from basket
 */
export const cleanBasketItems = (items: BasketItem[]): BasketItem[] => {
  return items.filter(validateBasketItem);
};

/**
 * Check if basket has reached maximum capacity
 */
export const isBasketFull = (items: BasketItem[], maxItems: number = MAX_BASKET_ITEMS): boolean => {
  return items.length >= maxItems;
};

/**
 * Get total number of items (including quantities)
 */
export const getTotalItemCount = (items: BasketItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

/**
 * Find item in basket by ID
 */
export const findBasketItem = (items: BasketItem[], itemId: string): BasketItem | undefined => {
  return items.find(item => item.id === itemId);
};

/**
 * Update item quantity with validation
 */
export const updateItemQuantity = (items: BasketItem[], itemId: string, quantity: number): BasketItem[] => {
  if (quantity < 1 || quantity > MAX_ITEM_QUANTITY) {
    return items;
  }

  return items.map(item => 
    item.id === itemId 
      ? { ...item, quantity }
      : item
  );
};

/**
 * Remove item from basket
 */
export const removeBasketItem = (items: BasketItem[], itemId: string): BasketItem[] => {
  return items.filter(item => item.id !== itemId);
};

/**
 * Add item to basket with validation
 */
export const addItemToBasket = (
  items: BasketItem[], 
  newItem: Omit<BasketItem, 'id' | 'addedAt' | 'quantity'>,
  maxItems: number = MAX_BASKET_ITEMS
): { success: boolean; items: BasketItem[]; error?: string } => {
  
  // Check if basket is full
  if (items.length >= maxItems) {
    return {
      success: false,
      items,
      error: `הגעתם למקסימום של ${maxItems} פריטים בעגלה`
    };
  }

  // Create new basket item
  const basketItem: BasketItem = {
    ...newItem,
    id: generateBasketItemId(),
    quantity: 1,
    addedAt: new Date()
  };

  return {
    success: true,
    items: [...items, basketItem]
  };
};

/**
 * Format price for display
 */
export const formatBasketPrice = (price: number): string => {
  return `₪${price.toLocaleString('he-IL')}`;
};

/**
 * Get basket age in days
 */
export const getBasketAge = (lastUpdated: Date): number => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastUpdated.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if basket is considered stale (older than 30 days)
 */
export const isBasketStale = (lastUpdated: Date): boolean => {
  return getBasketAge(lastUpdated) > 30;
};
