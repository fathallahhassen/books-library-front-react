import React, {type ReactNode, useReducer} from 'react';
import {BooksSelectionContext, booksSelectionReducer, initialState} from './books-selection.context';

export const BooksSelectionProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [state, dispatch] = useReducer(booksSelectionReducer, initialState);

    return (
        <BooksSelectionContext.Provider value={{state, dispatch}}>
            {children}
        </BooksSelectionContext.Provider>
    );
};
