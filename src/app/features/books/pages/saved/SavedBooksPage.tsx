import {useEffect, useState} from 'react';
import {useBooksService, useBooksSelection, useBooksSelectionSelectors} from '../../hooks';
import type {BookModel} from '../../../../shared/models/BookModel';
import {BookCard, BooksSearchBar, BooksSelectionToolbar} from '../../components';
import './SavedBooksPage.scss';

const SavedBooksPage = () => {
    const {loadSavedBooksFromDatabase, deleteBooksFromDatabase, isOperationLoading} = useBooksService();
    const {dispatch, state} = useBooksSelection();
    const {savedCount} = useBooksSelectionSelectors();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        void loadSavedBooksFromDatabase().then(savedBooks => {
            dispatch({type: 'SET_SAVED_BOOKS', payload: savedBooks});
            dispatch({type: 'SYNC_DRAFT_FROM_SAVED'});
        });
    }, [dispatch, loadSavedBooksFromDatabase]);

    const toggleRemoveSelection = (book: BookModel) => {
        dispatch({type: 'TOGGLE_REMOVE_DRAFT_BOOK', payload: book});
    };

    const submitSavedSearch = async () => {
        const savedBooks = await loadSavedBooksFromDatabase(searchTerm);
        dispatch({type: 'SET_SAVED_BOOKS', payload: savedBooks});
        dispatch({type: 'SYNC_DRAFT_FROM_SAVED'});
    };

    const isMarkedForRemoval = (book: BookModel): boolean => {
        return state.removeDraftBooks.some((b) => b.id === book.id);
    };

    const handleUnsaveSelection = async () => {
        if (!state.removeDraftBooks.length || isOperationLoading) {
            return;
        }

        const deletedIds = await deleteBooksFromDatabase(state.removeDraftBooks.map(book => book.id));
        if (!deletedIds.length) {
            return;
        }

        const savedBooks = await loadSavedBooksFromDatabase(searchTerm);
        dispatch({type: 'SET_SAVED_BOOKS', payload: savedBooks});
        dispatch({type: 'SYNC_DRAFT_FROM_SAVED'});
    };

    const hasSavedBooks = state.savedBooks.length > 0;

    return (
        <div className="books-list container py-4">
            <BooksSelectionToolbar
                title="Saved books"
                subtitle="Your current saved selection"
                saveLabel="Unsave selected books"
                saveMode="saved"
                onSave={handleUnsaveSelection}
                isLoading={isOperationLoading}
            />

            <p className="books-list__meta mb-4">
                Total saved books: <strong>{savedCount}</strong>
            </p>

            <BooksSearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSubmit={submitSavedSearch}
                placeholder="Search saved books..."
            />

            {!hasSavedBooks ? (
                <div className="loader py-5">No saved books found.</div>
            ) : (
                <div className="books-list__grid row g-4">
                    {state.savedBooks.map((book) => (
                        <div key={book.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                            <BookCard
                                book={book}
                                selected={isMarkedForRemoval(book)}
                                selectedLabel="Marked for removal"
                                badgeVariant="removal"
                                onClick={toggleRemoveSelection}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedBooksPage;
