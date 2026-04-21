import {describe, it, expect, vi} from 'vitest'
import {renderHook, act} from '@testing-library/react'
import {useBooksService} from './useBooksService'
import {apiService} from "../../../core/services/api.service.ts";
import {AxiosHeaders} from 'axios';

// Mock axios
vi.mock('axios', () => ({
    default: {
        isCancel: vi.fn(() => false),
    },
    AxiosHeaders: class {},
}))

// Mock api service
vi.mock('../../../core/services/api.service', () => ({
    apiService: {
        get: vi.fn(),
        post: vi.fn(),
    },
}))

vi.mock('../../../../environments/environment', () => ({
    environment: {
        apiBaseUrl: 'http://localhost:3000',
        apiLocalDbUrl: 'http://localhost:3001',
    },
}))

describe('useBooksService', () => {
    it('returns initial state', () => {
        const {result} = renderHook(() => useBooksService())
        expect(result.current.booksList).toEqual([])
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBe(null)
        expect(result.current.hasMore).toBe(false)
    })

    it('searchBooks resets booksList and re-populates on a new search', async () => {
        const firstResults = [{id: 1, title: 'React Book'}]
        const secondResults = [{id: 2, title: 'Angular Book'}]

        // First call returns firstResults, second call returns secondResults
        vi.mocked(apiService.get)
            .mockResolvedValueOnce({
                data: {results: firstResults, next: null},
                status: 200,
                statusText: 'OK',
                headers: new AxiosHeaders(),
                config: {headers: new AxiosHeaders()}
            })
            .mockResolvedValueOnce({
                data: {results: secondResults, next: null},
                status: 200,
                statusText: 'OK',
                headers: new AxiosHeaders(),
                config: {headers: new AxiosHeaders()}
            })

        const {result} = renderHook(() => useBooksService())

        // First search – populates booksList
        await act(async () => {
            result.current.searchBooks('react')
        })
        expect(result.current.booksList).toEqual(firstResults)

        // Second search with a different query –
        // internally calls resetBooks() (clears state), then loadBooks() (refills)
        await act(async () => {
            result.current.searchBooks('angular')
        })
        expect(result.current.booksList).toEqual(secondResults)
    })

    it('has expected return shape', () => {
        const {result} = renderHook(() => useBooksService())
        const keys = Object.keys(result.current)
        expect(keys).toContain('booksList')
        expect(keys).toContain('isLoading')
        expect(keys).toContain('isSavedLoading')
        expect(keys).toContain('isOperationLoading')
        expect(keys).toContain('error')
        expect(keys).toContain('hasMore')
        expect(keys).toContain('searchBooks')
        expect(keys).toContain('loadBooks')
        expect(keys).toContain('loadMoreBooks')
        expect(keys).toContain('loadSavedBooksFromDatabase')
        expect(keys).toContain('saveBooksToDatabase')
        expect(keys).toContain('deleteBooksFromDatabase')
    })
})
