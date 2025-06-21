import type { ImageFile, CropData } from '../types/order';

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface ImageProcessingResult {
  success: boolean;
  imageFile?: ImageFile;
  error?: string;
}

export const processImageFile = (file: File): Promise<ImageProcessingResult> => {
  return new Promise((resolve) => {
    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      resolve({
        success: false,
        error: 'סוג קובץ לא נתמך. אנא העלה קובץ JPEG, PNG או WebP'
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      resolve({
        success: false,
        error: 'גודל הקובץ חורג מ-10MB. אנא העלה קובץ קטן יותר'
      });
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      try {
        const originalWidth = img.naturalWidth;
        const originalHeight = img.naturalHeight;
        const aspectRatio = originalWidth / originalHeight;

        // Create preview URL
        const preview = URL.createObjectURL(file);

        const imageFile: ImageFile = {
          file,
          preview,
          originalWidth,
          originalHeight,
          aspectRatio
        };

        resolve({
          success: true,
          imageFile
        });
      } catch (error) {
        resolve({
          success: false,
          error: 'שגיאה בעיבוד התמונה'
        });
      }
    };

    img.onerror = () => {
      resolve({
        success: false,
        error: 'לא ניתן לטעון את התמונה. אנא ודא שהקובץ תקין'
      });
    };

    img.src = URL.createObjectURL(file);
  });
};

export const cleanupImagePreview = (preview: string) => {
  if (preview.startsWith('blob:')) {
    URL.revokeObjectURL(preview);
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 בתים';
  
  const k = 1024;
  const sizes = ['בתים', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getImageDimensionsText = (width: number, height: number): string => {
  return `${width.toLocaleString('he-IL')} × ${height.toLocaleString('he-IL')} פיקסלים`;
};

export interface CropImageResult {
  success: boolean;
  croppedImageUrl?: string;
  croppedWidth?: number;
  croppedHeight?: number;
  error?: string;
}

export const cropImage = (
  imageFile: ImageFile,
  cropData: CropData
): Promise<CropImageResult> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve({
            success: false,
            error: 'לא ניתן ליצור קנבס לחיתוך'
          });
          return;
        }

        // Calculate actual crop dimensions based on the display vs natural image size
        const actualCropX = cropData.x * cropData.scaleX;
        const actualCropY = cropData.y * cropData.scaleY;
        const actualCropWidth = cropData.width * cropData.scaleX;
        const actualCropHeight = cropData.height * cropData.scaleY;

        // Set canvas size to cropped dimensions
        canvas.width = actualCropWidth;
        canvas.height = actualCropHeight;

        // Draw the cropped portion of the image
        ctx.drawImage(
          img,
          actualCropX,
          actualCropY,
          actualCropWidth,
          actualCropHeight,
          0,
          0,
          actualCropWidth,
          actualCropHeight
        );

        // Convert canvas to blob and create URL
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedImageUrl = URL.createObjectURL(blob);
            resolve({
              success: true,
              croppedImageUrl,
              croppedWidth: Math.round(actualCropWidth),
              croppedHeight: Math.round(actualCropHeight)
            });
          } else {
            resolve({
              success: false,
              error: 'שגיאה ביצירת התמונה החתוכה'
            });
          }
        }, 'image/jpeg', 0.95);

      } catch (error) {
        resolve({
          success: false,
          error: 'שגיאה בחיתוך התמונה'
        });
      }
    };

    img.onerror = () => {
      resolve({
        success: false,
        error: 'שגיאה בטעינת התמונה לחיתוך'
      });
    };

    img.src = imageFile.preview;
  });
};

export const validateCropArea = (
  cropData: CropData,
  imageWidth: number,
  imageHeight: number
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check if crop area is within image bounds
  if (cropData.x < 0 || cropData.y < 0) {
    errors.push('אזור החיתוך חורג מגבולות התמונה');
  }

  if (cropData.x + cropData.width > imageWidth) {
    errors.push('רוחב החיתוך חורג מגבולות התמונה');
  }

  if (cropData.y + cropData.height > imageHeight) {
    errors.push('גובה החיתוך חורג מגבולות התמונה');
  }

  // Check minimum crop size (at least 50x50 pixels)
  if (cropData.width < 50 || cropData.height < 50) {
    errors.push('אזור החיתוך קטן מדי (מינימום 50×50 פיקסלים)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getPresetAspectRatios = () => [
  { label: 'ריבוע (1:1)', ratio: 1 },
  { label: 'תמונה (4:3)', ratio: 4/3 },
  { label: 'רחב (16:9)', ratio: 16/9 },
  { label: 'פורטרט (3:4)', ratio: 3/4 },
  { label: 'פנורמה (21:9)', ratio: 21/9 },
  { label: 'חופשי', ratio: null }
];

export const calculateCropForAspectRatio = (
  imageWidth: number,
  imageHeight: number,
  targetRatio: number | null
): CropData => {
  if (!targetRatio) {
    // Free form - use entire image
    return {
      x: 0,
      y: 0,
      width: imageWidth,
      height: imageHeight,
      scaleX: 1,
      scaleY: 1
    };
  }

  const imageRatio = imageWidth / imageHeight;
  let cropWidth, cropHeight, cropX, cropY;

  if (imageRatio > targetRatio) {
    // Image is wider than target ratio
    cropHeight = imageHeight;
    cropWidth = cropHeight * targetRatio;
    cropX = (imageWidth - cropWidth) / 2;
    cropY = 0;
  } else {
    // Image is taller than target ratio
    cropWidth = imageWidth;
    cropHeight = cropWidth / targetRatio;
    cropX = 0;
    cropY = (imageHeight - cropHeight) / 2;
  }

  return {
    x: cropX,
    y: cropY,
    width: cropWidth,
    height: cropHeight,
    scaleX: 1,
    scaleY: 1
  };
};
