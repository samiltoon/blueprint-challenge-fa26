import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as api from './api/api'
import CheckoutForm from './components/CheckoutForm'
import BookDetail from './components/BookDetail'
import BookForm from './components/BookForm'
import BookList from './components/BookList'
import { GENRES, type Genre, type Checkout, type CheckoutFormValues, type Book, type BookFormValues } from './types'

const initialBookForm: BookFormValues = {
  title: '', genre: 'Fiction', description: '', author: '', publisher_email: '', shelf_location: '',
}

function today() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function emptyCheckout(bookId = ''): CheckoutFormValues {
  return { patron_name: '', book_id: bookId, date: today(), notes: '' }
}

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}

function App() {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [bookCheckouts, setBookCheckouts] = useState<Checkout[]>([])
  const [search, setSearch] = useState('')
  const [genreFilter, setGenreFilter] = useState<Genre | 'All'>('All')
  const [bookForm, setBookForm] = useState<BookFormValues>(initialBookForm)
  const [checkoutForm, setCheckoutForm] = useState<CheckoutFormValues>(() => emptyCheckout())
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [savingBook, setSavingBook] = useState(false)
  const [savingCheckout, setSavingCheckout] = useState(false)
  const selectionVersion = useRef(0)
  const selectedId = useRef<number | null>(null)

  useEffect(() => {
    let active = true
    api.listBooks()
      .then(result => { if (active) setBooks(result) })
      .catch(error => { if (active) setError(messageOf(error)) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function handleLoadBooks() {
    setLoading(true)
    setError(null)
    try { setBooks(await api.listBooks()) }
    catch (error) { setError(messageOf(error)) }
    finally { setLoading(false) }
  }

  async function handleSelectBook(bookId: number) {
    const version = ++selectionVersion.current
    selectedId.current = bookId
    setLoadingDetail(true)
    setSelectedBook(null)
    setBookCheckouts([])
    setError(null)
    setCheckoutForm(current => ({ ...current, book_id: String(bookId) }))
    try {
      const [book, checkouts] = await Promise.all([
        api.getBook(bookId), api.listBookCheckouts(bookId),
      ])
      // Ignore a slower response for a book the user has already moved away from.
      if (version === selectionVersion.current) {
        setSelectedBook(book)
        setBookCheckouts(checkouts)
      }
    } catch (error) {
      if (version === selectionVersion.current) setError(messageOf(error))
    } finally {
      if (version === selectionVersion.current) setLoadingDetail(false)
    }
  }

  async function handleCreateBook() {
    if (savingBook) return
    setSavingBook(true)
    setError(null)
    setNotice('')
    try {
      const book = await api.createBook(bookForm)
      setBooks(current => [...current, book])
      setBookForm(initialBookForm)
      setSearch('')
      setGenreFilter('All')
      setNotice(`Added "${book.title}" to the catalog.`)
    } catch (error) { setError(messageOf(error)) }
    finally { setSavingBook(false) }
  }

  async function handleCreateCheckout() {
    if (savingCheckout) return
    setSavingCheckout(true)
    setError(null)
    setNotice('')
    try {
      const checkout = await api.createCheckout(checkoutForm)
      setCheckoutForm(emptyCheckout(String(checkout.book_id)))
      setNotice(`Checkout recorded for ${checkout.patron_name}.`)
      if (selectedId.current === checkout.book_id) {
        setBookCheckouts(current => [...current, checkout].sort((a, b) =>
          b.date.localeCompare(a.date) || b.id - a.id))
      }
    } catch (error) { setError(messageOf(error)) }
    finally { setSavingCheckout(false) }
  }

  const visibleBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.trim().toLowerCase()) &&
    (genreFilter === 'All' || book.genre === genreFilter),
  )

  return (
    <main className="layout">
      <header className="masthead">
        <a className="brand" href="#catalog">LibraryConnect</a>
        <span className="staff-label">Staff catalog</span>
      </header>
      <div className="page-heading">
        <div><h1>Catalog &amp; checkouts</h1>
          <p className="intro">Manage books and record patron checkouts.</p></div>
        <span className="catalog-count">{books.length} {books.length === 1 ? "book" : "books"} in catalog</span>
      </div>
      <nav className="quick-links" aria-label="Workspace sections">
        <a href="#catalog">Catalog</a><a href="#add-book">Add book</a><a href="#record-checkout">Record checkout</a>
      </nav>
      {error && <div className="alert error" role="alert">{error}</div>}
      {notice && <div className="alert success" role="status">{notice}</div>}
      <div className="workspace">
        <div className="catalog-column">
          <div id="catalog" className="anchor">
            <div className="catalog-toolbar"><span>{loading ? 'Loading catalog...' : 'Search by title or filter by genre'}</span>
              <button className="secondary" disabled={loading || savingBook} onClick={() => void handleLoadBooks()}>Refresh catalog</button></div>
            <BookList books={visibleBooks} search={search} genreFilter={genreFilter}
              onSearchChange={setSearch} onGenreChange={setGenreFilter}
              onSelectBook={id => void handleSelectBook(id)} genres={GENRES} />
          </div>
          {loadingDetail && <p role="status">Loading book details...</p>}
          <BookDetail book={selectedBook} checkouts={bookCheckouts} />
        </div>
        <div className="forms-column">
          <fieldset id="add-book" className="form-wrapper anchor" disabled={savingBook || loading}>
            <legend className="sr-only">Add a book to the catalog</legend>
            <BookForm values={bookForm} genres={GENRES} onChange={setBookForm} onSubmit={() => void handleCreateBook()} />
            {savingBook && <p role="status">Saving book...</p>}
          </fieldset>
          <fieldset id="record-checkout" className="form-wrapper anchor" disabled={savingCheckout || loading || loadingDetail}>
            <legend className="sr-only">Record a patron checkout</legend>
            <CheckoutForm values={checkoutForm} books={books} onChange={setCheckoutForm} onSubmit={() => void handleCreateCheckout()} />
            {savingCheckout && <p role="status">Saving checkout...</p>}
          </fieldset>
        </div>
      </div>
      <footer>LibraryConnect - Internal staff tool</footer>
    </main>
  )
}

export default App
