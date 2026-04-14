import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BooksSelectionProvider } from './books/books-selection.store';
import List from './books/list/List';
import Saved from './books/saved/Saved';
import './App.scss';

const App: React.FC = () => {
  return (
    <BooksSelectionProvider>
      <Router>
        <Routes>
          <Route path="/books" element={<List />} />
          <Route path="/books/saved" element={<Saved />} />
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="*" element={<Navigate to="/books" replace />} />
        </Routes>
      </Router>
    </BooksSelectionProvider>
  );
};

export default App;
