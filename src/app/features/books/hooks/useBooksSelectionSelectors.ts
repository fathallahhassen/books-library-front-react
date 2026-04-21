import {useBooksSelection} from './useBooksSelection';

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
    };
};
