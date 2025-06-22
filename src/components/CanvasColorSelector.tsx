import { useState } from 'react';
import { PREDEFINED_COLORS, CANVAS_COLOR_CONFIG } from '../types/order';
import { formatPrice } from '../utils/priceCalculator';
import '../styles/hebrew.css';

interface CanvasColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  basePrice: number;
  colorUpcharge: number;
}

const CanvasColorSelector = ({ selectedColor, onColorChange, basePrice, colorUpcharge }: CanvasColorSelectorProps) => {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customColor, setCustomColor] = useState(selectedColor);

  const isDefaultColor = selectedColor === CANVAS_COLOR_CONFIG.DEFAULT_COLOR;

  const handlePresetColorClick = (color: string) => {
    onColorChange(color);
    setShowCustomPicker(false);
  };

  const handleCustomColorApply = () => {
    onColorChange(customColor);
    setShowCustomPicker(false);
  };

  const handleCustomColorCancel = () => {
    setCustomColor(selectedColor);
    setShowCustomPicker(false);
  };

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      padding: '1.5rem',
      fontFamily: 'Assistant, sans-serif'
    }}>
      <h4 style={{
        fontSize: '1.2rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: '#1e3a8a',
        textAlign: 'center'
      }}>
        בחירת צבע הצדדים
      </h4>

      {/* Color Preview and Price */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '2px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: selectedColor,
            border: '2px solid #d1d5db',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }} />
          <div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              צבע נבחר
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontFamily: 'monospace' }}>
              {selectedColor.toUpperCase()}
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'left' }}>
          {isDefaultColor ? (
            <div style={{ color: '#16a34a', fontWeight: '500' }}>
              ללא תוספת
            </div>
          ) : (
            <div style={{ color: '#f59e0b', fontWeight: '500' }}>
              +{formatPrice(colorUpcharge)}
            </div>
          )}
        </div>
      </div>

      {/* Predefined Colors Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        {PREDEFINED_COLORS.map((colorOption) => (
          <button
            key={colorOption.hex}
            onClick={() => handlePresetColorClick(colorOption.hex)}
            style={{
              padding: '0.75rem',
              border: selectedColor === colorOption.hex ? '3px solid #f59e0b' : '2px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (selectedColor !== colorOption.hex) {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedColor !== colorOption.hex) {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: colorOption.hex,
              border: '1px solid #d1d5db',
              borderRadius: '6px'
            }} />
            <span style={{
              fontSize: '0.75rem',
              color: '#374151',
              textAlign: 'center'
            }}>
              {colorOption.name}
            </span>
          </button>
        ))}
      </div>

      {/* Custom Color Button */}
      <button
        onClick={() => setShowCustomPicker(true)}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: showCustomPicker ? '#f59e0b' : 'white',
          color: showCustomPicker ? 'white' : '#374151',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontFamily: 'Assistant, sans-serif'
        }}
        onMouseEnter={(e) => {
          if (!showCustomPicker) {
            e.currentTarget.style.backgroundColor = '#f9fafb';
            e.currentTarget.style.borderColor = '#d1d5db';
          }
        }}
        onMouseLeave={(e) => {
          if (!showCustomPicker) {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }
        }}
      >
        בחר צבע מותאם אישית
      </button>

      {/* Custom Color Picker */}
      {showCustomPicker && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '2px solid #f59e0b'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: '#374151'
            }}>
              בחר צבע (לחץ על הריבוע הצבעוני):
            </label>
            <div style={{
              position: 'relative',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'border-color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#f59e0b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
            >
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                style={{
                  width: '100%',
                  height: '60px',
                  border: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '0.85rem',
                color: customColor === '#FFFFFF' ? '#374151' : '#FFFFFF',
                fontWeight: '500',
                pointerEvents: 'none',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                backgroundColor: 'rgba(0,0,0,0.2)',
                padding: '4px 8px',
                borderRadius: '4px'
              }}>
                לחץ לבחירת צבע
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '0.5rem'
          }}>
            <button
              onClick={handleCustomColorApply}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                fontFamily: 'Assistant, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#15803d';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#16a34a';
              }}
            >
              אישור
            </button>
            
            <button
              onClick={handleCustomColorCancel}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
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
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* Info Text */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: '#eff6ff',
        border: '1px solid #dbeafe',
        borderRadius: '6px',
        fontSize: '0.85rem',
        color: '#1e40af',
        textAlign: 'center'
      }}>
        <strong>הערה:</strong> תוספת צבע הינה 10% ממחיר הבסיס, עד לתקרה של ₪50
      </div>
    </div>
  );
};

export default CanvasColorSelector;
