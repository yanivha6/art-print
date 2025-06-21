import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '../types/order';
import { formatPrice } from '../utils/priceCalculator';
import '../styles/hebrew.css';

const ThankYouPage = () => {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Load order from localStorage (in a real app, this would come from URL params or API)
    const lastOrderStr = localStorage.getItem('lastOrder');
    if (lastOrderStr) {
      try {
        const parsedOrder = JSON.parse(lastOrderStr);
        setOrder(parsedOrder);
      } catch (error) {
        console.error('Error parsing order:', error);
      }
    }
  }, []);

  if (!order) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Assistant, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            color: '#1e3a8a',
            marginBottom: '1rem'
          }}>
            לא נמצאה הזמנה
          </h1>
          <Link
            to="/"
            style={{
              color: '#f59e0b',
              textDecoration: 'none',
              fontSize: '1.1rem'
            }}
          >
            חזרה לעמוד הבית
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '2rem 1rem',
      fontFamily: 'Assistant, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Success Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#16a34a',
            borderRadius: '50%',
            margin: '0 auto 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem'
          }}>
            ✓
          </div>
          
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#16a34a',
            marginBottom: '1rem'
          }}>
            ההזמנה נשלחה בהצלחה!
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            color: '#64748b',
            lineHeight: '1.6'
          }}>
            תודה רבה על הזמנתכם. נחזור אליכם בתוך 24 שעות לאישור ההזמנה ופרטי התשלום.
          </p>
        </div>

        {/* Order Details */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            color: '#1e3a8a',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            פרטי ההזמנה
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {/* Order Info */}
            <div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '1rem'
              }}>
                פרטי ההזמנה
              </h3>
              
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '2px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'grid',
                  gap: '0.75rem',
                  fontSize: '1rem',
                  color: '#374151'
                }}>
                  <div>
                    <strong>מספר הזמנה:</strong> {order.id}
                  </div>
                  <div>
                    <strong>תאריך הזמנה:</strong> {new Date(order.createdAt).toLocaleDateString('he-IL')}
                  </div>
                  <div>
                    <strong>גודל הדפסה:</strong> {order.orderDetails.canvasSize.width}×{order.orderDetails.canvasSize.height} ס״מ
                  </div>
                  <div>
                    <strong>שטח:</strong> {(order.orderDetails.canvasSize.width * order.orderDetails.canvasSize.height).toLocaleString('he-IL')} ס״מ²
                  </div>
                  <div>
                    <strong>קובץ:</strong> {order.orderDetails.image.file.name}
                  </div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: '#16a34a',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid #d1d5db'
                  }}>
                    <strong>מחיר:</strong> {formatPrice(order.orderDetails.price)}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '1rem'
              }}>
                פרטי יצירת קשר
              </h3>
              
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '2px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'grid',
                  gap: '0.75rem',
                  fontSize: '1rem',
                  color: '#374151'
                }}>
                  <div>
                    <strong>שם:</strong> {order.contactInfo.fullName}
                  </div>
                  <div>
                    <strong>טלפון:</strong> {order.contactInfo.phone}
                  </div>
                  <div>
                    <strong>אימייל:</strong> {order.contactInfo.email}
                  </div>
                  <div>
                    <strong>כתובת משלוח:</strong><br />
                    {order.contactInfo.address}
                  </div>
                  {order.contactInfo.notes && (
                    <div>
                      <strong>הערות:</strong><br />
                      {order.contactInfo.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Preview */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1e3a8a',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            התמונה שלכם
          </h3>
          
          <div style={{
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            overflow: 'hidden',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <img
              src={order.orderDetails.image.preview}
              alt="התמונה שהוזמנה"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '300px',
                objectFit: 'contain',
                backgroundColor: '#f8fafc'
              }}
            />
          </div>
        </div>

        {/* Next Steps */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '2px solid #dbeafe',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            השלבים הבאים
          </h3>
          
          <div style={{
            display: 'grid',
            gap: '1rem',
            fontSize: '1.1rem',
            color: '#1e40af'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                borderRadius: '50%', 
                width: '24px', 
                height: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                1
              </span>
              נחזור אליכם בתוך 24 שעות לאישור ההזמנה ופרטי התשלום
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                borderRadius: '50%', 
                width: '24px', 
                height: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                2
              </span>
              לאחר קבלת התשלום נתחיל בתהליך הייצור (3-5 ימי עסקים)
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                borderRadius: '50%', 
                width: '24px', 
                height: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                3
              </span>
              נשלח אליכם את הקנבס עם אריזה מקצועית ובטוחה
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              backgroundColor: '#1e3a8a',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '500',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1e40af';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1e3a8a';
            }}
          >
            חזרה לעמוד הבית
          </Link>
          
          <Link
            to="/order"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              backgroundColor: '#f59e0b',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '500',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d97706';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f59e0b';
            }}
          >
            הזמנה נוספת
          </Link>
        </div>

        {/* Contact Info */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: '600',
            color: '#1e3a8a',
            marginBottom: '1rem'
          }}>
            יש לכם שאלות?
          </h3>
          <p style={{
            fontSize: '1.1rem',
            color: '#64748b',
            marginBottom: '1rem'
          }}>
            אנחנו כאן כדי לעזור! צרו איתנו קשר בכל שאלה או בקשה.
          </p>
          <div style={{
            fontSize: '1rem',
            color: '#374151'
          }}>
            <strong>ארט פרניט</strong> | הדפסה על קנבס באיכות פרימיום
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
