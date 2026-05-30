import { useState } from "react";
import { createBook } from "../api/books";

export default function AddBookForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const book = await createBook({ title, author });
      onAdd(book);
      setTitle("");
      setAuthor("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="add-form">
      <h2>Add a book</h2>
      <div className="form-row">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          required
        />
        <button onClick={handleSubmit}>Add</button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}