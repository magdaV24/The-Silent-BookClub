import "./MainPage.css";
import React from "react";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link } from "react-router-dom";

export default function MyBooks() {
  const { user } = useAuthContext();

  const { documents, error } = useCollection("books", [
    "addedBy",
    "==",
    user.displayName,
  ]);
  let styles
  // eslint-disable-next-line no-lone-blocks
  {documents && documents.forEach(document => {


    if(document.status === "Read"){
      styles = {
        backgroundColor: 'var(--read)',
        border: 'var(--read-border)'
      }
  }
  
  if(document.status === "Want to Read"){
    styles = {
      backgroundColor: 'var(--want-to-read)',
      border: 'var(--want-to-read-border)'
    }
  }
  
  if(document.status === "Currently Reading"){
    styles = {
      backgroundColor: 'var(--currently-reading)',
      border: 'var(--currently-reading-border)'
    }
  }
  })}

  return (
    <>
      {error && <p>{error}</p>}
      <h2>Your Books!</h2>
      <div className="books-box">
        {documents &&
          documents.map((book) => (
            <div className="book-box" key={Math.random()}  style={styles}>
              <img src={book.cover} alt="cover" />
              <div>
                {book.author &&
                  book.author.map((author) => {
                    return <h3 className="author">{author}</h3>;
                  })}
              </div>
              <Link to={`/book/${book.id}`}><h4 className='title'>{book.title}</h4></Link>
            </div>
          ))}
      </div>
    </>
  );
}
