import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { apiService } from '../shared/services/api.service';
import type { BookModel, BookResponseModel } from '../shared/models/BookModel';
import { environment } from '../../environments/environment';

export const useBooksService = () => {
  const [booksList, setBooksList] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const requestVersionRef = useRef(0);
  const activeControllerRef = useRef<AbortController | null>(null);

  const hasMore = nextUrl !== null;

  const resetBooks = useCallback(() => {
    setNextUrl(null);
    setBooksList([]);
  }, []);

  const loadBooks = useCallback(async (reset = false, queryOverride?: string) => {
    if (!reset && (isLoading || !hasMore)) return;

    const isSearchRequest = reset && queryOverride !== undefined;

    if (isSearchRequest && activeControllerRef.current) {
      activeControllerRef.current.abort();
    }

    const newRequestVersion = requestVersionRef.current + 1;
    requestVersionRef.current = newRequestVersion;
    const controller = new AbortController();
    activeControllerRef.current = controller;
    setIsLoading(true);

    const useNextUrl = !reset && nextUrl;
    const url = useNextUrl ? nextUrl! : `${environment.apiBaseUrl}/books`;
    const activeQuery = queryOverride ?? currentQuery;
    const params = !useNextUrl && activeQuery ? { search: activeQuery } : {};

    try {
      const response = await apiService.get<BookResponseModel>(url, { params, signal: controller.signal });
      if (newRequestVersion !== requestVersionRef.current) return;
      const results = response.data.results ?? [];
      setBooksList(prev => reset ? results : [...prev, ...results]);
      setNextUrl(response.data.next);
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        return;
      }

      if (newRequestVersion !== requestVersionRef.current) return;
    } finally {
      if (activeControllerRef.current === controller) {
        activeControllerRef.current = null;
      }

      if (newRequestVersion === requestVersionRef.current) {
        setIsLoading(false);
      }
    }
  }, [isLoading, hasMore, nextUrl, currentQuery]);

  const loadMoreBooks = useCallback(() => {
    if (hasMore && !isLoading) {
      loadBooks(false);
    }
  }, [hasMore, isLoading, loadBooks]);

  const searchBooks = useCallback((query: string) => {
    const normalizedQuery = query.trim();

    if (normalizedQuery === currentQuery && booksList.length) {
      return;
    }

    setCurrentQuery(normalizedQuery);
    resetBooks();
    loadBooks(true, normalizedQuery);
  }, [currentQuery, booksList.length, resetBooks, loadBooks]);

  return {
    booksList,
    isLoading,
    hasMore,
    searchBooks,
    loadBooks,
    loadMoreBooks,
  };
};

