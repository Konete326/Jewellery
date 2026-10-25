import { createContext, useContext, useState, useMemo } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [activePage, setActivePage] = useState('home');
  const [activeProductSlug, setActiveProductSlug] = useState(null);
  const [cart, setCart] = useState([]);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState(null);

  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null
  });

  const navigateTo = (page, slug = null) => {
    setActivePage(page);
    setActiveProductSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showAlert('Added to Bag', `${product.title} has been added to your shopping bag.`, 'success');
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const openInquiry = (product = null) => {
    setInquiryProduct(product);
    setIsInquiryOpen(true);
  };

  const closeInquiry = () => {
    setIsInquiryOpen(false);
    setInquiryProduct(null);
  };

  const showAlert = (title, message, type = 'info') => {
    setAlertState({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: null
    });
  };

  const showConfirm = (title, message, onConfirm) => {
    setAlertState({
      isOpen: true,
      title,
      message,
      type: 'confirm',
      onConfirm
    });
  };

  const closeAlert = () => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  };

  const value = useMemo(
    () => ({
      activePage,
      activeProductSlug,
      navigateTo,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      isInquiryOpen,
      inquiryProduct,
      openInquiry,
      closeInquiry,
      alertState,
      showAlert,
      showConfirm,
      closeAlert
    }),
    [activePage, activeProductSlug, cart, isInquiryOpen, inquiryProduct, alertState]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
