import BookItem from "./BookItem";

export default function BookList({ books, setBooks }) {
  if (books.length === 0) {
    return <p className="empty">No books here yet.</p>;
  }

  return (
    <div className="book-list">
      {books.map(book => (
        <BookItem key={book.id} book={book} setBooks={setBooks} />
      ))}
    </div>
  );
}