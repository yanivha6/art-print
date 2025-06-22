import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BasketItem as BasketItemType } from '../types/order';
import { formatPrice } from '../utils/priceCalculator';
import { CANVAS_COLOR_CONFIG, PREDEFINED_COLORS } from '../types/order';
import QuantitySelector from './QuantitySelector';

interface BasketItemProps {
  item: BasketItemType;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onEditItem?: (itemId: string) => void;
}

const BasketItem: React.FC<BasketItemProps> = ({
  item,
  onQuantityChange,
  onRemoveItem,
  onEditItem
}) => {
  const navigate = useNavigate();
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    onQuantityChange(item.id, newQuantity);
  };

  const handleRemoveClick = () => {
    setShowRemoveConfirm(true);
  };

  const handleConfirmRemove = () => {
    onRemoveItem(item.id);
    setShowRemoveConfirm(false);
  };

  const handleCancelRemove = () => {
    setShowRemoveConfirm(false);
  };

  const handleEditClick = () => {
    if (onEditItem) {
      onEditItem(item.id);
    }
  };

  // Get color name for display
  const getColorName = (hex: string): string => {
    if (hex === CANVAS_COLOR_CONFIG.DEFAULT_COLOR) return 'לבן (ברירת מחדל)';
    const predefinedColor = PREDEFINED_COLORS.find(color => color.hex === hex);
    return predefinedColor ? predefinedColor.name : 'צבע מותאם אישית';
  };

  const itemTotal = item.totalPrice * item.quantity;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      fontFamily: 'Assistant, sans-serif'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Image Thumbnail */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '2px solid #e5e7eb',
          backgroundColor: '#f8fafc',
          flexShrink: 0
        }}>
          <img
            src={item.image.croppedPreview || item.image.preview}
            alt="תצוגה מקדימה"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          {/* Size overlay */}
          <div style={{
            position: 'relative',
            top: '-25px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            fontSize: '0.7rem',
            padding: '2px 6px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {item.canvasSize.width}×{item.canvasSize.height} ס״מ
          </div>
        </div>

        {/* Item Details */}
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'grid',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            {/* File Name */}
            <div style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1e3a8a'
            }}>
              {item.image.file.name}
            </div>

            {/* Size and Details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '0.5rem',
              fontSize: '0.9rem',
              color: '#6b7280'
            }}>
              <div><strong>גודל:</strong> {item.canvasSize.width}×{item.canvasSize.height} ס״מ</div>
              <div><strong>שטח:</strong> {(item.canvasSize.width * item.canvasSize.height).toLocaleString('he-IL')} ס״מ²</div>
              <div><strong>צבע צדדים:</strong> {getColorName(item.canvasOptions.sideColor)}</div>
              <div><strong>נוסף בתאריך:</strong> {item.addedAt.toLocaleDateString('he-IL')}</div>
            </div>

            {/* Color Preview */}
            {item.canvasOptions.sideColor !== CANVAS_COLOR_CONFIG.DEFAULT_COLOR && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: item.canvasOptions.sideColor,
                    border: '1px solid #d1d5db'
                  }}
                />
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                  {item.canvasOptions.sideColor.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.9rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.25rem'
            }}>
              <span>מחיר יחידה:</span>
              <span>{formatPrice(item.totalPrice)}</span>
            </div>
            {item.canvasOptions.colorUpcharge > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                color: '#f59e0b',
                marginBottom: '0.25rem'
              }}>
                <span>כולל תוספת צבע:</span>
                <span>+{formatPrice(item.canvasOptions.colorUpcharge)}</span>
              </div>
            )}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: '600',
              paddingTop: '0.25rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <span>סה״כ לפריט:</span>
              <span style={{ color: '#16a34a' }}>{formatPrice(itemTotal)}</span>
            </div>
          </div>
        </div>

        {/* Actions Column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          minWidth: '120px'
        }}>
          {/* Quantity Selector */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '0.9rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: '#374151'
            }}>
              כמות
            </div>
            <QuantitySelector
              quantity={item.quantity}
              onQuantityChange={handleQuantityChange}
              min={1}
              max={99}
            />
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            width: '100%'
          }}>
            {/* Edit Button */}
            {onEditItem && (
              <button
                onClick={handleEditClick}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
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
                עריכה
              </button>
            )}

            {/* Remove Button */}
            {!showRemoveConfirm ? (
              <button
                onClick={handleRemoveClick}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  fontFamily: 'Assistant, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#b91c1c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                }}
              >
                הסרה
              </button>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  textAlign: 'center',
                  color: '#dc2626',
                  fontWeight: '500'
                }}>
                  בטוח?
                </div>
                <div style={{
                  display: 'flex',
                  gap: '0.25rem'
                }}>
                  <button
                    onClick={handleConfirmRemove}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      fontFamily: 'Assistant, sans-serif'
                    }}
                  >
                    כן
                  </button>
                  <button
                    onClick={handleCancelRemove}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      fontFamily: 'Assistant, sans-serif'
                    }}
                  >
                    לא
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasketItem;
