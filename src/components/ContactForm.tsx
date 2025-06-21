import { useState, useCallback } from 'react';
import type { ContactInfo, OrderDetails } from '../types/order';
import { formatPrice } from '../utils/priceCalculator';
import '../styles/hebrew.css';

interface ContactFormProps {
  orderDetails: OrderDetails;
  onSubmit: (contactInfo: ContactInfo) => void;
  isSubmitting?: boolean;
}

const ContactForm = ({ orderDetails, onSubmit, isSubmitting = false }: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactInfo>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<ContactInfo>>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<ContactInfo> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'שם מלא הוא שדה חובה';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'מספר טלפון הוא שדה חובה';
    } else if (!/^[0-9\-\+\s\(\)]{9,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'מספר טלפון לא תקין';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'כתובת אימייל היא שדה חובה';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'כתובת למשלוח היא שדה חובה';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  }, [formData, validateForm, onSubmit]);

  const handleInputChange = useCallback((field: keyof ContactInfo) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors]);

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
        פרטי הזמנה
      </h3>

      {/* Order Summary */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h4 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          marginBottom: '1rem',
          color: '#1e3a8a'
        }}>
          סיכום הזמנה
        </h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          fontSize: '1rem',
          color: '#374151'
        }}>
          <div>
            <strong>גודל הדפסה:</strong> {orderDetails.canvasSize.width}×{orderDetails.canvasSize.height} ס״מ
          </div>
          <div>
            <strong>שטח:</strong> {(orderDetails.canvasSize.width * orderDetails.canvasSize.height).toLocaleString('he-IL')} ס״מ²
          </div>
          <div>
            <strong>קובץ:</strong> {orderDetails.image.file.name}
          </div>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#16a34a'
          }}>
            <strong>מחיר:</strong> {formatPrice(orderDetails.price)}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'grid',
          gap: '1.5rem'
        }}>
          {/* Full Name */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '1.1rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: '#374151'
            }}>
              שם מלא *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={handleInputChange('fullName')}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: `2px solid ${errors.fullName ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontFamily: 'Assistant, sans-serif',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                if (!errors.fullName) {
                  e.target.style.borderColor = '#f59e0b';
                }
                e.target.style.outline = 'none';
              }}
              onBlur={(e) => {
                if (!errors.fullName) {
                  e.target.style.borderColor = '#e5e7eb';
                }
              }}
              placeholder="הזינו את שמכם המלא"
            />
            {errors.fullName && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.9rem',
                marginTop: '0.25rem'
              }}>
                {errors.fullName}
              </div>
            )}
          </div>

          {/* Phone and Email in a row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Phone */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '1.1rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: '#374151'
              }}>
                טלפון *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: `2px solid ${errors.phone ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  fontFamily: 'Assistant, sans-serif',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => {
                  if (!errors.phone) {
                    e.target.style.borderColor = '#f59e0b';
                  }
                  e.target.style.outline = 'none';
                }}
                onBlur={(e) => {
                  if (!errors.phone) {
                    e.target.style.borderColor = '#e5e7eb';
                  }
                }}
                placeholder="050-1234567"
              />
              {errors.phone && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '0.9rem',
                  marginTop: '0.25rem'
                }}>
                  {errors.phone}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '1.1rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: '#374151'
              }}>
                אימייל *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: `2px solid ${errors.email ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  fontFamily: 'Assistant, sans-serif',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => {
                  if (!errors.email) {
                    e.target.style.borderColor = '#f59e0b';
                  }
                  e.target.style.outline = 'none';
                }}
                onBlur={(e) => {
                  if (!errors.email) {
                    e.target.style.borderColor = '#e5e7eb';
                  }
                }}
                placeholder="example@email.com"
              />
              {errors.email && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '0.9rem',
                  marginTop: '0.25rem'
                }}>
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '1.1rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: '#374151'
            }}>
              כתובת למשלוח *
            </label>
            <textarea
              value={formData.address}
              onChange={handleInputChange('address')}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: `2px solid ${errors.address ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontFamily: 'Assistant, sans-serif',
                resize: 'vertical',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                if (!errors.address) {
                  e.currentTarget.style.borderColor = '#f59e0b';
                }
                e.currentTarget.style.outline = 'none';
              }}
              onBlur={(e) => {
                if (!errors.address) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }
              }}
              placeholder="רחוב, מספר בית, עיר, מיקוד"
            />
            {errors.address && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.9rem',
                marginTop: '0.25rem'
              }}>
                {errors.address}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '1.1rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: '#374151'
            }}>
              הערות (אופציונלי)
            </label>
            <textarea
              value={formData.notes}
              onChange={handleInputChange('notes')}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontFamily: 'Assistant, sans-serif',
                resize: 'vertical',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#f59e0b';
                e.currentTarget.style.outline = 'none';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
              placeholder="הערות מיוחדות, בקשות, או הנחיות נוספות"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '1rem',
            marginTop: '2rem',
            backgroundColor: isSubmitting ? '#9ca3af' : '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.2rem',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease',
            fontFamily: 'Assistant, sans-serif'
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = '#15803d';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = '#16a34a';
            }
          }}
        >
          {isSubmitting ? 'שולח הזמנה...' : 'שלח הזמנה'}
        </button>
      </form>

      {/* Info Note */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#eff6ff',
        border: '1px solid #dbeafe',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#1e40af'
      }}>
        <strong>הערה:</strong> לאחר שליחת ההזמנה, נחזור אליכם בתוך 24 שעות לאישור ההזמנה ופרטי התשלום.
        זמן ייצור ומשלוח הוא 3-5 ימי עסקים.
      </div>
    </div>
  );
};

export default ContactForm;
