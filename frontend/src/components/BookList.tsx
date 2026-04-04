import { useState, useEffect } from 'react';
import type { Book } from '../types/Book';
import { useCart } from '../context/CartContext';
import CategoryFilter from './CategoryFilter';
import CartSummary from './CartSummary';

const API_URL = 'http://localhost:5134/api/books';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { addToCart } = useCart();

  // Fetch categories on mount
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  // Fetch books when filters change
  useEffect(() => {
    const fetchBooks = async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (sortBy) {
        params.append('sortBy', sortBy);
        params.append('sortOrder', sortOrder);
      }

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`${API_URL}?${params}`);
      const data = await response.json();
      setBooks(data.books);
      setTotalCount(data.totalCount);
    };

    fetchBooks();
  }, [page, pageSize, sortBy, sortOrder, selectedCategory]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSortByTitle = () => {
    if (sortBy === 'title') {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy('title');
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleAddToCart = (book: Book) => {
    addToCart(book);
    setToastMessage(`"${book.title}" added to cart!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="container mt-4">
      {/* Header Row with Bootstrap Grid */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h1>Hilton's Bookstore</h1>
        </div>
        <div className="col-md-4">
          <CartSummary />
        </div>
      </div>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />

      {/* Controls Row */}
      <div className="row mb-3 align-items-center">
        <div className="col-auto">
          <button
            className="btn btn-outline-primary"
            onClick={handleSortByTitle}
          >
            Sort by Title{' '}
            {sortBy === 'title' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
          </button>
        </div>
        <div className="col-auto">
          <label className="me-2">Results per page:</label>
          <select
            className="form-select d-inline-block w-auto"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
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
                <th></th>
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
                      className="btn btn-sm btn-success"
                      onClick={() => handleAddToCart(book)}
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(page - 1)}>
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(p)}>
                {p}
              </button>
            </li>
          ))}
          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(page + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>

      <p className="text-center text-muted">
        Showing {totalCount === 0 ? 0 : (page - 1) * pageSize + 1}–
        {Math.min(page * pageSize, totalCount)} of {totalCount} books
      </p>

      {/* Bootstrap Toast Notification */}
      {toastMessage && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show" role="alert">
            <div className="toast-header bg-success text-white">
              <strong className="me-auto">Added to Cart</strong>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setToastMessage(null)}
              ></button>
            </div>
            <div className="toast-body">{toastMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookList;
