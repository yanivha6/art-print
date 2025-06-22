import React from 'react';
import type { BasketSummary as BasketSummaryType } from '../types/order';
import { formatPrice } from '../utils/priceCalculator';

interface BasketSummaryProps {
  summary: BasketSummaryType;
  showDetailedBreakdown?: boolean;
}

const BasketSummary: React.FC<BasketSummaryProps> = ({
  summary,
  showDetailedBreakdown = true
}) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      fontFamily: 'Assistant, sans-serif'
    }}>
      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: '#1e3a8a',
        textAlign: 'center'
      }}>
        סיכום הזמנה
      </h3>

      {showDetailedBreakdown && (
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'grid',
            gap: '0.5rem',
            fontSize: '0.95rem',
            color: '#6b7280'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>מספר פריטים שונים:</span>
              <span style={{ fontWeight: '500' }}>{summary.itemCount}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>סה״כ יחידות:</span>
              <span style={{ fontWeight: '500' }}>{summary.totalItems}</span>
            </div>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div style={{
        display: 'grid',
        gap: '0.75rem',
        fontSize: '1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#374151'
        }}>
          <span>סכום ביניים:</span>
          <span style={{ fontWeight: '500' }}>{formatPrice(summary.subtotal)}</span>
        </div>

        {/* Future: Add shipping, taxes, discounts here */}
        
        <div style={{
          borderTop: '2px solid #e5e7eb',
          paddingTop: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#1e3a8a'
          }}>
            סה״כ לתשלום:
          </span>
          <span style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            color: '#16a34a'
          }}>
            {formatPrice(summary.totalPrice)}
          </span>
        </div>
      </div>

      {/* Additional Info */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: '#eff6ff',
        border: '1px solid #dbeafe',
        borderRadius: '6px',
        fontSize: '0.85rem',
        color: '#1e40af'
      }}>
        <div style={{ marginBottom: '0.25rem' }}>
          <strong>הערות חשובות:</strong>
        </div>
        <ul style={{ margin: 0, paddingRight: '1rem' }}>
          <li>המחירים כוללים מע״מ</li>
          <li>זמן ייצור: 3-5 ימי עסקים</li>
          <li>משלוח חינם לכל הארץ</li>
        </ul>
      </div>
    </div>
  );
};

export default BasketSummary;
