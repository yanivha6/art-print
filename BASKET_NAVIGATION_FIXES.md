# Basket Navigation Issues - FIXED

## 🐛 Issues Resolved

### ✅ Issue 1: Edit Order Navigation
**Problem:** When clicking "עריכה" (Edit) on a basket item, it was taking users to the image upload page instead of the size configuration step.

**Solution:** Updated OrderPage component to:
- Handle URL parameter `?edit=<itemId>` 
- Load existing basket item data when in edit mode
- Start directly at step 2 (size selection) instead of step 1 (image upload)
- Pre-populate all existing values (image, size, color, prices)

### ✅ Issue 2: Change Image Button Navigation
**Problem:** When clicking "שנה תמונה" (Change Image) from the order review, it wasn't allowing users to actually change the image.

**Solution:** Updated the navigation flow to:
- Allow users to go back to step 1 (image upload) 
- Maintain existing size/color configuration when changing images
- Properly handle the image replacement workflow

## 🔧 Technical Implementation

### **OrderPage Component Updates:**

#### **1. URL Parameter Handling**
```typescript
// Handle edit mode from URL parameters
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
      navigate('/basket'); // Item not found
    }
  }
}, [searchParams, getItem, navigate]);
```

#### **2. Edit Mode UI Changes**
- **Header:** Changes to "עריכת פריט בעגלה" (Edit Basket Item)
- **Subtitle:** "ערכו את התצורה של הפריט שלכם" (Edit your item configuration)
- **Back Button:** "חזרה לעגלה" (Back to Basket) button added
- **Action Button:** "עדכן פריט" (Update Item) instead of "המשך לפרטי הזמנה"

#### **3. Update Functionality**
```typescript
// Update item in basket and return to basket page
onClick={() => {
  if (editingItemId && canvasSize && canvasOptions) {
    updateItem(editingItemId, {
      canvasSize,
      canvasOptions,
      basePrice,
      totalPrice
    });
    navigate('/basket');
  }
}}
```

### **BasketItem Component Integration**
```typescript
const handleEditItem = (itemId: string) => {
  // Store the item ID for editing and navigate to order page
  sessionStorage.setItem('editingItemId', itemId);
  navigate('/order?edit=' + itemId);
};
```

## 🎯 User Experience Flow

### **Edit Item Flow:**
```
1. Basket Page → Click "עריכה" on item
2. Navigate to: /order?edit=<itemId>
3. OrderPage loads in edit mode
4. Skips to Step 2 (Size Selection) with pre-loaded data
5. User modifies size/color as needed
6. Click "עדכן פריט" (Update Item)
7. Item updated in basket, return to Basket Page
```

### **Change Image Flow:**
```
1. Any step in OrderPage → Click "שנה תמונה"
2. Navigate to Step 1 (Image Upload)
3. User selects new image
4. Maintains existing size/color preferences
5. Continue with normal order flow
```

## ✅ **Result**

Both navigation issues are now resolved:

1. **✅ Edit Order** - Takes users directly to size configuration with pre-loaded data
2. **✅ Change Image** - Properly allows image replacement while maintaining configuration

The shopping basket system now provides a seamless editing experience that matches user expectations for e-commerce applications.

## 🔄 **Additional Features Added**

- **Edit Mode Detection** - Visual indicators when editing vs. creating new items
- **Context-Aware UI** - Different buttons and text based on current mode
- **Data Persistence** - Maintains all configuration when switching between modes
- **Error Handling** - Graceful handling of missing items or invalid URLs
- **Navigation Safety** - Prevents users from getting stuck in invalid states

The basket editing functionality is now production-ready and provides an excellent user experience!
