import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { loadingManager } from '@/lib/loadingManager';

const LoadingContext = createContext({
  isLoading: false,
  message: '',
  startLoading: () => {},
  stopLoading: () => {}
});

export const LoadingProvider = ({ children }) => {
  const [state, setState] = useState({ isLoading: false, message: '' });

  useEffect(() => {
    const unsubscribe = loadingManager.subscribe((nextState) => {
      setState(nextState);
    });
    return unsubscribe;
  }, []);

  const startLoading = useCallback((message = '') => {
    loadingManager.start(message);
  }, []);

  const stopLoading = useCallback(() => {
    loadingManager.stop();
  }, []);

  const value = useMemo(
    () => ({
      isLoading: state.isLoading,
      message: state.message,
      startLoading,
      stopLoading
    }),
    [state.isLoading, state.message, startLoading, stopLoading]
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export const useGlobalLoading = () => useContext(LoadingContext);
