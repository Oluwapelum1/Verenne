import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Cart items with size variant support
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('verenne-cart') || localStorage.getItem('verenne-cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist persistence
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('verenne-wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [bagBounce, setBagBounce] = useState(false);

  // Flying thumbnail animation state
  const [flyingItem, setFlyingItem] = useState(null); // { id, startRect: { x, y } }

  useEffect(() => {
    try {
      localStorage.setItem('verenne-cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('verenne-wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? 'Removed from wishlist' : 'Saved to botanical wishlist');
      return next;
    });
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  const triggerFlyToCart = (startRect, product) => {
    if (!startRect) return;
    setFlyingItem({
      product,
      startX: startRect.left + startRect.width / 2,
      startY: startRect.top + startRect.height / 2
    });

    // Clear flying item after arc finishes and bounce bag
    setTimeout(() => {
      setFlyingItem(null);
      setBagBounce(true);
      setTimeout(() => setBagBounce(false), 600);
    }, 750);
  };

  const addToCart = (product, sizeVariant = null, quantity = 1, triggerRect = null) => {
    // Accepts a size object, a size label ('30 ml') or nothing (defaults to first size)
    const selectedSize =
      (typeof sizeVariant === 'string'
        ? product.sizes?.find((s) => s.size === sizeVariant)
        : sizeVariant) ||
      product.sizes?.[0] ||
      { size: 'Standard', price: product.price };
    const cartItemId = `${product.id}-${selectedSize.size}`;

    if (triggerRect) {
      triggerFlyToCart(triggerRect, product);
    } else {
      setBagBounce(true);
      setTimeout(() => setBagBounce(false), 500);
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          id: product.id,
          name: product.fullName || product.name,
          image: product.image,
          subtitle: product.subtitle,
          price: selectedSize.price,
          size: selectedSize.size,
          volume: selectedSize.volume || selectedSize.size,
          kind: product.kind,
          tint: product.tint,
          quantity
        }
      ];
    });

    showToast(`${product.fullName || product.name} · ${selectedSize.size} — added`);
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyPromo = (code) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return;
    if (clean === 'BOTANICAL15' || clean === 'VELININ15') {
      setDiscountPercent(15);
      setPromoApplied(true);
      setPromoError('');
      showToast('15% botanical circle discount applied');
    } else {
      setPromoError('Invalid code. Try BOTANICAL15');
      setDiscountPercent(0);
      setPromoApplied(false);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingThreshold = 120;
  const shippingFee = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 12;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Suggestions for "Complete the Ritual" in cart
  const ritualSuggestions = PRODUCTS.filter(
    (p) => !cart.some((c) => c.id === p.id)
  ).slice(0, 2);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        isWishlisted,
        promoCode,
        setPromoCode,
        applyPromo,
        promoApplied,
        promoError,
        discountPercent,
        subtotal,
        discountAmount,
        shippingFee,
        shippingThreshold,
        total,
        totalItemsCount,
        toastMessage,
        bagBounce,
        flyingItem,
        ritualSuggestions
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
