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

export interface OrderDetails {
  image: ImageFile;
  canvasSize: CanvasSize;
  price: number;
}

export interface ContactInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

export interface Order {
  id: string;
  orderDetails: OrderDetails;
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
