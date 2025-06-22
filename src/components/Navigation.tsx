import { Link, useLocation } from 'react-router-dom';
import BasketIcon from './BasketIcon';
import '../styles/hebrew.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav style={{
      backgroundColor: '#1e3a8a',
      padding: '1rem 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem'
      }}>
        {/* Logo */}
        <Link 
          to="/" 
          style={{
            color: '#f59e0b',
            fontSize: '1.75rem',
            fontWeight: '700',
            textDecoration: 'none',
            fontFamily: 'Assistant, sans-serif'
          }}
        >
          ארט פרניט
        </Link>

        {/* Navigation Links and Basket */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link
            to="/"
            style={{
              color: location.pathname === '/' ? '#f59e0b' : '#ffffff',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: '500',
              fontFamily: 'Assistant, sans-serif',
              transition: 'color 0.3s ease'
            }}
          >
            עמוד הבית
          </Link>
          <Link
            to="/order"
            style={{
              color: location.pathname === '/order' ? '#f59e0b' : '#ffffff',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: '500',
              fontFamily: 'Assistant, sans-serif',
              transition: 'color 0.3s ease'
            }}
          >
            הזמנה
          </Link>
          <BasketIcon />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
