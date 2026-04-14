import type {BookModel} from '../shared/models/BookModel';
import {useBooksSelection} from './use-books-selection';

export const useBooksSelectionSelectors = () => {
    const {state} = useBooksSelection();

    return {
        draftBooks: state.draftBooks,
        savedBooks: state.savedBooks,
        removeDraftBooks: state.removeDraftBooks,
        draftCount: state.draftBooks.length,
        savedCount: state.savedBooks.length,
        removeDraftCount: state.removeDraftBooks.length,
        hasDraftSelection: state.draftBooks.length > 0,
        hasSavedSelection: state.savedBooks.length > 0,
        hasRemoveDraftSelection: state.removeDraftBooks.length > 0,
        isDraftSelected: (book: BookModel) => state.draftBooks.some(item => item.id === book.id),
        isSavedSelected: (book: BookModel) => state.savedBooks.some(item => item.id === book.id),
        isRemoveDraftSelected: (book: BookModel) => state.removeDraftBooks.some(item => item.id === book.id),
    };
};
