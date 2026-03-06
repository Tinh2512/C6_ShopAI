import { useState, useMemo, useCallback, useRef } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import type { Product, SortOption } from '../data/products';

const ITEMS_PER_PAGE = 10;

export const useProductList = () => {
  const [searchQuery,     setSearchQuery]     = useState('');
  const [activeCategory,  setActiveCategory]  = useState('all');
  const [sortOption,      setSortOption]      = useState<SortOption>('default');
  const [page,            setPage]            = useState(1);
  const [isLoadingMore,   setIsLoadingMore]   = useState(false);

  // Debounce ref
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(text);
      setPage(1);
    }, 300);
  }, []);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((sort: SortOption) => {
    setSortOption(sort);
    setPage(1);
  }, []);

  // Filter + sort (memoized)
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Filter by search
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sortOption) {
      case 'price_asc':  result.sort((a, b) => a.price - b.price);          break;
      case 'price_desc': result.sort((a, b) => b.price - a.price);          break;
      case 'rating':     result.sort((a, b) => b.rating - a.rating);        break;
      case 'popular':    result.sort((a, b) => b.reviewCount - a.reviewCount); break;
    }

    return result;
  }, [debouncedQuery, activeCategory, sortOption]);

  // Paginated slice (memoized)
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(0, page * ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  const hasMore = paginatedProducts.length < filteredProducts.length;

  // Load more (simulate async)
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setPage(prev => prev + 1);
      setIsLoadingMore(false);
    }, 800);
  }, [isLoadingMore, hasMore]);

  // Section data for SectionList
  const sectionData = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    filteredProducts.forEach(p => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });
    return Object.entries(grouped).map(([category, data]) => ({
      title: CATEGORIES.find(c => c.id === category)?.name ?? category,
      icon:  CATEGORIES.find(c => c.id === category)?.icon ?? '📦',
      data,
    }));
  }, [filteredProducts]);

  return {
    // state
    searchQuery,
    activeCategory,
    sortOption,
    isLoadingMore,
    // data
    products:    paginatedProducts,
    totalCount:  filteredProducts.length,
    hasMore,
    sectionData,
    categories:  CATEGORIES,
    // handlers
    handleSearch,
    handleCategoryChange,
    handleSortChange,
    loadMore,
  };
};
