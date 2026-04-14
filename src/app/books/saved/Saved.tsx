import React, { useEffect } from 'react';
import { useBooksSelection, useBooksSelectionSelectors } from '../books-selection.store';
import type { BookModel } from '../../shared/models/BookModel';
import BooksSelectionToolbar from '../../shared/components/books-selection-toolbar/BooksSelectionToolbar';
import BookCard from '../../shared/components/book-card/BookCard';
import './Saved.scss';

const Saved: React.FC = () => {
  const { dispatch, state } = useBooksSelection();
  const { savedCount } = useBooksSelectionSelectors();

  useEffect(() => {
    dispatch({ type: 'SYNC_DRAFT_FROM_SAVED' });
  }, [dispatch]);

  const toggleRemoveSelection = (book: BookModel) => {
    dispatch({ type: 'TOGGLE_REMOVE_DRAFT_BOOK', payload: book });
  };

  const isMarkedForRemoval = (book: BookModel): boolean => {
    return state.removeDraftBooks.some((b) => b.id === book.id);
  };

  const handleUnsaveSelection = () => {
    dispatch({ type: 'UNSAVE_SELECTED_BOOKS' });
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
      />

      <p className="books-list__meta mb-4">
        Total saved books: <strong>{savedCount}</strong>
      </p>

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

export default Saved;

