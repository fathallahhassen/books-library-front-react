import {useEffect, useRef, useState} from 'react';
import {useBooksService, useBooksSelection} from '../../hooks';
import type {BookModel} from '../../../../shared/models/BookModel';
import {BookCard, BooksSearchBar, BooksSelectionToolbar} from '../../components';
import './BooksListPage.scss';

const BooksListPage = () => {
    const {
        booksList,
        isLoading,
        isOperationLoading,
        searchBooks,
        loadBooks,
        loadMoreBooks,
        loadSavedBooksFromDatabase,
        saveBooksToDatabase,
    } = useBooksService();
    const {dispatch, state} = useBooksSelection();
    const [searchTerm, setSearchTerm] = useState('');
    const sentinelRef = useRef<HTMLDivElement>(null);
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        if (hasInitializedRef.current) {
            return;
        }

        hasInitializedRef.current = true;
        void loadBooks(true);
        dispatch({type: 'CLEAR_DRAFT_SELECTION'});

        void loadSavedBooksFromDatabase().then(savedBooks => {
            dispatch({type: 'SET_SAVED_BOOKS', payload: savedBooks});
        });
    }, [dispatch, loadBooks, loadSavedBooksFromDatabase]);

    useEffect(() => {
        const sentinel = sentinelRef.current;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMoreBooks();
            }
        });

        if (sentinel) {
            observer.observe(sentinel);
        }

        return () => {
            if (sentinel) {
                observer.unobserve(sentinel);
            }
        };
    }, [loadMoreBooks]);

    const submitSearch = () => {
        searchBooks(searchTerm);
    };

    const selectBook = (book: BookModel) => {
        if (state.savedBooks.some((b) => b.id === book.id)) {
            return;
        }
        dispatch({type: 'TOGGLE_DRAFT_BOOK', payload: book});
    };

    const checkBookSelected = (book: BookModel): boolean => {
        return (
            state.draftBooks.some((b) => b.id === book.id) ||
            state.savedBooks.some((b) => b.id === book.id)
        );
    };

    const getSelectedLabel = (book: BookModel): string => {
        return state.savedBooks.some((b) => b.id === book.id) ? 'Saved' : 'Selected';
    };

    const handleSaveSelection = async () => {
        if (!state.draftBooks.length || isOperationLoading) {
            return;
        }

        const savedIds = await saveBooksToDatabase(state.draftBooks);
        if (!savedIds.length) {
            return;
        }

        const savedBooks = await loadSavedBooksFromDatabase();
        dispatch({type: 'SET_SAVED_BOOKS', payload: savedBooks});
        dispatch({type: 'CLEAR_DRAFT_SELECTION'});
    };

    return (
        <div className="books-list container py-4">
            <BooksSelectionToolbar
                title="Books"
                subtitle="Pick books you like"
                saveLabel="Save selection"
                saveMode="draft"
                onSave={handleSaveSelection}
            />

            <BooksSearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSubmit={submitSearch}
                placeholder="Search books..."
            />

            {isLoading && !booksList.length ? (
                <div className="loader py-5">Loading books...</div>
            ) : booksList.length > 0 ? (
                <>
                    <div className="books-list__grid row g-4">
                        {booksList.map((book) => (
                            <div key={book.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                                <BookCard
                                    book={book}
                                    selected={checkBookSelected(book)}
                                    selectedLabel={getSelectedLabel(book)}
                                    badgeVariant="selected"
                                    onClick={selectBook}
                                />
                            </div>
                        ))}
                    </div>
                    {isLoading && <div className="loader py-4">Loading more books...</div>}
                    <div ref={sentinelRef} className="books-list__sentinel"/>
                </>
            ) : (
                <div className="loader py-5">No books found.</div>
            )}
        </div>
    );
};

export default BooksListPage;
