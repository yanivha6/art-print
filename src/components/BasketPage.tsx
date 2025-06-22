import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '../contexts/BasketContext';
import BasketItem from './BasketItem';
import BasketSummary from './BasketSummary';
import '../styles/hebrew.css';

const BasketPage: React.FC = () => {
  const navigate = useNavigate();
  const { basketItems, basketSummary, updateQuantity, removeItem, clearBasket } = useBasket();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleQuantityChange = (itemId: string, quantity: number) => {
    updateQuantity(itemId, quantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const handleEditItem = (itemId: string) => {
    // Store the item ID for editing and navigate to order page
    sessionStorage.setItem('editingItemId', itemId);
    navigate('/order?edit=' + itemId);
  };

  const handleContinueShopping = () => {
    navigate('/order');
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const handleClearBasket = () => {
    setShowClearConfirm(true);
  };

  const handleConfirmClear = () => {
    clearBasket();
    setShowClearConfirm(false);
  };

  const handleCancelClear = () => {
    setShowClearConfirm(false);
  };

  // Empty basket state
  if (basketItems.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '2rem 1rem',
        fontFamily: 'Assistant, sans-serif'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          {/* Empty State */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '3rem 2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Empty Basket Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 2rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: '#9ca3af'
            }}>
              🛒
            </div>

            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1e3a8a',
              marginBottom: '1rem'
            }}>
              העגלה שלכם ריקה
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              נראה שעדיין לא הוספתם פריטים לעגלה.
              <br />
              בואו נתחיל ליצור את ההדפסה המושלמת שלכם!
            </p>

            <button
              onClick={handleContinueShopping}
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
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
              התחילו להזמין
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Basket with items
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '2rem 1rem',
      fontFamily: 'Assistant, sans-serif'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1e3a8a',
            marginBottom: '0.5rem'
          }}>
            עגלת הקניות שלכם
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#64748b'
          }}>
            {basketSummary.itemCount} פריטים שונים • {basketSummary.totalItems} יחידות בסך הכל
          </p>
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Items List */}
          <div style={{
            display: 'grid',
            gap: '1rem'
          }}>
            {/* Clear Basket Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#374151',
                margin: 0
              }}>
                הפריטים שלכם
              </h2>

              {!showClearConfirm ? (
                <button
                  onClick={handleClearBasket}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc2626',
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
                    e.currentTarget.style.backgroundColor = '#b91c1c';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }}
                >
                  רוקן עגלה
                </button>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{
                    fontSize: '0.9rem',
                    color: '#dc2626',
                    fontWeight: '500'
                  }}>
                    בטוח לרוקן את כל העגלה?
                  </span>
                  <button
                    onClick={handleConfirmClear}
                    style={{
                      padding: '0.4rem 0.8rem',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontFamily: 'Assistant, sans-serif'
                    }}
                  >
                    כן, רוקן
                  </button>
                  <button
                    onClick={handleCancelClear}
                    style={{
                      padding: '0.4rem 0.8rem',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontFamily: 'Assistant, sans-serif'
                    }}
                  >
                    ביטול
                  </button>
                </div>
              )}
            </div>

            {/* Basket Items */}
            {basketItems.map((item) => (
              <BasketItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
                onEditItem={handleEditItem}
              />
            ))}
          </div>

          {/* Sidebar */}
          <div style={{
            position: 'sticky',
            top: '2rem'
          }}>
            {/* Basket Summary */}
            <BasketSummary summary={basketSummary} />

            {/* Action Buttons */}
            <div style={{
              marginTop: '1.5rem',
              display: 'grid',
              gap: '1rem'
            }}>
              {/* Proceed to Checkout */}
              <button
                onClick={handleProceedToCheckout}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
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
                המשך לתשלום
              </button>

              {/* Continue Shopping */}
              <button
                onClick={handleContinueShopping}
                style={{
                  width: '100%',
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
                הוסף תמונה
              </button>
            </div>

            {/* Security Info */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#dcfce7',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#15803d'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🔒</span>
                <strong>קנייה מאובטחת</strong>
              </div>
              <div>
                העגלה שלכם נשמרת בצורה מאובטחת ותישמר גם לאחר סגירת הדפדפן.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasketPage;
