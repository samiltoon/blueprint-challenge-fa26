import type { BookFormValues, Genre } from '../types'

type BookFormProps = {
  values: BookFormValues
  genres: Genre[]
  onChange: (next: BookFormValues) => void
  onSubmit: () => void
}

function BookForm({ values, genres, onChange, onSubmit }: BookFormProps) {
  function update<K extends keyof BookFormValues>(key: K, value: BookFormValues[K]) {
    onChange({ ...values, [key]: value })
  }

  return (
    <section className="card">
      <h2>Create Book</h2>
      <p className="section-note">All fields are required.</p>

      <form onSubmit={(event) => { event.preventDefault(); onSubmit() }}>
        <div className="form-grid">
          <label htmlFor="book-title">Title</label>
          <input
            id="book-title"
            maxLength={255}
            required
            value={values.title}
            onChange={(event) => update('title', event.target.value)}
          />

          <label htmlFor="book-genre">Genre</label>
          <select
            id="book-genre"
            value={values.genre}
            onChange={(event) => update('genre', event.target.value as Genre)}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          <label htmlFor="book-description">Description</label>
          <textarea
            id="book-description"
            required
            value={values.description}
            onChange={(event) => update('description', event.target.value)}
          />

          <label htmlFor="book-author">Author</label>
          <input
            id="book-author"
            maxLength={255}
            required
            value={values.author}
            onChange={(event) => update('author', event.target.value)}
          />

          <label htmlFor="book-publisher-email">Publisher Email</label>
          <input
            id="book-publisher-email"
            maxLength={255}
            required
            type="email"
            value={values.publisher_email}
            onChange={(event) => update('publisher_email', event.target.value)}
          />

          <label htmlFor="book-shelf-location">Shelf Location</label>
          <input
            id="book-shelf-location"
            maxLength={64}
            required
            value={values.shelf_location}
            onChange={(event) => update('shelf_location', event.target.value)}
          />
        </div>

        <button type="submit">Create Book</button>
      </form>
    </section>
  )
}

export default BookForm
