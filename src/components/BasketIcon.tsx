import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '../contexts/BasketContext';
import { formatPrice } from '../utils/priceCalculator';

const BasketIcon: React.FC = () => {
  const navigate = useNavigate();
  const { basketSummary, totalItems } = useBasket();

  const handleBasketClick = () => {
    navigate('/basket');
  };

  return (
    <div
      onClick={handleBasketClick}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: totalItems > 0 ? '#f59e0b' : '#6b7280',
        color: 'white',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontFamily: 'Assistant, sans-serif',
        fontSize: '0.9rem',
        fontWeight: '500',
        userSelect: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.backgroundColor = totalItems > 0 ? '#d97706' : '#4b5563';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.backgroundColor = totalItems > 0 ? '#f59e0b' : '#6b7280';
      }}
    >
      {/* Basket Icon SVG */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>

      {/* Basket Text and Count */}
      <span>
        עגלת קניות
        {totalItems > 0 && ` (${totalItems})`}
      </span>

      {/* Count Badge */}
      {totalItems > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#dc2626',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: '600',
            border: '2px solid white',
            animation: totalItems > 0 ? 'basketPulse 0.3s ease-out' : 'none'
          }}
        >
          {totalItems > 99 ? '99+' : totalItems}
        </div>
      )}

      {/* Hover Tooltip */}
      {totalItems > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '-45px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#1f2937',
            color: 'white',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            whiteSpace: 'nowrap',
            opacity: 0,
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease',
            zIndex: 1000
          }}
          className="basket-tooltip"
        >
          {basketSummary.itemCount} פריטים • {formatPrice(basketSummary.totalPrice)}
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderBottom: '4px solid #1f2937'
            }}
          />
        </div>
      )}

      <style>
        {`
          @keyframes basketPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          
          div:hover .basket-tooltip {
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
};

export default BasketIcon;
