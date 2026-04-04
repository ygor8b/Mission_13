import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types/Book';

const API_URL = 'http://localhost:5134/api/books';

const emptyForm = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: '',
  price: '',
};

function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingBookID, setEditingBookID] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    const response = await fetch(`${API_URL}?pageSize=1000`);
    const data = await response.json();
    setBooks(data.books);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bookData = {
      bookID: editingBookID ?? 0,
      title: form.title,
      author: form.author,
      publisher: form.publisher,
      isbn: form.isbn,
      classification: form.classification,
      category: form.category,
      pageCount: parseInt(form.pageCount),
      price: parseFloat(form.price),
    };

    if (editingBookID) {
      await fetch(`${API_URL}/${editingBookID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
    }

    setForm(emptyForm);
    setEditingBookID(null);
    fetchBooks();
  };

  const handleEdit = (book: Book) => {
    setEditingBookID(book.bookID);
    setForm({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      classification: book.classification,
      category: book.category,
      pageCount: book.pageCount.toString(),
      price: book.price.toString(),
    });
  };

  const handleDelete = async (bookID: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    await fetch(`${API_URL}/${bookID}`, { method: 'DELETE' });
    fetchBooks();
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingBookID(null);
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h1>Admin - Manage Books</h1>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/')}
          >
            &larr; Back to Bookstore
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">
                {editingBookID ? 'Edit Book' : 'Add New Book'}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Author</label>
                    <input
                      type="text"
                      className="form-control"
                      name="author"
                      value={form.author}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Publisher</label>
                    <input
                      type="text"
                      className="form-control"
                      name="publisher"
                      value={form.publisher}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">ISBN</label>
                    <input
                      type="text"
                      className="form-control"
                      name="isbn"
                      value={form.isbn}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Classification</label>
                    <input
                      type="text"
                      className="form-control"
                      name="classification"
                      value={form.classification}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Page Count</label>
                    <input
                      type="number"
                      className="form-control"
                      name="pageCount"
                      value={form.pageCount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <button type="submit" className="btn btn-primary me-2">
                    {editingBookID ? 'Update Book' : 'Add Book'}
                  </button>
                  {editingBookID && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="row">
        <div className="col-12">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Classification</th>
                <th>Category</th>
                <th>Page Count</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.bookID}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.isbn}</td>
                  <td>{book.classification}</td>
                  <td>{book.category}</td>
                  <td>{book.pageCount}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(book)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(book.bookID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminBooks;
