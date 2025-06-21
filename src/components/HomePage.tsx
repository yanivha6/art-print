import { Link } from 'react-router-dom';
import Gallery from './Gallery';
import '../styles/hebrew.css';

const HomePage = () => {
  return (
    <div style={{ fontFamily: 'Assistant, sans-serif' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        padding: '6rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            ארט פרניט
          </h1>
          
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '400',
            marginBottom: '2rem',
            color: '#f1f5f9'
          }}>
            הדפסה על קנבס באיכות פרימיום
          </h2>
          
          <p style={{
            fontSize: '1.3rem',
            lineHeight: '1.8',
            marginBottom: '3rem',
            color: '#e2e8f0'
          }}>
            הפכו את התמונות שלכם ליצירות אמנות מרהיבות עם הדפסה על קנבס באיכות מקצועית.
            <br />
            בחרו את הגודל המושלם והתאימו אותו לחלל שלכם
          </p>
          
          <Link
            to="/order"
            style={{
              display: 'inline-block',
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '1rem 2.5rem',
              fontSize: '1.25rem',
              fontWeight: '600',
              textDecoration: 'none',
              borderRadius: '50px',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d97706';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f59e0b';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.4)';
            }}
          >
            התחל הזמנה עכשיו
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#1e3a8a'
          }}>
            למה לבחור בארט פרניט?
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#1e3a8a',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                🎨
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#1e3a8a'
              }}>
                איכות פרימיום
              </h3>
              <p style={{
                color: '#64748b',
                lineHeight: '1.6',
                fontSize: '1.1rem'
              }}>
                הדפסה על קנבס באיכות מקצועית עם צבעים עמידים ועשירים שישמרו על איכותם לשנים
              </p>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '2rem',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#f59e0b',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                📏
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#1e3a8a'
              }}>
                גדלים מותאמים אישית
              </h3>
              <p style={{
                color: '#64748b',
                lineHeight: '1.6',
                fontSize: '1.1rem'
              }}>
                בחרו את הגודל המושלם עבור התמונה שלכם - מ-30×30 ס"מ ועד 140×300 ס"מ
              </p>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '2rem',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                🚚
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#1e3a8a'
              }}>
                משלוח מהיר
              </h3>
              <p style={{
                color: '#64748b',
                lineHeight: '1.6',
                fontSize: '1.1rem'
              }}>
                משלוח מהיר ובטוח עד הבית, עם אריזה מקצועית להגנה מושלמת על העבודה
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <Gallery />

      {/* Call to Action Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem'
          }}>
            מוכנים להתחיל?
          </h2>
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '2rem',
            color: '#fef3c7'
          }}>
            העלו את התמונה שלכם, בחרו את הגודל והתחילו ליצור את יצירת האמנות החדשה שלכם
          </p>
          <Link
            to="/order"
            style={{
              display: 'inline-block',
              backgroundColor: 'white',
              color: '#d97706',
              padding: '1rem 2.5rem',
              fontSize: '1.25rem',
              fontWeight: '600',
              textDecoration: 'none',
              borderRadius: '50px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            }}
          >
            בואו נתחיל!
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
