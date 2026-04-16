import {type ReactNode, useReducer} from 'react';
import {BooksSelectionContext, booksSelectionReducer, initialState} from './booksSelection.context';

export const BooksSelectionProvider = ({children}: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(booksSelectionReducer, initialState);

    return (
        <BooksSelectionContext.Provider value={{state, dispatch}}>
            {children}
        </BooksSelectionContext.Provider>
    );
};
