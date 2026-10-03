import type { CheckoutFormValues, Book } from '../types'

type CheckoutFormProps = {
  values: CheckoutFormValues
  books: Book[]
  onChange: (next: CheckoutFormValues) => void
  onSubmit: () => void
}

function CheckoutForm({ values, books, onChange, onSubmit }: CheckoutFormProps) {
  function update<K extends keyof CheckoutFormValues>(key: K, value: CheckoutFormValues[K]) {
    onChange({ ...values, [key]: value })
  }

  return (
    <section className="card">
      <h2>Create Checkout</h2>
      <p className="section-note">Record a loan. Notes are optional.</p>

      <form onSubmit={(event) => { event.preventDefault(); onSubmit() }}>
        <div className="form-grid">
          <label htmlFor="checkout-patron-name">Patron Name</label>
          <input
            id="checkout-patron-name"
            maxLength={255}
            required
            value={values.patron_name}
            onChange={(event) => update('patron_name', event.target.value)}
          />

          <label htmlFor="checkout-book">Book</label>
          <select
            id="checkout-book"
            required
            value={values.book_id}
            onChange={(event) => update('book_id', event.target.value)}
          >
            <option value="">Select a book</option>
            {books.map((book) => (
              <option key={book.id} value={String(book.id)}>
                {`${book.id} - ${book.title}`}
              </option>
            ))}
          </select>

          <label htmlFor="checkout-date">Date</label>
          <input
            id="checkout-date"
            required
            type="date"
            value={values.date}
            onChange={(event) => update('date', event.target.value)}
          />

          <label htmlFor="checkout-notes">Notes</label>
          <textarea
            id="checkout-notes"
            value={values.notes}
            onChange={(event) => update('notes', event.target.value)}
          />
        </div>

        <button type="submit" disabled={books.length === 0}>Create Checkout</button>
        {books.length === 0 && <p className="section-note">Add a book before recording a checkout.</p>}
      </form>
    </section>
  )
}

export default CheckoutForm
