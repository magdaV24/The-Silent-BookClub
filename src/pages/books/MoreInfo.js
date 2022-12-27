import "./MainPage.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function MoreInfo({ book }) {

  const giveRating = (rating) => {
    let arr = [];
    if (rating === undefined) {
      arr.push(<p>No rating yet!</p>);
    } else {
      for (let i = 0; i < rating; i++) {
        arr.push(<FontAwesomeIcon icon={faStar} />);
      }
    }
    return arr;
  };

  return (
    <div>
      <div className="information-box">
        <div className="header">
          <div>
            {book.volumeInfo.authors &&
              book.volumeInfo.authors.map((author) => {
                return <h3 className="author">{author}</h3>;
              })}
            <h4>{book.volumeInfo.title}</h4>
          </div>
        </div>
        <div className="rating">
          {giveRating(book.volumeInfo.averageRating)}
        </div>
        <div>{book.volumeInfo.description}</div>
      </div>
    </div>
  );
}
