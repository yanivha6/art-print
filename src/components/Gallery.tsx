import '../styles/hebrew.css';

const Gallery = () => {
  // Mock gallery images - in a real app, these would come from a backend
  const galleryImages = [
    {
      id: 1,
      title: 'נוף טבע מרהיב',
      size: '100×70 ס"מ',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 2,
      title: 'פורטרט משפחתי',
      size: '80×60 ס"מ',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 3,
      title: 'אמנות מופשטת',
      size: '120×80 ס"מ',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 4,
      title: 'צילום רחוב',
      size: '90×60 ס"מ',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 5,
      title: 'פורטרט אישי',
      size: '60×80 ס"מ',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 6,
      title: 'נוף עירוני',
      size: '140×100 ס"מ',
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop&crop=center'
    }
  ];

  return (
    <section style={{
      padding: '4rem 2rem',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '1rem',
          color: '#1e3a8a',
          fontFamily: 'Assistant, sans-serif'
        }}>
          גלריית עבודות
        </h2>
        
        <p style={{
          fontSize: '1.2rem',
          textAlign: 'center',
          color: '#64748b',
          marginBottom: '3rem',
          fontFamily: 'Assistant, sans-serif'
        }}>
          דוגמאות לעבודות קנבס באיכות פרימיום שיצרנו עבור לקוחותינו
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {galleryImages.map((item) => (
            <div 
              key={item.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{
                width: '100%',
                height: '250px',
                overflow: 'hidden'
              }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#1e3a8a',
                  fontFamily: 'Assistant, sans-serif'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: '#f59e0b',
                  fontWeight: '500',
                  fontSize: '1rem',
                  fontFamily: 'Assistant, sans-serif'
                }}>
                  גודל: {item.size}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
