import type { Genre, Checkout, CheckoutFormValues, Book, BookFormValues } from '../types'

const API_BASE_URL = 'http://localhost:8000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, options)
  } catch {
    throw new Error('Cannot reach the server. Check that the backend is running and try again.')
  }
  if (!response.ok) {
    let message = `Request failed (${response.status}). Please try again.`
    try {
      const body = await response.json()
      if (typeof body.detail === 'string') message = body.detail
      else if (Array.isArray(body.detail)) {
        message = body.detail.map((issue: { loc?: (string | number)[]; msg?: string }) =>
          `${issue.loc?.slice(1).join(' ') || 'Input'}: ${issue.msg || 'Invalid value'}`,
        ).join('. ')
      }
    } catch {
      // A proxy or unavailable server may return an HTML error instead of JSON.
    }
    throw new Error(message)
  }
  return response.json() as Promise<T>
}

export function listBooks(params?: { q?: string; genre?: Genre | 'All' }): Promise<Book[]> {
  const query = new URLSearchParams()
  if (params?.q) query.set('q', params.q)
  if (params?.genre && params.genre !== 'All') query.set('genre', params.genre)
  return request<Book[]>(`/books${query.size ? `?${query}` : ''}`)
}

export function getBook(bookId: number): Promise<Book> {
  return request<Book>(`/books/${bookId}`)
}

export function createBook(payload: BookFormValues): Promise<Book> {
  return request<Book>('/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function listBookCheckouts(bookId: number): Promise<Checkout[]> {
  return request<Checkout[]>(`/books/${bookId}/checkouts`)
}

export function createCheckout(payload: CheckoutFormValues): Promise<Checkout> {
  return request<Checkout>('/checkouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, book_id: Number(payload.book_id) }),
  })
}
