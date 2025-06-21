# ארט פרניט - Hebrew Canvas Printing Website

A beautiful Hebrew website for canvas printing services, built with React, TypeScript, and Vite.

## Features

### 🎨 **Beautiful Hebrew UI**
- Right-to-left (RTL) layout optimized for Hebrew
- Professional Hebrew typography using Assistant and Heebo fonts
- Modern, responsive design with smooth animations

### 📸 **Image Upload & Processing**
- Drag & drop file upload
- Support for JPEG, PNG, WebP formats (up to 10MB)
- Real-time image preview and metadata extraction
- Automatic aspect ratio calculation

### 📏 **Smart Size Calculator**
- Custom canvas sizes from 30×30 cm to 140×300 cm
- Automatic aspect ratio preservation
- Default sizing (100cm for larger side)
- Real-time price calculation
- Size validation with helpful Hebrew error messages

### 💰 **Dynamic Pricing**
- Price calculation based on canvas area (₪0.8 per cm²)
- Minimum order of ₪150
- Live price updates as user adjusts dimensions
- Hebrew number formatting

### 📋 **Order Management**
- Step-by-step order process (Upload → Size → Contact)
- Contact form with validation
- Order summary and confirmation
- Thank you page with order details

### 🏠 **Homepage Features**
- Hero section with call-to-action
- Features showcase
- Gallery of example canvas prints
- Professional branding

## Tech Stack

- **Frontend**: React 19.1.0 + TypeScript
- **Build Tool**: Vite 6.3.5
- **Routing**: React Router DOM
- **Styling**: Custom CSS with Hebrew/RTL support
- **Fonts**: Google Fonts (Assistant, Heebo)

## Project Structure

```
src/
├── components/           # React components
│   ├── Navigation.tsx   # Header navigation
│   ├── HomePage.tsx     # Landing page
│   ├── OrderPage.tsx    # Main order flow
│   ├── ImageUpload.tsx  # File upload component
│   ├── SizeCalculator.tsx # Size selection with pricing
│   ├── ContactForm.tsx  # Order form
│   ├── Gallery.tsx      # Image gallery
│   └── ThankYouPage.tsx # Order confirmation
├── utils/               # Utility functions
│   ├── priceCalculator.ts # Pricing logic
│   ├── sizeValidator.ts   # Size validation
│   └── imageProcessor.ts  # Image handling
├── types/               # TypeScript interfaces
│   └── order.ts        # Order-related types
├── styles/             # CSS files
│   └── hebrew.css      # Hebrew/RTL styles
└── App.tsx             # Main app component
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd print-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Size Constraints
- **Minimum**: 30×30 cm
- **Maximum**: 140×300 cm (width×height)
- **Default**: 100cm for the larger side of the image

### Pricing Model
- Base rate: ₪0.8 per cm²
- Minimum order: ₪150
- Example: 100×70 cm canvas = 7,000 cm² × ₪0.8 = ₪5,600

### Image Requirements
- **Formats**: JPEG, PNG, WebP
- **Max file size**: 10MB
- **Any aspect ratio** supported

### Order Flow
1. **Upload Image**: Drag & drop or select file
2. **Choose Size**: Adjust dimensions with live pricing
3. **Contact Details**: Fill form with delivery information
4. **Confirmation**: Order summary and next steps

## Customization

### Colors
- **Primary**: #1e3a8a (Deep blue)
- **Accent**: #f59e0b (Gold)
- **Success**: #16a34a (Green)
- **Background**: #f8fafc (Light gray)

### Typography
- **Primary Font**: Assistant (Hebrew optimized)
- **Secondary Font**: Heebo (Hebrew fallback)
- **System Fallbacks**: Segoe UI, Tahoma, Arial

### Pricing Configuration
Edit `src/types/order.ts` to modify:
```typescript
export const PRICING = {
  PRICE_PER_CM2: 0.8,    // Price per cm²
  MINIMUM_PRICE: 150     // Minimum order amount
} as const;
```

### Size Constraints
Edit `src/types/order.ts` to modify:
```typescript
export const SIZE_CONSTRAINTS = {
  MIN_WIDTH: 30,
  MIN_HEIGHT: 30,
  MAX_WIDTH: 300,
  MAX_HEIGHT: 140,
  DEFAULT_LARGE_SIDE: 100
} as const;
```

## Browser Support

- **Modern browsers** with ES2020 support
- **Chrome** 88+
- **Firefox** 85+
- **Safari** 14+
- **Edge** 88+

## Accessibility

- ✅ RTL layout support
- ✅ Keyboard navigation
- ✅ Screen reader friendly
- ✅ High contrast support
- ✅ Focus indicators
- ✅ Semantic HTML

## Performance

- ✅ Code splitting with React Router
- ✅ Optimized images with object-fit
- ✅ Minimal bundle size
- ✅ Fast development with Vite HMR

## Deployment

### Build for Production
```bash
npm run build
```

The `dist/` folder will contain the optimized production build.

### Deployment Options
- **Netlify**: Drag & drop the `dist` folder
- **Vercel**: Connect GitHub repository
- **Static hosting**: Upload `dist` folder contents

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary to ארט פרניט.

## Support

For technical support or questions about the canvas printing service:
- **Business Name**: ארט פרניט
- **Service**: Premium Canvas Printing

---

**Built with ❤️ for the Hebrew canvas printing market**
