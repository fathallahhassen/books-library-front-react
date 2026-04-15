import type {BookModel} from '../../../../shared/models/BookModel';
import './BookCard.scss';

interface BookCardProps {
    book: BookModel;
    imageKey?: string;
    selected?: boolean;
    selectedLabel?: string;
    badgeVariant?: 'selected' | 'removal';
    onClick: (book: BookModel) => void;
}

const BookCard = ({
    book,
    imageKey = 'image/jpeg',
    selected = false,
    selectedLabel = 'Selected',
    badgeVariant = 'selected',
    onClick,
}: BookCardProps) => {
    const handleClick = () => {
        onClick(book);
    };

    return (
        <article
            className={`book-card ${selected ? 'book-card--selected' : ''}`}
            onClick={handleClick}
        >
            <div className="book-card__cover">
                <img
                    alt={book.title}
                    src={book.formats[imageKey]}
                    width="300"
                    height="200"
                />
            </div>

            <div className="book-card__body">
                <h2 className="book-card__name">{book.title}</h2>
            </div>

            {selected && (
                <span
                    className={`book-card__badge book-card__badge--${badgeVariant}`}
                >
                    {selectedLabel}
                </span>
            )}
        </article>
    );
};

export default BookCard;
