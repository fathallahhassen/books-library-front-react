# Books Library - React
This is a React implementation of the Books Library Angular application. It provides a modern interface for browsing and managing a collection of books from the Gutendex API.
## Features
- **Book Listing**: Browse books from the Gutendex API
- **Search**: Search for books by title, author, or other criteria
- **Infinite Scroll**: Load more books as you scroll down with intersection observer
- **Book Selection**: Select and save your favorite books to a draft
- **Saved Books Management**: View, manage, and remove saved books
- **Responsive Design**: Works on desktop, tablet, and mobile devices
## Project Structure
```
src/
├── app/
│   ├── books/
│   │   ├── list/                      # List view component
│   │   ├── saved/                     # Saved books view component
│   │   ├── books.service.ts           # Books API service hook
│   │   └── books-selection.store.tsx  # State management context with reducer
│   ├── shared/
│   │   ├── components/
│   │   │   ├── book-card/             # Individual book card component
│   │   │   └── books-selection-toolbar/  # Toolbar with actions
│   │   ├── models/
│   │   │   └── BookModel.ts           # TypeScript interfaces
│   │   └── services/
│   │       └── api.service.ts         # HTTP client service (Axios)
│   └── App.tsx                        # Main app component with routing
├── environments/                       # Environment configurations
├── styles.scss                        # Global styles
└── main.tsx                           # Entry point
```
## Technologies Used
- **React 18**: UI library
- **TypeScript**: Type safety and better DX
- **React Router v7**: Client-side routing
- **Axios**: HTTP client for API calls
- **Bootstrap 5**: CSS framework
- **SCSS**: Styling with nesting support
- **Vite**: Fast build tool and dev server
## Installation
```bash
npm install
```
## Running the App
```bash
npm run dev
```
The app will start on `http://localhost:5173/`
## Building for Production
```bash
npm run build
```
Production build will be available in the `dist/` directory.
## Preview Production Build
```bash
npm run preview
```
## API
The app uses the [Gutendex API](https://gutendex.com/) for book data.
Example API endpoint: `https://gutendex.com/books`
## State Management
State is managed using React Context API with useReducer for:
- Draft book selections
- Saved books
- Books marked for removal
## Routing
- `/books` - Main books list page
- `/books/saved` - Saved books page
- `/` - Redirects to `/books`
## License
MIT
