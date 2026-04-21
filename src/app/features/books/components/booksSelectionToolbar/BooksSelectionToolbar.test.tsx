import type {ReactElement} from 'react'
import {describe, it, expect} from 'vitest'
import {render, screen} from '@testing-library/react'
import {BrowserRouter} from 'react-router-dom'
import {BooksSelectionProvider} from '../../state'
import BooksSelectionToolbar from './BooksSelectionToolbar'

const renderWithProvider = (component: ReactElement) => {
    return render(
        <BrowserRouter>
            <BooksSelectionProvider>
                {component}
            </BooksSelectionProvider>
        </BrowserRouter>
    )
}

describe('BooksSelectionToolbar', () => {
    it('renders title and subtitle', () => {
        renderWithProvider(
            <BooksSelectionToolbar
                title="Test Title"
                subtitle="Test Subtitle"
                onSave={() => {
                }}
            />
        )
        expect(screen.getByText('Test Title')).toBeInTheDocument()
        expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
    })

    it('renders save button with label', () => {
        renderWithProvider(
            <BooksSelectionToolbar
                title="Test"
                subtitle="Test"
                saveLabel="Save Books"
                onSave={() => {
                }}
            />
        )
        expect(screen.getByRole('button', {name: /Save Books/i})).toBeInTheDocument()
    })

    it('save button is disabled when no selection', () => {
        renderWithProvider(
            <BooksSelectionToolbar
                title="Test"
                subtitle="Test"
                onSave={() => {
                }}
            />
        )
        expect(screen.getByRole('button', {name: /Save selection/i})).toBeDisabled()
    })

    it('shows loading state', () => {
        renderWithProvider(
            <BooksSelectionToolbar
                title="Test"
                subtitle="Test"
                onSave={() => {
                }}
                isLoading={true}
            />
        )
        expect(screen.getByText('Saving...')).toBeInTheDocument()
    })
    it.todo('calls onSave when save button clicked')
    // This test currently has no interaction or assertion, so it passes even if onSave is broken.
    // Seed the selection context and click the enabled button
    /*    it('calls onSave when save button clicked', () => {
            const onSave = vi.fn()
            renderWithProvider(
                <BooksSelectionToolbar
                    title="Test"
                    subtitle="Test"
                    onSave={onSave}
                />
            )
            // Button is disabled without selection, so let's mock the context state
        })*/
})
