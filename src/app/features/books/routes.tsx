import {Route} from 'react-router-dom';
import {BooksListPage, SavedBooksPage} from './pages';

export const BooksRoutes = () => {
    return (
        <>
            <Route path="/books" element={<BooksListPage/>}/>
            <Route path="/books/saved" element={<SavedBooksPage/>}/>
        </>
    );
};
