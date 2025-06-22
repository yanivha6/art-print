import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '../contexts/BasketContext';
import ContactForm from './ContactForm';
import BasketSummary from './BasketSummary';
import type { ContactInfo } from '../types/order';
import '../styles/hebrew.css';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { basketItems, basketSummary, clearBasket } = useBasket();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOrderSubmit = async (contactInfo: ContactInfo) => {
    if (basketItems.length === 0) return;

    setIsSubmitting(true);

    try {
      // Create order with multiple basket items
      const order = {
        id: `order-${Date.now()}`,
        basketItems,
        subtotal: basketSummary.subtotal,
        totalPrice: basketSummary.totalPrice,
        contactInfo,
        createdAt: new Date(),
        status: 'pending'
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Store order in localStorage for demo
      localStorage.setItem('lastOrder', JSON.stringify(order));

      // Clear basket after successful order
      clearBasket();

      // Navigate to thank you page
      navigate('/thank-you');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('שגיאה בשליחת ההזמנה. אנא נסו שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if basket is empty
  if (basketItems.length === 0) {
    navigate('/basket');
    return null;
  }

  // Mock order details for ContactForm compatibility
  const mockOrderDetails = {
    image: basketItems[0].image, // Use first item's image as representative
    canvasSize: basketItems[0].canvasSize,
    canvasOptions: basketItems[0].canvasOptions,
    basePrice: basketSummary.subtotal,
    totalPrice: basketSummary.totalPrice
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '2rem 1rem',
      fontFamily: 'Assistant, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1e3a8a',
            marginBottom: '1rem'
          }}>
            השלמת ההזמנה
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#64748b'
          }}>
            שלב אחרון לפני שנתחיל לעבוד על ההדפסות שלכם
          </p>
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem'
        }}>
          {/* Order Summary */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            height: 'fit-content'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              color: '#1e3a8a',
              textAlign: 'center'
            }}>
              סיכום הזמנה
            </h3>

            {/* Items Preview */}
            <div style={{
              marginBottom: '1.5rem'
            }}>
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#374151'
              }}>
                הפריטים שלכם ({basketItems.length} פריטים)
              </h4>
              
              <div style={{
                display: 'grid',
                gap: '0.5rem',
                maxHeight: '200px',
                overflowY: 'auto',
                marginBottom: '1rem'
              }}>
                {basketItems.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.5rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                  >
                    <img
                      src={item.image.croppedPreview || item.image.preview}
                      alt={`פריט ${index + 1}`}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '4px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500' }}>
                        {item.canvasSize.width}×{item.canvasSize.height} ס״מ
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                        כמות: {item.quantity} × ₪{item.totalPrice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <BasketSummary summary={basketSummary} showDetailedBreakdown={true} />

            {/* Back to Basket */}
            <button
              onClick={() => navigate('/basket')}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginTop: '1rem',
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
              חזרה לעגלה
            </button>
          </div>

          {/* Contact Form */}
          <ContactForm
            orderDetails={mockOrderDetails}
            onSubmit={handleOrderSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
