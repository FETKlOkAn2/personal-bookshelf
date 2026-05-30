import { updateStatus, deleteBook } from "../api/books";

const STATUSES = [
  { value: "want_to_read", label: "Want to read" },
  { value: "reading",      label: "Reading" },
  { value: "finished",     label: "Finished" },
];

export default function BookItem({ book, setBooks }) {
  async function handleStatusChange(e) {
    const updated = await updateStatus(book.id, e.target.value);
    setBooks(prev => prev.map(b => b.id === book.id ? updated : b));
  }

  async function handleDelete() {
    if (!confirm("Remove this book?")) return;
    await deleteBook(book.id);
    setBooks(prev => prev.filter(b => b.id !== book.id));
  }

  return (
    <div className="book-item">
      <div className="book-info">
        <div className="book-title">{book.title}</div>
        <div className="book-author">{book.author}</div>
      </div>
      <select value={book.status} onChange={handleStatusChange}>
        {STATUSES.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <button className="delete-btn" onClick={handleDelete}>Remove</button>
    </div>
  );
}