import React, {createContext, useContext, useReducer, type ReactNode} from 'react';
import type {BookModel} from '../shared/models/BookModel';

interface BooksSelectionState {
    draftBooks: BookModel[];
    savedBooks: BookModel[];
    removeDraftBooks: BookModel[];
}

type BooksSelectionAction =
    | { type: 'TOGGLE_DRAFT_BOOK'; payload: BookModel }
    | { type: 'TOGGLE_REMOVE_DRAFT_BOOK'; payload: BookModel }
    | { type: 'CLEAR_DRAFT_SELECTION' }
    | { type: 'SYNC_DRAFT_FROM_SAVED' }
    | { type: 'SAVE_SELECTION' }
    | { type: 'UNSAVE_SELECTED_BOOKS' };

const initialState: BooksSelectionState = {
    draftBooks: [],
    savedBooks: [],
    removeDraftBooks: [],
};

function booksSelectionReducer(state: BooksSelectionState, action: BooksSelectionAction): BooksSelectionState {
    switch (action.type) {
        case 'TOGGLE_DRAFT_BOOK': {
            const exists = state.draftBooks.some(book => book.id === action.payload.id);
            return {
                ...state,
                draftBooks: exists
                    ? state.draftBooks.filter(book => book.id !== action.payload.id)
                    : [...state.draftBooks, action.payload],
            };
        }
        case 'TOGGLE_REMOVE_DRAFT_BOOK': {
            const exists = state.removeDraftBooks.some(book => book.id === action.payload.id);
            return {
                ...state,
                removeDraftBooks: exists
                    ? state.removeDraftBooks.filter(book => book.id !== action.payload.id)
                    : [...state.removeDraftBooks, action.payload],
            };
        }
        case 'CLEAR_DRAFT_SELECTION':
            return {
                ...state,
                draftBooks: [],
                removeDraftBooks: [],
            };
        case 'SYNC_DRAFT_FROM_SAVED':
            return {
                ...state,
                draftBooks: [...state.savedBooks],
                removeDraftBooks: [],
            };
        case 'SAVE_SELECTION': {
            const savedById = new Map(state.savedBooks.map(book => [book.id, book]));
            state.draftBooks.forEach(book => savedById.set(book.id, book));
            return {
                ...state,
                savedBooks: [...savedById.values()],
                draftBooks: [],
            };
        }
        case 'UNSAVE_SELECTED_BOOKS': {
            const toRemove = new Set(state.removeDraftBooks.map(book => book.id));
            return {
                ...state,
                savedBooks: state.savedBooks.filter(book => !toRemove.has(book.id)),
                removeDraftBooks: [],
                draftBooks: state.savedBooks.filter(book => !toRemove.has(book.id)),
            };
        }
        default:
            return state;
    }
}

const BooksSelectionContext = createContext<{
    state: BooksSelectionState;
    dispatch: React.Dispatch<BooksSelectionAction>;
} | null>(null);

export const BooksSelectionProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [state, dispatch] = useReducer(booksSelectionReducer, initialState);

    return (
        <BooksSelectionContext.Provider value={{state, dispatch}}>
            {children}
        </BooksSelectionContext.Provider>
    );
};

export const useBooksSelection = () => {
    const context = useContext(BooksSelectionContext);
    if (!context) {
        throw new Error('useBooksSelection must be used within BooksSelectionProvider');
    }
    return context;
};

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

