import { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '../api/productApi.js';
import { FEATURED_SHOWCASE } from '../constants/jewelry.js';

export const useProducts = (initialCategory = 'All', initialMetal = 'All Metals') => {
  const [products, setProducts] = useState(FEATURED_SHOWCASE);
  const [category, setCategory] = useState(initialCategory);
  const [metal, setMetal] = useState(initialMetal);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchProducts({ category, metal });
      if (response?.data?.items && response.data.items.length > 0) {
        setProducts(response.data.items);
      } else {
        const filtered = FEATURED_SHOWCASE.filter((item) => {
          const matchCat = category === 'All' || item.category === category;
          const matchMet = metal === 'All Metals' || item.metal === metal;
          return matchCat && matchMet;
        });
        setProducts(filtered);
      }
    } catch (err) {
      const filtered = FEATURED_SHOWCASE.filter((item) => {
        const matchCat = category === 'All' || item.category === category;
        const matchMet = metal === 'All Metals' || item.metal === metal;
        return matchCat && matchMet;
      });
      setProducts(filtered);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, metal]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    category,
    setCategory,
    metal,
    setMetal,
    loading,
    error,
    refresh: loadProducts
  };
};
