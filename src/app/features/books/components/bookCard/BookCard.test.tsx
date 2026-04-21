import {describe, it, expect, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import BookCard from './BookCard'
import type {BookModel} from '../../../../shared/models/BookModel'

const mockBook: BookModel = {
    id: 1,
    title: 'Test Book Title',
    authors: [{name: 'Test Author', birth_year: 1900, death_year: 1980}],
    summaries: ['Test summary'],
    editors: [],
    translators: [],
    subjects: ['Fiction'],
    bookshelves: [],
    languages: ['en'],
    copyright: false,
    media_type: 'Text',
    formats: {'image/jpeg': 'https://example.com/cover.jpg'},
    download_count: 100,
}

describe('BookCard', () => {
    it('renders book title', () => {
        const onClick = vi.fn()
        render(<BookCard book={mockBook} onClick={onClick} />)
        expect(screen.getByText('Test Book Title')).toBeInTheDocument()
    })

    it('calls onClick when clicked', () => {
        const onClick = vi.fn()
        render(<BookCard book={mockBook} onClick={onClick} />)
        screen.getByText('Test Book Title').click()
        expect(onClick).toHaveBeenCalledWith(mockBook)
    })

    it('shows selected badge when selected', () => {
        const onClick = vi.fn()
        render(<BookCard book={mockBook} onClick={onClick} selected selectedLabel="Selected" />)
        expect(screen.getByText('Selected')).toBeInTheDocument()
    })

    it('does not show badge when not selected', () => {
        const onClick = vi.fn()
        render(<BookCard book={mockBook} onClick={onClick} selected={false} />)
        expect(screen.queryByText('Selected')).not.toBeInTheDocument()
    })
})
