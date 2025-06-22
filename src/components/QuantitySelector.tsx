import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  disabled = false
}) => {
  const handleDecrease = () => {
    if (quantity > min && !disabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max && !disabled) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleDirectInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= max && !disabled) {
      onQuantityChange(value);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      border: '2px solid #e5e7eb',
      borderRadius: '6px',
      overflow: 'hidden',
      backgroundColor: disabled ? '#f3f4f6' : 'white'
    }}>
      {/* Decrease Button */}
      <button
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        style={{
          padding: '0.5rem',
          backgroundColor: disabled || quantity <= min ? '#f3f4f6' : '#f8fafc',
          border: 'none',
          borderLeft: '1px solid #e5e7eb',
          cursor: disabled || quantity <= min ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          fontSize: '1.2rem',
          fontWeight: '600',
          color: disabled || quantity <= min ? '#9ca3af' : '#374151'
        }}
        onMouseEnter={(e) => {
          if (!disabled && quantity > min) {
            e.currentTarget.style.backgroundColor = '#e5e7eb';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && quantity > min) {
            e.currentTarget.style.backgroundColor = '#f8fafc';
          }
        }}
      >
        −
      </button>

      {/* Quantity Input */}
      <input
        type="number"
        value={quantity}
        onChange={handleDirectInput}
        disabled={disabled}
        min={min}
        max={max}
        style={{
          width: '60px',
          height: '40px',
          border: 'none',
          textAlign: 'center',
          fontSize: '1rem',
          fontWeight: '500',
          backgroundColor: disabled ? '#f3f4f6' : 'white',
          color: disabled ? '#9ca3af' : '#374151',
          fontFamily: 'Assistant, sans-serif',
          outline: 'none'
        }}
      />

      {/* Increase Button */}
      <button
        onClick={handleIncrease}
        disabled={disabled || quantity >= max}
        style={{
          padding: '0.5rem',
          backgroundColor: disabled || quantity >= max ? '#f3f4f6' : '#f8fafc',
          border: 'none',
          borderRight: '1px solid #e5e7eb',
          cursor: disabled || quantity >= max ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          fontSize: '1.2rem',
          fontWeight: '600',
          color: disabled || quantity >= max ? '#9ca3af' : '#374151'
        }}
        onMouseEnter={(e) => {
          if (!disabled && quantity < max) {
            e.currentTarget.style.backgroundColor = '#e5e7eb';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && quantity < max) {
            e.currentTarget.style.backgroundColor = '#f8fafc';
          }
        }}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
