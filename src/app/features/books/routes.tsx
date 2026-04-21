import {Navigate, Route, Routes} from 'react-router-dom';
import {ErrorBoundary} from '../../shared/components/ErrorBoundary';
import {BooksListPage, SavedBooksPage} from './pages';

export const BooksRoutes = () => {
    return (
        <Routes>
            <Route index element={
                <ErrorBoundary>
                    <BooksListPage/>
                </ErrorBoundary>
            }/>
            <Route path="saved" element={
                <ErrorBoundary>
                    <SavedBooksPage/>
                </ErrorBoundary>
            }/>
            <Route path="*" element={<Navigate to="/books" replace/>}/>
        </Routes>
    );
};
