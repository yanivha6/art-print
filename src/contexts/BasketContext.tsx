import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { BasketItem, BasketState, BasketSummary, BasketContextType } from '../types/order';
import {
  calculateBasketSummary,
  saveBasketToStorage,
  loadBasketFromStorage,
  clearBasketStorage,
  addItemToBasket,
  removeBasketItem,
  updateItemQuantity,
  findBasketItem,
  cleanBasketItems,
  isBasketFull,
  getTotalItemCount,
  MAX_BASKET_ITEMS,
  isBasketStale
} from '../utils/basketUtils';

// Action types for basket reducer
type BasketAction =
  | { type: 'LOAD_BASKET'; payload: BasketState }
  | { type: 'ADD_ITEM'; payload: Omit<BasketItem, 'id' | 'addedAt' | 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'UPDATE_ITEM'; payload: { itemId: string; updates: Partial<Pick<BasketItem, 'image' | 'canvasSize' | 'canvasOptions' | 'basePrice' | 'totalPrice'>> } }
  | { type: 'CLEAR_BASKET' }
  | { type: 'CLEAN_INVALID_ITEMS' };

// Initial basket state
const initialBasketState: BasketState = {
  items: [],
  maxItems: MAX_BASKET_ITEMS,
  lastUpdated: new Date()
};

// Basket reducer
const basketReducer = (state: BasketState, action: BasketAction): BasketState => {
  const newState = { ...state, lastUpdated: new Date() };

  switch (action.type) {
    case 'LOAD_BASKET':
      return action.payload;

    case 'ADD_ITEM': {
      const result = addItemToBasket(state.items, action.payload, state.maxItems);
      if (result.success) {
        return { ...newState, items: result.items };
      }
      // Show error to user (could be handled by the component calling this)
      console.warn('Failed to add item to basket:', result.error);
      return state;
    }

    case 'REMOVE_ITEM':
      return {
        ...newState,
        items: removeBasketItem(state.items, action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...newState,
        items: updateItemQuantity(state.items, action.payload.itemId, action.payload.quantity)
      };

    case 'UPDATE_ITEM': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.itemId
          ? { ...item, ...action.payload.updates }
          : item
      );
      return { ...newState, items: updatedItems };
    }

    case 'CLEAR_BASKET':
      return {
        ...newState,
        items: []
      };

    case 'CLEAN_INVALID_ITEMS':
      return {
        ...newState,
        items: cleanBasketItems(state.items)
      };

    default:
      return state;
  }
};

// Create context
const BasketContext = createContext<BasketContextType | undefined>(undefined);

// Custom hook to use basket context
export const useBasket = (): BasketContextType => {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
};

// Basket Provider component
interface BasketProviderProps {
  children: React.ReactNode;
}

export const BasketProvider: React.FC<BasketProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(basketReducer, initialBasketState);

  // Load basket from localStorage on mount
  useEffect(() => {
    const savedBasket = loadBasketFromStorage();
    if (savedBasket) {
      // Check if basket is stale and clean if necessary
      if (isBasketStale(savedBasket.lastUpdated)) {
        console.log('Basket is stale, clearing...');
        clearBasketStorage();
      } else {
        // Clean any invalid items before loading
        const cleanedBasket = {
          ...savedBasket,
          items: cleanBasketItems(savedBasket.items)
        };
        dispatch({ type: 'LOAD_BASKET', payload: cleanedBasket });
      }
    }
  }, []);

  // Save basket to localStorage whenever state changes
  useEffect(() => {
    if (state.items.length > 0) {
      saveBasketToStorage(state);
    } else {
      // Clear storage if basket is empty
      clearBasketStorage();
    }
  }, [state]);

  // Calculate basket summary
  const basketSummary: BasketSummary = calculateBasketSummary(state.items);

  // Basket operations
  const addItem = useCallback((item: Omit<BasketItem, 'id' | 'addedAt' | 'quantity'>): boolean => {
    const result = addItemToBasket(state.items, item, state.maxItems);
    if (result.success) {
      dispatch({ type: 'ADD_ITEM', payload: item });
      return true;
    }
    return false;
  }, [state.items, state.maxItems]);

  const removeItem = useCallback((itemId: string): void => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
    }
  }, [removeItem]);

  const updateItem = useCallback((
    itemId: string, 
    updates: Partial<Pick<BasketItem, 'image' | 'canvasSize' | 'canvasOptions' | 'basePrice' | 'totalPrice'>>
  ): void => {
    dispatch({ type: 'UPDATE_ITEM', payload: { itemId, updates } });
  }, []);

  const clearBasket = useCallback((): void => {
    dispatch({ type: 'CLEAR_BASKET' });
    clearBasketStorage();
  }, []);

  const getItem = useCallback((itemId: string): BasketItem | undefined => {
    return findBasketItem(state.items, itemId);
  }, [state.items]);

  // Context value
  const contextValue: BasketContextType = {
    basketItems: state.items,
    basketSummary,
    addItem,
    removeItem,
    updateQuantity,
    updateItem,
    clearBasket,
    getItem,
    isBasketFull: isBasketFull(state.items, state.maxItems),
    totalItems: getTotalItemCount(state.items),
    maxItems: state.maxItems
  };

  return (
    <BasketContext.Provider value={contextValue}>
      {children}
    </BasketContext.Provider>
  );
};

// Export context for testing purposes
export { BasketContext };
