from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, create_engine, select, Session
from typing import Optional, Literal, Annotated
from pydantic import Field as PydanticField 

class Book(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)  
    title: str
    author: str
    notes: Optional[str] = None
    status: str = "want_to_read"

class BookCreate(SQLModel):
    title: Annotated[str, PydanticField(min_length=1, max_length=200)]
    author: Annotated[str, PydanticField(min_length=1, max_length=200)]
    notes: Optional[str] = None

class BookStatusUpdate(SQLModel):
    status: Literal["want_to_read", "reading", "finished"]

engine = create_engine("sqlite:///bookshelf.db")
SQLModel.metadata.create_all(engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_session():
    with Session(engine) as session:
        yield session

@app.get("/books")
def get_all(status: Optional[str] = None, session: Session = Depends(get_session)):
    query = select(Book)
    if status:
        query = query.where(Book.status == status)
    return session.exec(query).all()

@app.post("/books", status_code=201)
def create_book(book: BookCreate, session: Session = Depends(get_session)):
    db_book = Book(**book.model_dump())
    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book

@app.patch("/books/{book_id}")
def update_status(book_id: int, update: BookStatusUpdate, session: Session = Depends(get_session)):
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    book.status = update.status
    session.add(book)
    session.commit()
    session.refresh(book)
    return book

@app.delete("/books/{book_id}", status_code=204)
def delete_book(book_id: int, session: Session = Depends(get_session)):
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    session.delete(book)
    session.commit()