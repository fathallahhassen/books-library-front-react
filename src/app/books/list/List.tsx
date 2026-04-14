import React, {useEffect, useRef, useState} from 'react';
import {useBooksService} from '../books.service';
import {useBooksSelection} from '../use-books-selection';
import type {BookModel} from '../../shared/models/BookModel';
import BooksSelectionToolbar from '../../shared/components/books-selection-toolbar/BooksSelectionToolbar';
import BookCard from '../../shared/components/book-card/BookCard';
import './List.scss';

const List = () => {
    const {booksList, isLoading, searchBooks, loadBooks, loadMoreBooks} = useBooksService();
    const {dispatch, state} = useBooksSelection();
    const [searchTerm, setSearchTerm] = useState('');
    const sentinelRef = useRef<HTMLDivElement>(null);
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        if (hasInitializedRef.current) {
            return;
        }

        hasInitializedRef.current = true;
        loadBooks(true);
        dispatch({type: 'CLEAR_DRAFT_SELECTION'});
    }, [dispatch, loadBooks]);

    useEffect(() => {
        // 1. Capture the current ref value in a variable
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

    const handleFilterBooks = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            submitSearch();
        }
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

    const handleSaveSelection = () => {
        dispatch({type: 'SAVE_SELECTION'});
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

            <div className="books-list__search mb-4">
                <div className="input-group input-group-lg">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Search books..."
                        value={searchTerm}
                        onChange={handleFilterBooks}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="books-list__search-btn btn btn-primary"
                        type="button"
                        onClick={submitSearch}
                        aria-label="Search books"
                    >
                        →
                    </button>
                </div>
                <small className="books-list__search-hint">Press Enter or click the arrow to search.</small>
            </div>

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

export default List;


