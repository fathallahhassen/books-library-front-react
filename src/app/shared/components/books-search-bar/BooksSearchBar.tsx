import React from 'react';
import './BooksSearchBar.scss'

interface BooksSearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    placeholder?: string;
}

const BooksSearchBar = ({
                            value,
                            onChange,
                            onSubmit,
                            placeholder = 'Search books...',
                        }: BooksSearchBarProps) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSubmit();
        }
    };

    return (
        <div className="books-list__search mb-4">
            <div className="input-group input-group-lg">
                <input
                    className="form-control"
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="books-list__search-btn btn btn-primary"
                    type="button"
                    onClick={onSubmit}
                    aria-label="Search books"
                >
                    →
                </button>
            </div>
            <small className="books-list__search-hint">Press Enter or click the arrow to search.</small>
        </div>
    );
};

export default BooksSearchBar;
