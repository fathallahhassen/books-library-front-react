import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {BooksSelectionProvider, BooksRoutes} from './features/books';
import './App.scss';

const App = () => {
    return (
        <BooksSelectionProvider>
            <Router>
                <Routes>
                    <BooksRoutes/>
                    <Route path="/" element={<Navigate to="/books" replace/>}/>
                    <Route path="*" element={<Navigate to="/books" replace/>}/>
                </Routes>
            </Router>
        </BooksSelectionProvider>
    );
};

export default App;
