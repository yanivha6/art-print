import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import OrderPage from './components/OrderPage';
import ThankYouPage from './components/ThankYouPage';
import './styles/hebrew.css';
import './App.css';

function App() {
  return (
    <div dir="rtl" className="hebrew-text">
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
