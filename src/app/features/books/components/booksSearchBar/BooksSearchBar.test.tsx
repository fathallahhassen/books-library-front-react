import {describe, it, expect, vi} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'
import BooksSearchBar from './BooksSearchBar'

describe('BooksSearchBar', () => {
    it('renders with placeholder', () => {
        render(
            <BooksSearchBar
                value=""
                onChange={() => {}}
                onSubmit={() => {}}
            />
        )
        expect(screen.getByPlaceholderText('Search books...')).toBeInTheDocument()
    })

    it('renders with custom placeholder', () => {
        render(
            <BooksSearchBar
                value=""
                onChange={() => {}}
                onSubmit={() => {}}
                placeholder="Find a book..."
            />
        )
        expect(screen.getByPlaceholderText('Find a book...')).toBeInTheDocument()
    })

    it('displays value', () => {
        render(
            <BooksSearchBar
                value="Harry Potter"
                onChange={() => {}}
                onSubmit={() => {}}
            />
        )
        expect(screen.getByDisplayValue('Harry Potter')).toBeInTheDocument()
    })

    it('calls onChange when typing', () => {
        const onChange = vi.fn()
        render(
            <BooksSearchBar
                value=""
                onChange={onChange}
                onSubmit={() => {}}
            />
        )
        fireEvent.change(screen.getByRole('textbox'), {target: {value: 'abc'}})
        expect(onChange).toHaveBeenCalledWith('abc')
    })

    it('calls onSubmit when pressing Enter', () => {
        const onSubmit = vi.fn()
        render(
            <BooksSearchBar
                value=""
                onChange={() => {}}
                onSubmit={onSubmit}
            />
        )
        fireEvent.keyDown(screen.getByRole('textbox'), {key: 'Enter', keyCode: 13})
        expect(onSubmit).toHaveBeenCalled()
    })

    it('calls onSubmit when clicking button', () => {
        const onSubmit = vi.fn()
        render(
            <BooksSearchBar
                value=""
                onChange={() => {}}
                onSubmit={onSubmit}
            />
        )
        fireEvent.click(screen.getByRole('button', {name: 'Search books'}))
        expect(onSubmit).toHaveBeenCalled()
    })
})
