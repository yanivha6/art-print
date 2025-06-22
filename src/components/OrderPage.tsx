import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBasket } from '../contexts/BasketContext';
import ImageUpload from './ImageUpload';
import ImageCropper from './ImageCropper';
import SizeCalculator from './SizeCalculator';
import ContactForm from './ContactForm';
import type { ImageFile, CanvasSize, CanvasOptions, ContactInfo, Order } from '../types/order';
import '../styles/hebrew.css';

const OrderPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getItem, updateItem, addItem, isBasketFull } = useBasket();
  
  const [currentStep, setCurrentStep] = useState<1 | 1.5 | 2 | 3>(1);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [canvasSize, setCanvasSize] = useState<CanvasSize | null>(null);
  const [canvasOptions, setCanvasOptions] = useState<CanvasOptions | null>(null);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Handle URL parameters for different modes
  useEffect(() => {
    const editItemId = searchParams.get('edit');
    
    if (editItemId) {
      // Edit mode - load existing basket item
      const basketItem = getItem(editItemId);
      if (basketItem) {
        setEditingItemId(editItemId);
        setIsEditMode(true);
        setSelectedImage(basketItem.image);
        setCanvasSize(basketItem.canvasSize);
        setCanvasOptions(basketItem.canvasOptions);
        setBasePrice(basketItem.basePrice);
        setTotalPrice(basketItem.totalPrice);
        setCurrentStep(2); // Go directly to size selection
      } else {
        // Item not found, redirect to basket
        navigate('/basket');
      }
    }
  }, [searchParams, getItem, navigate]);

  const handleImageSelected = useCallback((imageFile: ImageFile) => {
    setSelectedImage(imageFile);
    setShowCropper(true);
    setCurrentStep(1.5);
  }, []);

  const handleImageRemoved = useCallback(() => {
    setSelectedImage(null);
    setCanvasSize(null);
    setCanvasOptions(null);
    setBasePrice(0);
    setTotalPrice(0);
    setCurrentStep(1);
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

  const handleSizeChange = useCallback((size: CanvasSize, options: CanvasOptions, basePriceValue: number, totalPriceValue: number) => {
    setCanvasSize(size);
    setCanvasOptions(options);
    setBasePrice(basePriceValue);
    setTotalPrice(totalPriceValue);
  }, []);

  const handleAddToBasket = useCallback(() => {
    if (!selectedImage || !canvasSize || !canvasOptions) return;

    const basketItem = {
      image: selectedImage,
      canvasSize,
      canvasOptions,
      basePrice,
      totalPrice
    };

    const success = addItem(basketItem);
    if (success) {
      // Automatically navigate to basket
      navigate('/basket');
    } else {
      alert('לא ניתן להוסיף פריט לעגלה. ייתכן שהעגלה מלאה.');
    }
  }, [selectedImage, canvasSize, canvasOptions, basePrice, totalPrice, addItem, navigate]);

  const handleProceedToContact = useCallback(() => {
    if (selectedImage && canvasSize && totalPrice > 0) {
      setCurrentStep(3);
    }
  }, [selectedImage, canvasSize, totalPrice]);

  const handleOrderSubmit = useCallback(async (contactInfo: ContactInfo) => {
    if (!selectedImage || !canvasSize || !canvasOptions) return;

    setIsSubmitting(true);
    
    try {
      // For edit mode, update the basket item
      if (isEditMode && editingItemId) {
        updateItem(editingItemId, {
          canvasSize,
          canvasOptions,
          basePrice,
          totalPrice
        });
        
        // Navigate back to basket after successful edit
        navigate('/basket');
        return;
      }

      // For single-item order (legacy mode), create a mock basket item
      const basketItem = {
        id: `temp-${Date.now()}`,
        image: selectedImage,
        canvasSize,
        canvasOptions,
        basePrice,
        totalPrice,
        quantity: 1,
        addedAt: new Date()
      };

      const order: Order = {
        id: `order-${Date.now()}`,
        basketItems: [basketItem],
        subtotal: totalPrice,
        totalPrice,
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
  }, [selectedImage, canvasSize, canvasOptions, basePrice, totalPrice, navigate, isEditMode, editingItemId, updateItem]);

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
            {isEditMode ? 'עריכת פריט בעגלה' : 'הזמנת הדפסה על קנבס'}
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#64748b'
          }}>
            {isEditMode 
              ? 'ערכו את התצורה של הפריט שלכם'
              : 'בואו ניצור יחד את יצירת האמנות הבאה שלכם'
            }
          </p>
          
          {isEditMode && (
            <button
              onClick={() => navigate('/basket')}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
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
              חזרה לעגלה
            </button>
          )}
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
                onImageRemoved={handleImageRemoved}
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
                  initialSize={isEditMode ? canvasSize || undefined : undefined}
                  initialOptions={isEditMode ? canvasOptions || undefined : undefined}
                />
                
                {canvasSize && totalPrice > 0 && (
                  isEditMode ? (
                    <button
                      onClick={() => {
                        if (editingItemId && canvasSize && canvasOptions) {
                          updateItem(editingItemId, {
                            image: selectedImage, // Update image if changed
                            canvasSize,
                            canvasOptions,
                            basePrice,
                            totalPrice
                          });
                          navigate('/basket');
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        marginTop: '1rem',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1.2rem',
                        fontWeight: '600',
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
                      עדכן פריט
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToBasket}
                      disabled={isBasketFull}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        marginTop: '1rem',
                        backgroundColor: isBasketFull ? '#9ca3af' : '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        cursor: isBasketFull ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isBasketFull) {
                          e.currentTarget.style.backgroundColor = '#15803d';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isBasketFull) {
                          e.currentTarget.style.backgroundColor = '#16a34a';
                        }
                      }}
                    >
                      {isBasketFull ? 'העגלה מלאה' : 'הוסף לעגלה'}
                    </button>
                  )
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
                  canvasOptions: canvasOptions!,
                  basePrice,
                  totalPrice
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
