import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BasketProvider } from './contexts/BasketContext';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import OrderPage from './components/OrderPage';
import BasketPage from './components/BasketPage';
import CheckoutPage from './components/CheckoutPage';
import ThankYouPage from './components/ThankYouPage';
import './styles/hebrew.css';
import './App.css';

function App() {
  return (
    <BasketProvider>
      <div dir="rtl" className="hebrew-text">
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/basket" element={<BasketPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
          </Routes>
        </Router>
      </div>
    </BasketProvider>
  );
}

export default App;
