import { useState, useEffect } from "react";
import { getBooks } from "./api/books";
import AddBookForm from "./components/AddBookForm";
import FilterBar from "./components/FilterBar";
import BookList from "./components/BookList";

export default function App() {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBooks(filter)
      .then(setBooks)
      .catch(err => setError(err.message));
  }, [filter]);

  return (
    <div className="container">
      <h1>Bookshelf</h1>
      <AddBookForm onAdd={book => setBooks(prev => [...prev, book])} />
      <FilterBar active={filter} onChange={setFilter} />
      {error && <p className="error">{error}</p>}
      <BookList books={books} setBooks={setBooks} />
    </div>
  );
}