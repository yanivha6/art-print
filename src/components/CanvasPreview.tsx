import type { CanvasSize } from '../types/order';

interface CanvasPreviewProps {
  canvasSize: CanvasSize;
  sideColor: string;
}

const CanvasPreview = ({ canvasSize, sideColor }: CanvasPreviewProps) => {
  const { width, height } = canvasSize;
  
  // Calculate relative dimensions for display (keep proportions)
  const maxDisplaySize = 120;
  const aspectRatio = width / height;
  
  let displayWidth, displayHeight;
  if (aspectRatio > 1) {
    displayWidth = maxDisplaySize;
    displayHeight = maxDisplaySize / aspectRatio;
  } else {
    displayHeight = maxDisplaySize;
    displayWidth = maxDisplaySize * aspectRatio;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{
        fontSize: '0.9rem',
        fontWeight: '500',
        marginBottom: '0.75rem',
        color: '#374151',
        textAlign: 'center'
      }}>
        תצוגה מקדימה
      </div>

      {/* Isometric Canvas Preview */}
      <div style={{
        position: 'relative',
        width: `${displayWidth + 20}px`,
        height: `${displayHeight + 25}px`
      }}>
        {/* Canvas Top Face */}
        <div style={{
          position: 'absolute',
          top: '0px',
          left: '10px',
          width: `${displayWidth}px`,
          height: `${displayHeight}px`,
          backgroundColor: '#ffffff',
          border: '1px solid #d1d5db',
          borderRadius: '2px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          color: '#9ca3af'
        }}>
          תמונה
        </div>

        {/* Canvas Right Side */}
        <div style={{
          position: 'absolute',
          top: '5px',
          left: `${displayWidth + 10}px`,
          width: '10px',
          height: `${displayHeight}px`,
          backgroundColor: sideColor,
          border: '1px solid #d1d5db',
          borderLeft: 'none',
          transform: 'skewY(-30deg)',
          transformOrigin: 'left top',
          opacity: 0.8
        }} />

        {/* Canvas Bottom Side */}
        <div style={{
          position: 'absolute',
          top: `${displayHeight}px`,
          left: '15px',
          width: `${displayWidth}px`,
          height: '10px',
          backgroundColor: sideColor,
          border: '1px solid #d1d5db',
          borderTop: 'none',
          transform: 'skewX(-30deg)',
          transformOrigin: 'left top',
          opacity: 0.7
        }} />
      </div>

      {/* Size Info */}
      <div style={{
        marginTop: '0.75rem',
        fontSize: '0.8rem',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        {width}×{height} ס״מ
      </div>
    </div>
  );
};

export default CanvasPreview;
