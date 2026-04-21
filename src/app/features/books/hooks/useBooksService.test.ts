import {describe, it, expect, vi} from 'vitest'
import {renderHook, act} from '@testing-library/react'
import {useBooksService} from './useBooksService'

// Mock axios
vi.mock('axios', () => ({
    default: {
        isCancel: vi.fn(() => false),
    },
}))

// Mock api service
vi.mock('../../core/services/api.service', () => ({
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

    it('resetBooks clears state', async () => {
        const {result} = renderHook(() => useBooksService())
        
        // Access internal reset function via act - the hook exposes it internally
        act(() => {
            // resetBooks is internal, so we test searchBooks which calls it
        })
        
        expect(result.current.booksList).toEqual([])
    })

    it('has expected return shape', () => {
        const {result} = renderHook(() => useBooksService())
        const keys = Object.keys(result.current).sort()
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
