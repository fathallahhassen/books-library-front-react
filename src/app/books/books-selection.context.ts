import {createContext} from 'react';
import type React from 'react';
import type {BookModel} from '../shared/models/BookModel';

export interface BooksSelectionState {
    draftBooks: BookModel[];
    savedBooks: BookModel[];
    removeDraftBooks: BookModel[];
}

export type BooksSelectionAction =
    | { type: 'TOGGLE_DRAFT_BOOK'; payload: BookModel }
    | { type: 'TOGGLE_REMOVE_DRAFT_BOOK'; payload: BookModel }
    | { type: 'CLEAR_DRAFT_SELECTION' }
    | { type: 'SYNC_DRAFT_FROM_SAVED' }
    | { type: 'SAVE_SELECTION' }
    | { type: 'UNSAVE_SELECTED_BOOKS' };

export const initialState: BooksSelectionState = {
    draftBooks: [],
    savedBooks: [],
    removeDraftBooks: [],
};

export const booksSelectionReducer = (
    state: BooksSelectionState,
    action: BooksSelectionAction,
): BooksSelectionState => {
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
};

export const BooksSelectionContext = createContext<{
    state: BooksSelectionState;
    dispatch: React.Dispatch<BooksSelectionAction>;
} | null>(null);
