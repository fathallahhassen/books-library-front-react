import {useState, useCallback, useRef} from 'react';
import axios from 'axios';
import {apiService} from '../../../core/services/api.service';
import type {
    BookModel,
    BookResponseModel,
    SavedBooksResponseModel,
    BulkInsertBooksResponseModel,
    BulkDeleteBooksResponseModel,
} from '../../../shared/models/BookModel';
import {environment} from '../../../../environments/environment';

export const useBooksService = () => {
    const [booksList, setBooksList] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSavedLoading, setIsSavedLoading] = useState(false);
    const [isOperationLoading, setIsOperationLoading] = useState(false);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [currentQuery, setCurrentQuery] = useState('');
    const [error, setError] = useState<string | null>(null);
    const requestVersionRef = useRef(0);
    const activeControllerRef = useRef<AbortController | null>(null);

    const hasMore = nextUrl !== null;

    const resetBooks = useCallback(() => {
        setNextUrl(null);
        setBooksList([]);
        setError(null);
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
        setError(null);

        const useNextUrl = !reset && nextUrl;
        const url = useNextUrl ? nextUrl! : `${environment.apiBaseUrl}/books`;
        const activeQuery = queryOverride ?? currentQuery;
        const params = !useNextUrl && activeQuery ? {search: activeQuery} : {};

        try {
            const response = await apiService.get<BookResponseModel>(url, {params, signal: controller.signal});
            if (newRequestVersion !== requestVersionRef.current) return;
            const results = response.data.results ?? [];
            setBooksList(prev => (reset ? results : [...prev, ...results]));
            setNextUrl(response.data.next);
        } catch (error: unknown) {
            if (axios.isCancel(error)) return;
            if (newRequestVersion !== requestVersionRef.current) return;
            console.error('Book operation failed:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
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
        if (normalizedQuery.length < 2 || normalizedQuery.length > 100) return;
        if (normalizedQuery === currentQuery && booksList.length) {
            return;
        }

        setCurrentQuery(normalizedQuery);
        resetBooks();
        loadBooks(true, normalizedQuery);
    }, [currentQuery, booksList.length, resetBooks, loadBooks]);

    const loadSavedBooksFromDatabase = useCallback(async (query?: string): Promise<BookModel[]> => {
        const normalizedQuery = query?.trim();
        const hasQuery = Boolean(normalizedQuery);
        const url = hasQuery
            ? `${environment.apiLocalDbUrl}/books/search`
            : `${environment.apiLocalDbUrl}/books`;
        const params = hasQuery ? {q: normalizedQuery} : undefined;

        setIsSavedLoading(true);

        try {
            const response = await apiService.get<SavedBooksResponseModel>(url, {params});
            return response.data.data ?? [];
        } catch {
            return [];
        } finally {
            setIsSavedLoading(false);
        }
    }, []);

    const saveBooksToDatabase = useCallback(async (books: BookModel[]): Promise<number[]> => {
        if (!books.length || isOperationLoading) {
            return [];
        }

        setIsOperationLoading(true);
        try {
            const response = await apiService.post<BulkInsertBooksResponseModel>(
                `${environment.apiLocalDbUrl}/books/bulk-create`,
                {items: books},
            );
            const {insertedIds = [], ignoredIds = []} = response.data.data ?? {};
            return [...insertedIds, ...ignoredIds];
        } catch {
            return [];
        } finally {
            setIsOperationLoading(false);
        }
    }, [isOperationLoading]);

    const deleteBooksFromDatabase = useCallback(async (bookIds: number[]): Promise<number[]> => {
        if (!bookIds.length || isOperationLoading) {
            return [];
        }

        setIsOperationLoading(true);
        try {
            const response = await apiService.post<BulkDeleteBooksResponseModel>(
                `${environment.apiLocalDbUrl}/books/bulk-delete`,
                {ids: bookIds},
            );
            return response.data.data?.deletedIds ?? [];
        } catch {
            return [];
        } finally {
            setIsOperationLoading(false);
        }
    }, [isOperationLoading]);

    return {
        booksList,
        isLoading,
        isSavedLoading,
        isOperationLoading,
        error,
        hasMore,
        searchBooks,
        loadBooks,
        loadMoreBooks,
        loadSavedBooksFromDatabase,
        saveBooksToDatabase,
        deleteBooksFromDatabase,
    };
};
