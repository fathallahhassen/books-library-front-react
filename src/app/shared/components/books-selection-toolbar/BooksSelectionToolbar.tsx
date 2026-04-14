import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooksSelectionSelectors } from '../../../books/books-selection.store';
import './BooksSelectionToolbar.scss';

interface BooksSelectionToolbarProps {
  title: string;
  subtitle: string;
  saveLabel?: string;
  saveMode?: 'draft' | 'saved';
  onSave: () => void;
}

const BooksSelectionToolbar: React.FC<BooksSelectionToolbarProps> = ({
  title,
  subtitle,
  saveLabel = 'Save selection',
  saveMode = 'draft',
  onSave,
}) => {
  const navigate = useNavigate();
  const {
    savedCount,
    draftCount,
    removeDraftCount,
    hasDraftSelection,
    hasRemoveDraftSelection,
  } = useBooksSelectionSelectors();

  const saveEnabled = saveMode === 'draft' ? hasDraftSelection : hasRemoveDraftSelection;

  const viewSelection = () => {
    navigate('/books/saved');
  };

  const handleSave = () => {
    onSave();
  };

  const getBadgeCount = () => {
    if (saveMode === 'draft') {
      return draftCount;
    } else {
      return removeDraftCount;
    }
  };

  return (
    <div className="books-toolbar d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <div>
        <h1 className="books-toolbar__title mb-1">{title}</h1>
        <p className="books-toolbar__subtitle mb-0">{subtitle}</p>
      </div>

      <div className="d-flex flex-wrap gap-2">
        {saveMode === 'draft' && (
          <button className="books-toolbar__view btn btn-outline-primary" type="button" onClick={viewSelection}>
            View selection
            {savedCount > 0 && (
              <span className="books-toolbar__badge books-toolbar__badge--inline">
                {savedCount}
              </span>
            )}
          </button>
        )}

        <button
          className={`books-toolbar__save btn ${saveEnabled ? 'btn-success' : 'btn-secondary'}`}
          type="button"
          disabled={!saveEnabled}
          onClick={handleSave}
        >
          {saveLabel}
          {getBadgeCount() > 0 && (
            <span className="books-toolbar__badge books-toolbar__badge--inline">
              {getBadgeCount()}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default BooksSelectionToolbar;
