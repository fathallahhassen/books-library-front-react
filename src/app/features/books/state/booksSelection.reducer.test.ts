import {describe, it, expect} from 'vitest'
import {booksSelectionReducer, initialState} from './booksSelection.context'
import type {BookModel} from '../../../shared/models/BookModel'

const mockBook: BookModel = {
    id: 1,
    title: 'Test Book',
    authors: [{name: 'Author', birth_year: 1900, death_year: 1980}],
    summaries: [],
    editors: [],
    translators: [],
    subjects: [],
    bookshelves: [],
    languages: ['en'],
    copyright: false,
    media_type: 'Text',
    formats: {},
    download_count: 10,
}

describe('booksSelectionReducer', () => {
    describe('TOGGLE_DRAFT_BOOK', () => {
        it('adds book to draft when not present', () => {
            const action = {type: 'TOGGLE_DRAFT_BOOK' as const, payload: mockBook}
            const newState = booksSelectionReducer(initialState, action)
            expect(newState.draftBooks).toContain(mockBook)
        })

        it('removes book from draft when already present', () => {
            const stateWithBook = {...initialState, draftBooks: [mockBook]}
            const action = {type: 'TOGGLE_DRAFT_BOOK' as const, payload: mockBook}
            const newState = booksSelectionReducer(stateWithBook, action)
            expect(newState.draftBooks).not.toContainEqual(mockBook)
        })
    })

    describe('TOGGLE_REMOVE_DRAFT_BOOK', () => {
        it('adds book to remove draft', () => {
            const action = {type: 'TOGGLE_REMOVE_DRAFT_BOOK' as const, payload: mockBook}
            const newState = booksSelectionReducer(initialState, action)
            expect(newState.removeDraftBooks).toContain(mockBook)
        })

        it('removes book from remove draft when already present', () => {
            const stateWithBook = {...initialState, removeDraftBooks: [mockBook]}
            const action = {type: 'TOGGLE_REMOVE_DRAFT_BOOK' as const, payload: mockBook}
            const newState = booksSelectionReducer(stateWithBook, action)
            expect(newState.removeDraftBooks).not.toContainEqual(mockBook)
        })
    })

    describe('CLEAR_DRAFT_SELECTION', () => {
        it('clears all draft selections', () => {
            const stateWithDrafts = {
                ...initialState,
                draftBooks: [mockBook],
                removeDraftBooks: [mockBook],
            }
            const newState = booksSelectionReducer(stateWithDrafts, {type: 'CLEAR_DRAFT_SELECTION'})
            expect(newState.draftBooks).toEqual([])
            expect(newState.removeDraftBooks).toEqual([])
        })
    })

    describe('SYNC_DRAFT_FROM_SAVED', () => {
        it('copies saved books to draft', () => {
            const stateWithSaved = {...initialState, savedBooks: [mockBook]}
            const newState = booksSelectionReducer(stateWithSaved, {type: 'SYNC_DRAFT_FROM_SAVED'})
            expect(newState.draftBooks).toEqual([mockBook])
        })
    })

    describe('SET_SAVED_BOOKS', () => {
        it('sets saved books', () => {
            const newBooks = [mockBook, {...mockBook, id: 2, title: 'Book 2'}]
            const newState = booksSelectionReducer(initialState, {type: 'SET_SAVED_BOOKS', payload: newBooks})
            expect(newState.savedBooks).toEqual(newBooks)
        })
    })
})
