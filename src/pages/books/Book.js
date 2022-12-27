import "./MainPage.css";
import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import MoreInfo from "./MoreInfo";

export default function Book({ book }) {
  const { user } = useAuthContext();
  const { addDocument } = useFirestore("books");
  const [ visible, setVisible ] = useState(false)

  let message = '';

  if(visible){
    message = 'Less info'
  } else {
    message = 'More info'
  }

  const addBook = (book) => {
    const cover =
      book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.smallThumbnail;

    addDocument({
      addedBy: user.displayName,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors,
      status: "",
      cover,
      publishedAt: book.volumeInfo.publishedDate,
      rating: book.volumeInfo.averageRating,
      pages: book.volumeInfo.pageCount,
      ratingCount: book.volumeInfo.ratingsCount,
      maturity: book.volumeInfo.maturityRating,
      publisher: book.volumeInfo.publisher,
      synopsis: book.volumeInfo.description,
      category: book.volumeInfo.categories,
      userRating: 0,
      userReview: "",
      picture: user.photoURL,
      publicReview: false,
      postLikes: 0,
      postDislikes: 0,
      responses: [],
      postLikedBy: [],
      postDislikedBy: [],
    });

    console.log(book);
  };

  let cover =
    book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.smallThumbnail;
  if (cover !== undefined) {
    return (
      <>
        <div className="cover" key={book.accessInfo.id}>
          <img src={cover} alt="cover" />
          <div>
            {book.volumeInfo.authors &&
              book.volumeInfo.authors.map((author) => {
                return <h3 className="author">{author}</h3>;
              })}
          </div>
          <h4>{book.volumeInfo.title}</h4>
          <div className="cover-buttons">
            <button
              className="more-info"
              onClick={() => setVisible(prev => !prev)}
            >
              {message}
            </button>
            <button className="add-to-collection" onClick={() => addBook(book)}>
              Add to collection
            </button>
          </div>
        </div>
        {visible && <MoreInfo book={book} />}
      </>
    );
  }
}
