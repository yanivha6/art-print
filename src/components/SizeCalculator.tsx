import { useState, useEffect, useCallback } from 'react';
import { validateCanvasSize, calculateDefaultSize, calculateDimensionFromOther, constrainSize } from '../utils/sizeValidator';
import { calculatePrice, formatPrice } from '../utils/priceCalculator';
import type { ImageFile, CanvasSize } from '../types/order';
import '../styles/hebrew.css';

interface SizeCalculatorProps {
  imageFile: ImageFile;
  onSizeChange: (size: CanvasSize, price: number) => void;
}

const SizeCalculator = ({ imageFile, onSizeChange }: SizeCalculatorProps) => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Initialize with default size when imageFile changes
  useEffect(() => {
    if (imageFile) {
      // Use cropped dimensions if available, otherwise use original
      const aspectRatio = imageFile.croppedAspectRatio || imageFile.aspectRatio;
      const defaultSize = calculateDefaultSize(aspectRatio);
      setWidth(defaultSize.width);
      setHeight(defaultSize.height);
    }
  }, [imageFile]);

  // Calculate price and validate whenever dimensions change
  useEffect(() => {
    if (width > 0 && height > 0) {
      const validation = validateCanvasSize(width, height);
      setValidationErrors(validation.errors);
      
      if (validation.isValid) {
        const newPrice = calculatePrice(width, height);
        setPrice(newPrice);
        onSizeChange({ width, height }, newPrice);
      } else {
        setPrice(0);
        onSizeChange({ width, height }, 0);
      }
    }
  }, [width, height, onSizeChange]);

  const handleWidthChange = useCallback((newWidth: number) => {
    if (isCalculating) return;
    
    setIsCalculating(true);
    setWidth(newWidth);
    
    if (newWidth > 0 && imageFile) {
      const aspectRatio = imageFile.croppedAspectRatio || imageFile.aspectRatio;
      const newHeight = calculateDimensionFromOther(newWidth, aspectRatio, true);
      setHeight(newHeight);
    }
    
    setIsCalculating(false);
  }, [imageFile, isCalculating]);

  const handleHeightChange = useCallback((newHeight: number) => {
    if (isCalculating) return;
    
    setIsCalculating(true);
    setHeight(newHeight);
    
    if (newHeight > 0 && imageFile) {
      const aspectRatio = imageFile.croppedAspectRatio || imageFile.aspectRatio;
      const newWidth = calculateDimensionFromOther(newHeight, aspectRatio, false);
      setWidth(newWidth);
    }
    
    setIsCalculating(false);
  }, [imageFile, isCalculating]);

  const handleConstrainSize = useCallback(() => {
    const constrained = constrainSize(width, height);
    if (constrained.width !== width || constrained.height !== height) {
      setWidth(constrained.width);
      setHeight(constrained.height);
    }
  }, [width, height]);

  const resetToDefault = useCallback(() => {
    if (imageFile) {
      const defaultSize = calculateDefaultSize(imageFile.aspectRatio);
      setWidth(defaultSize.width);
      setHeight(defaultSize.height);
    }
  }, [imageFile]);

  const isValid = validationErrors.length === 0 && width > 0 && height > 0;

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
        בחירת גודל הדפסה
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Width Input */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '1.1rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: '#374151'
          }}>
            רוחב (ס״מ)
          </label>
          <input
            type="number"
            min="30"
            max="300"
            value={width || ''}
            onChange={(e) => handleWidthChange(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1.1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              textAlign: 'center',
              fontFamily: 'Assistant, sans-serif',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#f59e0b';
              e.target.style.outline = 'none';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
            }}
          />
        </div>

        {/* Height Input */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '1.1rem',
            fontWeight: '500',
            marginBottom: '0.5rem',
            color: '#374151'
          }}>
            גובה (ס״מ)
          </label>
          <input
            type="number"
            min="30"
            max="140"
            value={height || ''}
            onChange={(e) => handleHeightChange(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1.1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              textAlign: 'center',
              fontFamily: 'Assistant, sans-serif',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#f59e0b';
              e.target.style.outline = 'none';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
            }}
          />
        </div>
      </div>

      {/* Size Information */}
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          fontSize: '0.95rem',
          color: '#64748b'
        }}>
          <div>
            <strong>יחס תמונה מקורית:</strong> {imageFile.aspectRatio.toFixed(2)}:1
          </div>
          <div>
            <strong>יחס הדפסה נוכחי:</strong> {width && height ? (width / height).toFixed(2) : '0'}:1
          </div>
          <div>
            <strong>שטח הדפסה:</strong> {width && height ? `${(width * height).toLocaleString('he-IL')} ס״מ²` : '0 ס״מ²'}
          </div>
          <div>
            <strong>גודל סופי:</strong> {width}×{height} ס״מ
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <ul style={{
            margin: 0,
            paddingRight: '1.5rem',
            color: '#dc2626'
          }}>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Size Constraints Info */}
      <div style={{
        backgroundColor: '#eff6ff',
        border: '1px solid #dbeafe',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem',
        fontSize: '0.9rem',
        color: '#1e40af'
      }}>
        <strong>מגבלות גודל:</strong> מינימום 30×30 ס״מ, מקסימום 140×300 ס״מ
        <br />
        <strong>הערה:</strong> השינוי באחד המימדים יתאים אוטומטית את המימד השני כדי לשמור על יחס התמונה המקורית
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <button
          onClick={resetToDefault}
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            fontFamily: 'Assistant, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#6b7280';
          }}
        >
          איפוס לגודל ברירת מחדל
        </button>

        <button
          onClick={handleConstrainSize}
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            fontFamily: 'Assistant, sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#d97706';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f59e0b';
          }}
        >
          התאם לגבולות מותרים
        </button>
      </div>

      {/* Price Display */}
      <div style={{
        backgroundColor: isValid ? '#dcfce7' : '#f3f4f6',
        border: `2px solid ${isValid ? '#16a34a' : '#d1d5db'}`,
        borderRadius: '12px',
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '1.2rem',
          fontWeight: '500',
          marginBottom: '0.5rem',
          color: '#374151'
        }}>
          מחיר משוער
        </div>
        <div style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: isValid ? '#16a34a' : '#6b7280'
        }}>
          {isValid ? formatPrice(price) : 'לא זמין'}
        </div>
        {!isValid && (
          <div style={{
            fontSize: '0.9rem',
            color: '#6b7280',
            marginTop: '0.5rem'
          }}>
            אנא תקנו את השגיאות לצפייה במחיר
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeCalculator;
