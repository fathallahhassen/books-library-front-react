import {useContext} from 'react';
import {BooksSelectionContext} from '../state/booksSelection.context';

export const useBooksSelection = () => {
    const context = useContext(BooksSelectionContext);

    if (!context) {
        throw new Error('useBooksSelection must be used within BooksSelectionProvider');
    }

    return context;
};
