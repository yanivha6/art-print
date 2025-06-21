import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import ImageCropper from './ImageCropper';
import SizeCalculator from './SizeCalculator';
import ContactForm from './ContactForm';
import type { ImageFile, CanvasSize, ContactInfo, Order } from '../types/order';
import '../styles/hebrew.css';

const OrderPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 1.5 | 2 | 3>(1);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [canvasSize, setCanvasSize] = useState<CanvasSize | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelected = useCallback((imageFile: ImageFile) => {
    setSelectedImage(imageFile);
    setShowCropper(true);
    setCurrentStep(1.5);
  }, []);

  const handleCropComplete = useCallback((croppedImageFile: ImageFile) => {
    setSelectedImage(croppedImageFile);
    setShowCropper(false);
    setCurrentStep(2);
  }, []);

  const handleSkipCrop = useCallback(() => {
    setShowCropper(false);
    setCurrentStep(2);
  }, []);

  const handleSizeChange = useCallback((size: CanvasSize, newPrice: number) => {
    setCanvasSize(size);
    setPrice(newPrice);
  }, []);

  const handleProceedToContact = useCallback(() => {
    if (selectedImage && canvasSize && price > 0) {
      setCurrentStep(3);
    }
  }, [selectedImage, canvasSize, price]);

  const handleOrderSubmit = useCallback(async (contactInfo: ContactInfo) => {
    if (!selectedImage || !canvasSize) return;

    setIsSubmitting(true);
    
    try {
      // In a real app, this would send the order to a backend
      const order: Order = {
        id: `order-${Date.now()}`,
        orderDetails: {
          image: selectedImage,
          canvasSize,
          price
        },
        contactInfo,
        createdAt: new Date(),
        status: 'pending'
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store order in localStorage for demo
      localStorage.setItem('lastOrder', JSON.stringify(order));
      
      // Navigate to thank you page
      navigate('/thank-you');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('שגיאה בשליחת ההזמנה. אנא נסו שוב.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedImage, canvasSize, price, navigate]);

  const goBackToStep = useCallback((step: 1 | 2) => {
    setCurrentStep(step);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '2rem 1rem',
      fontFamily: 'Assistant, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Page Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1e3a8a',
            marginBottom: '1rem'
          }}>
            הזמנת הדפסה על קנבס
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#64748b'
          }}>
            בואו ניצור יחד את יצירת האמנות הבאה שלכם
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '3rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            {/* Step 1 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: currentStep >= 1 ? '#16a34a' : '#d1d5db',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}>
                1
              </div>
              <span style={{
                fontWeight: '500',
                color: currentStep >= 1 ? '#16a34a' : '#6b7280'
              }}>
                העלאת תמונה
              </span>
            </div>

            {/* Arrow */}
            <div style={{
              color: '#d1d5db',
              fontSize: '1.5rem'
            }}>
              ←
            </div>

            {/* Step 2 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: currentStep >= 2 ? '#16a34a' : '#d1d5db',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}>
                2
              </div>
              <span style={{
                fontWeight: '500',
                color: currentStep >= 2 ? '#16a34a' : '#6b7280'
              }}>
                בחירת גודל
              </span>
            </div>

            {/* Arrow */}
            <div style={{
              color: '#d1d5db',
              fontSize: '1.5rem'
            }}>
              ←
            </div>

            {/* Step 3 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: currentStep >= 3 ? '#16a34a' : '#d1d5db',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}>
                3
              </div>
              <span style={{
                fontWeight: '500',
                color: currentStep >= 3 ? '#16a34a' : '#6b7280'
              }}>
                פרטי הזמנה
              </span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div style={{
          display: 'grid',
          gap: '2rem'
        }}>
          {/* Step 1: Image Upload */}
          {currentStep === 1 && (
            <div>
              <ImageUpload 
                onImageSelected={handleImageSelected}
                currentImage={selectedImage || undefined}
              />
            </div>
          )}

          {/* Step 1.5: Image Cropping */}
          {currentStep === 1.5 && selectedImage && showCropper && (
            <div>
              <ImageCropper
                imageFile={selectedImage}
                onCropComplete={handleCropComplete}
                onSkipCrop={handleSkipCrop}
              />
            </div>
          )}

          {/* Step 2: Size Selection */}
          {currentStep === 2 && selectedImage && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '2rem'
            }}>
              {/* Image Preview */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '1.5rem',
                  color: '#1e3a8a',
                  textAlign: 'center'
                }}>
                  תצוגה מקדימה
                </h3>
                
                <div style={{
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '1rem'
                }}>
                  <img
                    src={selectedImage.croppedPreview || selectedImage.preview}
                    alt="תצוגה מקדימה"
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'contain',
                      backgroundColor: '#f8fafc'
                    }}
                  />
                </div>

                <button
                  onClick={() => goBackToStep(1)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4b5563';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#6b7280';
                  }}
                >
                  שנה תמונה
                </button>
              </div>

              {/* Size Calculator */}
              <div>
                <SizeCalculator 
                  imageFile={selectedImage}
                  onSizeChange={handleSizeChange}
                />
                
                {canvasSize && price > 0 && (
                  <button
                    onClick={handleProceedToContact}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      marginTop: '1rem',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#15803d';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#16a34a';
                    }}
                  >
                    המשך לפרטי הזמנה
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Contact Form */}
          {currentStep === 3 && selectedImage && canvasSize && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '2rem'
            }}>
              {/* Order Summary */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                height: 'fit-content'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '1.5rem',
                  color: '#1e3a8a',
                  textAlign: 'center'
                }}>
                  סיכום הזמנה
                </h3>
                
                <div style={{
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '1.5rem'
                }}>
                  <img
                    src={selectedImage.croppedPreview || selectedImage.preview}
                    alt="תצוגה מקדימה סופית"
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'contain',
                      backgroundColor: '#f8fafc'
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <button
                    onClick={() => goBackToStep(1)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      marginLeft: '0.5rem',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#4b5563';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#6b7280';
                    }}
                  >
                    שנה תמונה
                  </button>
                  
                  <button
                    onClick={() => goBackToStep(2)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      marginRight: '0.5rem',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#d97706';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f59e0b';
                    }}
                  >
                    שנה גודל
                  </button>
                </div>
              </div>

              {/* Contact Form */}
              <ContactForm
                orderDetails={{
                  image: selectedImage,
                  canvasSize,
                  price
                }}
                onSubmit={handleOrderSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
