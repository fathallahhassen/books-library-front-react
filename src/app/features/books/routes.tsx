import {Navigate, Route, Routes} from 'react-router-dom';
import {BooksListPage, SavedBooksPage} from './pages';

export const BooksRoutes = () => {
    return (
        <Routes>
            <Route index element={<BooksListPage/>}/>
            <Route path="saved" element={<SavedBooksPage/>}/>
            <Route path="*" element={<Navigate to="/books" replace/>}/>
        </Routes>
    );
};
