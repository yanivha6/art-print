import { useCallback, useState } from 'react';
import { processImageFile, cleanupImagePreview, formatFileSize, getImageDimensionsText } from '../utils/imageProcessor';
import type { ImageFile } from '../types/order';
import '../styles/hebrew.css';

interface ImageUploadProps {
  onImageSelected: (imageFile: ImageFile) => void;
  onImageRemoved?: () => void;
  currentImage?: ImageFile;
}

const ImageUpload = ({ onImageSelected, onImageRemoved, currentImage }: ImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileProcess = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError('');

    try {
      const result = await processImageFile(file);
      if (result.success && result.imageFile) {
        // Clean up previous image preview if exists
        if (currentImage) {
          cleanupImagePreview(currentImage.preview);
        }
        onImageSelected(result.imageFile);
      } else {
        setError(result.error || 'שגיאה לא ידועה');
      }
    } catch (err) {
      setError('שגיאה בעיבוד הקובץ');
    } finally {
      setIsProcessing(false);
    }
  }, [onImageSelected, currentImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileProcess(files[0]);
    }
  }, [handleFileProcess]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  }, [handleFileProcess]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeImage = useCallback(() => {
    if (currentImage) {
      cleanupImagePreview(currentImage.preview);
      setError('');
      // Call the onImageRemoved callback if provided, otherwise fallback to page reload
      if (onImageRemoved) {
        onImageRemoved();
      } else {
        window.location.reload();
      }
    }
  }, [currentImage, onImageRemoved]);

  return (
    <div style={{ width: '100%' }}>
      {!currentImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: `3px dashed ${isDragOver ? '#f59e0b' : '#cbd5e1'}`,
            borderRadius: '12px',
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: isDragOver ? '#fef3c7' : '#f8fafc',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            fontFamily: 'Assistant, sans-serif'
          }}
        >
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            color: '#64748b'
          }}>
            📁
          </div>
          
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#1e3a8a'
          }}>
            העלו את התמונה שלכם
          </h3>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#64748b',
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            גררו ושחררו קובץ תמונה כאן או לחצו לבחירת קובץ
            <br />
            תומך ב-JPEG, PNG, WebP (עד 10MB)
          </p>
          
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="image-upload"
          />
          
          <label
            htmlFor="image-upload"
            style={{
              display: 'inline-block',
              backgroundColor: '#1e3a8a',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '500',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1e40af';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1e3a8a';
            }}
          >
            בחר קובץ
          </label>
          
          {isProcessing && (
            <div style={{
              marginTop: '1rem',
              fontSize: '1rem',
              color: '#f59e0b'
            }}>
              מעבד תמונה...
            </div>
          )}
        </div>
      ) : (
        <div style={{
          border: '2px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '300px',
            overflow: 'hidden'
          }}>
            <img
              src={currentImage.preview}
              alt="תמונה שנבחרה"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#f8fafc'
              }}
            />
            
            <button
              onClick={removeImage}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444';
              }}
            >
              ×
            </button>
          </div>
          
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#f8fafc',
            fontFamily: 'Assistant, sans-serif'
          }}>
            <h4 style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#1e3a8a'
            }}>
              פרטי התמונה
            </h4>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              fontSize: '0.95rem',
              color: '#64748b'
            }}>
              <div>
                <strong>שם הקובץ:</strong> {currentImage.file.name}
              </div>
              <div>
                <strong>גודל קובץ:</strong> {formatFileSize(currentImage.file.size)}
              </div>
              <div>
                <strong>רזולוציה:</strong> {getImageDimensionsText(currentImage.originalWidth, currentImage.originalHeight)}
              </div>
              <div>
                <strong>יחס גובה-רוחב:</strong> {currentImage.aspectRatio.toFixed(2)}:1
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626',
          fontSize: '1rem',
          fontFamily: 'Assistant, sans-serif'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
