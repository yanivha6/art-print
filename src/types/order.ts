export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
}

export interface ImageFile {
  file: File;
  preview: string;
  originalWidth: number;
  originalHeight: number;
  aspectRatio: number;
  cropData?: CropData;
  croppedPreview?: string;
  croppedWidth?: number;
  croppedHeight?: number;
  croppedAspectRatio?: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export interface CanvasOptions {
  sideColor: string; // Hex color code (e.g., "#FF5733")
  colorUpcharge: number; // Additional cost for color
}

export interface OrderDetails {
  image: ImageFile;
  canvasSize: CanvasSize;
  canvasOptions: CanvasOptions;
  basePrice: number; // Price without extras
  totalPrice: number; // Final price including extras
}

export interface ContactInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

// Basket item - represents one configured print
export interface BasketItem {
  id: string;
  image: ImageFile;
  canvasSize: CanvasSize;
  canvasOptions: CanvasOptions;
  basePrice: number;
  totalPrice: number;
  quantity: number;
  addedAt: Date;
}

// Basket state for persistence
export interface BasketState {
  items: BasketItem[];
  maxItems: number;
  lastUpdated: Date;
}

// Basket summary for display
export interface BasketSummary {
  itemCount: number;
  totalItems: number; // considering quantities
  subtotal: number;
  totalPrice: number;
}

// Basket context interface
export interface BasketContextType {
  basketItems: BasketItem[];
  basketSummary: BasketSummary;
  addItem: (item: Omit<BasketItem, 'id' | 'addedAt' | 'quantity'>) => boolean;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItem: (itemId: string, updates: Partial<Pick<BasketItem, 'image' | 'canvasSize' | 'canvasOptions' | 'basePrice' | 'totalPrice'>>) => void;
  clearBasket: () => void;
  getItem: (itemId: string) => BasketItem | undefined;
  isBasketFull: boolean;
  totalItems: number;
  maxItems: number;
}

// Updated Order to handle multiple items
export interface Order {
  id: string;
  basketItems: BasketItem[];
  subtotal: number;
  totalPrice: number;
  contactInfo: ContactInfo;
  createdAt: Date;
  status: 'pending' | 'confirmed' | 'processing' | 'completed';
}

export const SIZE_CONSTRAINTS = {
  MIN_WIDTH: 30,
  MIN_HEIGHT: 30,
  MAX_WIDTH: 300,
  MAX_HEIGHT: 140,
  DEFAULT_LARGE_SIDE: 100
} as const;

export const PRICING = {
  PRICE_PER_CM2: 0.8,
  MINIMUM_PRICE: 150
} as const;

// Feature flags configuration
export const FEATURE_FLAGS = {
  CANVAS_COLOR_SELECTION: true, // Can be toggled to disable the feature
} as const;

// Canvas color configuration
export const CANVAS_COLOR_CONFIG = {
  UPCHARGE_PERCENTAGE: 10,
  MAX_UPCHARGE: 50,
  DEFAULT_COLOR: '#FFFFFF', // White
} as const;

// Predefined color palette
export const PREDEFINED_COLORS = [
  { hex: '#FFFFFF', name: 'לבן' },      // White (default)
  { hex: '#000000', name: 'שחור' },     // Black
  { hex: '#8B4513', name: 'חום' },      // Brown
  { hex: '#D2B48C', name: 'בז\'' },     // Beige
  { hex: '#708090', name: 'אפור' },     // Gray
  { hex: '#2F4F4F', name: 'אפור כהה' }, // Dark Gray
  { hex: '#8FBC8F', name: 'ירוק בהיר' }, // Light Green
  { hex: '#4682B4', name: 'כחול' },     // Blue
] as const;
