import { useState, useCallback, useRef, useEffect } from 'react';
import { cropImage, validateCropArea, getPresetAspectRatios, calculateCropForAspectRatio } from '../utils/imageProcessor';
import type { ImageFile, CropData } from '../types/order';
import '../styles/hebrew.css';

interface ImageCropperProps {
  imageFile: ImageFile;
  onCropComplete: (croppedImageFile: ImageFile) => void;
  onSkipCrop: () => void;
}

const ImageCropper = ({ imageFile, onCropComplete, onSkipCrop }: ImageCropperProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cropData, setCropData] = useState<CropData>({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    scaleX: 1,
    scaleY: 1
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDisplaySize, setImageDisplaySize] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<number | null>(null);

  const aspectRatios = getPresetAspectRatios();

  // Initialize crop area when image loads
  useEffect(() => {
    const updateImageSize = () => {
      if (imageRef.current && containerRef.current) {
        const img = imageRef.current;
        const container = containerRef.current;
        
        // Calculate display size
        const containerWidth = container.clientWidth - 40; // Account for padding
        const containerHeight = 400; // Max height
        
        const imageAspectRatio = imageFile.originalWidth / imageFile.originalHeight;
        
        let displayWidth, displayHeight;
        
        if (containerWidth / containerHeight > imageAspectRatio) {
          // Height constrained
          displayHeight = containerHeight;
          displayWidth = displayHeight * imageAspectRatio;
        } else {
          // Width constrained
          displayWidth = containerWidth;
          displayHeight = displayWidth / imageAspectRatio;
        }
        
        setImageDisplaySize({ width: displayWidth, height: displayHeight });
        
        // Calculate scale factors
        const scaleX = imageFile.originalWidth / displayWidth;
        const scaleY = imageFile.originalHeight / displayHeight;
        
        // Initialize crop area to center 80% of image
        const initialCropSize = Math.min(displayWidth, displayHeight) * 0.8;
        setCropData({
          x: (displayWidth - initialCropSize) / 2,
          y: (displayHeight - initialCropSize) / 2,
          width: initialCropSize,
          height: initialCropSize,
          scaleX,
          scaleY
        });
      }
    };

    // Wait for image to load
    if (imageRef.current?.complete) {
      updateImageSize();
    } else if (imageRef.current) {
      imageRef.current.addEventListener('load', updateImageSize);
      return () => {
        imageRef.current?.removeEventListener('load', updateImageSize);
      };
    }

    window.addEventListener('resize', updateImageSize);
    return () => window.removeEventListener('resize', updateImageSize);
  }, [imageFile]);

  const handleMouseDown = useCallback((e: React.MouseEvent, type: 'drag' | 'resize') => {
    e.preventDefault();
    
    if (type === 'drag') {
      setIsDragging(true);
    } else {
      setIsResizing(true);
    }
    
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging && !isResizing) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setCropData(prev => {
      if (isDragging) {
        // Move crop area
        const newX = Math.max(0, Math.min(prev.x + deltaX, imageDisplaySize.width - prev.width));
        const newY = Math.max(0, Math.min(prev.y + deltaY, imageDisplaySize.height - prev.height));
        
        return {
          ...prev,
          x: newX,
          y: newY
        };
      } else if (isResizing) {
        // Resize crop area
        let newWidth = Math.max(50, prev.width + deltaX);
        let newHeight = Math.max(50, prev.height + deltaY);
        
        // Maintain aspect ratio if one is selected
        if (selectedAspectRatio) {
          newHeight = newWidth / selectedAspectRatio;
        }
        
        // Ensure crop area stays within image bounds
        newWidth = Math.min(newWidth, imageDisplaySize.width - prev.x);
        newHeight = Math.min(newHeight, imageDisplaySize.height - prev.y);
        
        return {
          ...prev,
          width: newWidth,
          height: newHeight
        };
      }
      
      return prev;
    });
    
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  }, [isDragging, isResizing, dragStart, imageDisplaySize, selectedAspectRatio]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleAspectRatioChange = useCallback((ratio: number | null) => {
    setSelectedAspectRatio(ratio);
    
    if (ratio !== null) {
      const newCropData = calculateCropForAspectRatio(
        imageDisplaySize.width,
        imageDisplaySize.height,
        ratio
      );
      
      setCropData(prev => ({
        ...newCropData,
        scaleX: prev.scaleX,
        scaleY: prev.scaleY
      }));
    }
  }, [imageDisplaySize]);

  const handleCropImage = useCallback(async () => {
    setIsProcessing(true);
    setError('');
    
    try {
      // Validate crop area
      const validation = validateCropArea(
        cropData,
        imageDisplaySize.width,
        imageDisplaySize.height
      );
      
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        setIsProcessing(false);
        return;
      }
      
      // Perform crop
      const result = await cropImage(imageFile, cropData);
      
      if (result.success && result.croppedImageUrl && result.croppedWidth && result.croppedHeight) {
        const croppedImageFile: ImageFile = {
          ...imageFile,
          cropData,
          croppedPreview: result.croppedImageUrl,
          croppedWidth: result.croppedWidth,
          croppedHeight: result.croppedHeight,
          croppedAspectRatio: result.croppedWidth / result.croppedHeight
        };
        
        onCropComplete(croppedImageFile);
      } else {
        setError(result.error || 'שגיאה בחיתוך התמונה');
      }
    } catch (err) {
      setError('שגיאה בחיתוך התמונה');
    } finally {
      setIsProcessing(false);
    }
  }, [cropData, imageFile, imageDisplaySize, onCropComplete]);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Assistant, sans-serif'
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#1e3a8a',
        textAlign: 'center'
      }}>
        חיתוך התמונה
      </h3>

      {/* Aspect Ratio Presets */}
      <div style={{
        marginBottom: '2rem'
      }}>
        <h4 style={{
          fontSize: '1.1rem',
          fontWeight: '500',
          marginBottom: '1rem',
          color: '#374151'
        }}>
          יחסי גובה-רוחב מוגדרים מראש
        </h4>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          {aspectRatios.map((preset, index) => (
            <button
              key={index}
              onClick={() => handleAspectRatioChange(preset.ratio)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedAspectRatio === preset.ratio ? '#1e3a8a' : '#f3f4f6',
                color: selectedAspectRatio === preset.ratio ? 'white' : '#374151',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (selectedAspectRatio !== preset.ratio) {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedAspectRatio !== preset.ratio) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Area */}
      <div 
        ref={containerRef}
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '2rem',
          cursor: isDragging ? 'grabbing' : 'default'
        }}
      >
        <img
          ref={imageRef}
          src={imageFile.preview}
          alt="תמונה לחיתוך"
          style={{
            width: `${imageDisplaySize.width}px`,
            height: `${imageDisplaySize.height}px`,
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        />
        
        {/* Crop Overlay */}
        {imageDisplaySize.width > 0 && (
          <>
            {/* Dark overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              pointerEvents: 'none'
            }} />
            
            {/* Crop area */}
            <div
              style={{
                position: 'absolute',
                left: `${cropData.x + (containerRef.current?.clientWidth || 0) / 2 - imageDisplaySize.width / 2}px`,
                top: `${cropData.y + (containerRef.current?.clientHeight || 0) / 2 - imageDisplaySize.height / 2}px`,
                width: `${cropData.width}px`,
                height: `${cropData.height}px`,
                border: '2px solid #f59e0b',
                backgroundColor: 'transparent',
                cursor: 'move'
              }}
              onMouseDown={(e) => handleMouseDown(e, 'drag')}
            >
              {/* Corner resize handle */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  right: '-6px',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#f59e0b',
                  cursor: 'se-resize',
                  borderRadius: '2px'
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, 'resize');
                }}
              />
              
              {/* Grid lines */}
              <div style={{
                position: 'absolute',
                top: '33.33%',
                left: 0,
                right: 0,
                height: '1px',
                backgroundColor: 'rgba(245, 158, 11, 0.5)'
              }} />
              <div style={{
                position: 'absolute',
                top: '66.66%',
                left: 0,
                right: 0,
                height: '1px',
                backgroundColor: 'rgba(245, 158, 11, 0.5)'
              }} />
              <div style={{
                position: 'absolute',
                left: '33.33%',
                top: 0,
                bottom: 0,
                width: '1px',
                backgroundColor: 'rgba(245, 158, 11, 0.5)'
              }} />
              <div style={{
                position: 'absolute',
                left: '66.66%',
                top: 0,
                bottom: 0,
                width: '1px',
                backgroundColor: 'rgba(245, 158, 11, 0.5)'
              }} />
            </div>
          </>
        )}
      </div>

      {/* Crop Info */}
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        fontSize: '0.9rem',
        color: '#64748b'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
          <div>
            <strong>גודל חיתוך:</strong> {Math.round(cropData.width * cropData.scaleX)}×{Math.round(cropData.height * cropData.scaleY)} פיקסלים
          </div>
          <div>
            <strong>יחס גובה-רוחב:</strong> {((cropData.width * cropData.scaleX) / (cropData.height * cropData.scaleY)).toFixed(2)}:1
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '1rem',
          color: '#dc2626',
          marginBottom: '2rem'
        }}>
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem'
      }}>
        <button
          onClick={onSkipCrop}
          style={{
            flex: 1,
            padding: '1rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#6b7280';
          }}
        >
          דלג על חיתוך
        </button>
        
        <button
          onClick={handleCropImage}
          disabled={isProcessing}
          style={{
            flex: 1,
            padding: '1rem',
            backgroundColor: isProcessing ? '#9ca3af' : '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '500',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (!isProcessing) {
              e.currentTarget.style.backgroundColor = '#15803d';
            }
          }}
          onMouseLeave={(e) => {
            if (!isProcessing) {
              e.currentTarget.style.backgroundColor = '#16a34a';
            }
          }}
        >
          {isProcessing ? 'מעבד...' : 'חתוך תמונה'}
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
