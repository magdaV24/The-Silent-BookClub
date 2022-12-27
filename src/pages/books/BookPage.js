import "./BookPage.css";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useDocument } from "../../hooks/useDocument";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarReg } from "@fortawesome/free-regular-svg-icons";
import Select from "react-select";
import { useFirestore } from "../../hooks/useFirestore";

const options = [
  { value: "want-to-read", label: "Want to Read" },
  { value: "currentely-reading", label: "Currently Reading" },
  { value: "read", label: "Read" },
];

const stars = [
  { value: 1, label: "One Star" },
  { value: 2, label: "Two Stars" },
  { value: 3, label: "Three Stars" },
  { value: 4, label: "Four Stars" },
  { value: 5, label: "Five Stars" },
];

const publicReview = [
  { value: false, label: "Not Public" },
  { value: true, label: "Public" },
];

export default function BookPage() {
  const { id } = useParams();
  const { error, document } = useDocument("books", id);
  const { updateDocument, response } = useFirestore("books");

  const [ratingExists, setRatingExists] = useState(true);
  const [givingReview, setGivingReview] = useState(false);
  const [status, setStatus] = useState("");

  if (error) {
    return <p>{error}</p>;
  }

  if (!document) {
    return <p>Loading document...</p>;
  }

  const giveRating = (rating) => {
    let arr = [];
    let x = 5 - rating;
    if (rating === undefined) {
      arr.push(<p>No rating yet!</p>);
    } else {
      for (let i = 0; i < rating; i++) {
        arr.push(
          <FontAwesomeIcon
            icon={faStar}
            style={{
              color: "rgb(255,69,0)",
            }}
          />
        );
      }
      for (let i = 0; i < x; i++) {
        arr.push(
          <FontAwesomeIcon
            icon={faStarReg}
            style={{
              color: "rgb(255,69,0)",
            }}
          />
        );
      }
    }
    return arr;
  };

  if (document.rating === undefined) {
    setRatingExists(false);
  }

  let safeForKids = "";

  if (document.maturity === "NOT_MATURE") {
    safeForKids = "This book is safe to be read by children!";
  } else {
    safeForKids = "This book is not recommended towards children!";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newStatus = status.label;

    try {
      await updateDocument(document.id, {
        status: newStatus,
      });
    } catch (error) {}
    console.log(newStatus);

    if (!response.error) {
      setStatus(status);
    }

    setStatus(status);
  };

  let styles;

  if (document.status === "Read") {
    styles = {
      backgroundColor: "var(--read)",
      border: "3px outset var(--read-border)",
    };
  }

  if (document.status === "Want to Read") {
    styles = {
      backgroundColor: "var(--want-to-read)",
      border: "3px outset var(--want-to-read-border)",
    };
  }

  if (document.status === "Currently Reading") {
    styles = {
      backgroundColor: "var(--currently-reading)",
      border: "3px outset var(--currently-reading-border)",
    };
  }

  const Review = () => {
    const [star, setStar] = useState();
    const [review, setReview] = useState();
    const [isPublic, setIsPublic] = useState();

    const handleSubmit = async (e) => {
      e.preventDefault();
      const newStars = star.value;
      const newReview = review;
      const newPublic = isPublic.value;

      try {
        await updateDocument(document.id, {
          userRating: newStars,
          userReview: newReview,
          publicReview: newPublic,
        });
      } catch (error) {
        console.log(error);
      }
    };

    const selectStyles = {
      control: (styles) => ({
        ...styles,
        backgroundColor: "var(--primary-color)",
      }),
      option: (styles) => ({
        ...styles,
        backgroundColor: "var(--primary-color)",
        cursor: "pointer",
        color: "var(--acc-color)",
      }),
    };

    return (
      <form className="review-form" onSubmit={handleSubmit}>
        <h3>Your review</h3>
        <textarea
          style={{
            width: "90%",
            height: "200px",
            backgroundColor: "var(--primary-color)",
            font: "inherit",
            color: "var(--acc-color)",
            outline: "none",
            border: "none",
          }}
          onChange={(e) => setReview(e.target.value)}
          value={review}
        >
          {document.userReview}
        </textarea>
        <div
          style={{
            width: "50%",
            paddingLeft: "50px",
          }}
        >
          <Select
            onChange={(op) => setStar(op)}
            options={stars}
            value={star}
            placeholder="How many stars?"
            styles={selectStyles}
          />

          <Select
            onChange={(op) => setIsPublic(op)}
            options={publicReview}
            value={isPublic}
            placeholder="Do you want others to see your review"
            styles={selectStyles}
          />
        </div>
        <button
          style={{
            border: "1px solid var(--primary-color)",
            outline: "none",
            font: "inherit",
            width: "100px",
            height: "50px",
            marginTop: "8px",
          }}
        >
          Submit review!
        </button>
      </form>
    );
  };

  let message;
  if (document.userRating && document.userReview) {
    message = "Update Review";
  } else {
    message = "Give a Review";
  }

  return (
    <>
      <Navbar />
      <main>
        <Sidebar />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2 style={{ color: "var(--acc-color)", marginLeft: "50px" }}>
            About this book:
          </h2>
          <section
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div className="book-card" style={styles}>
              <div className="col-1">
                <div style={{ display: "flex", gap: "10px" }}>
                  <img src={document.cover} alt="cover" />
                  <div className="author-title">
                    <h3>{document.title}</h3>
                    {document.author &&
                      document.author.map((author) => {
                        return (
                          <h4
                            key={Math.random()}
                            style={{ marginTop: "-10px" }}
                          >
                            {author}
                          </h4>
                        );
                      })}
                    <div style={{ marginTop: "-15px", opacity: ".8" }}>
                      ({document.pages} pages)
                    </div>
                    <span style={{ marginTop: "20px" }}>
                      Published by {document.publisher} on{" "}
                      {document.publishedAt}
                    </span>
                  </div>
                </div>
                <div className="book-rating">
                  {ratingExists && (
                    <div style={{ marginTop: "30px" }}>
                      <span>This book has a rating of:</span>
                      <span
                        style={{
                          marginLeft: "8px",
                        }}
                      >
                        {giveRating(document.rating)}
                      </span>
                      <span> out of {document.ratingCount} ratings given!</span>
                    </div>
                  )}
                  {!ratingExists && <span>No rating was given yet!</span>}
                </div>
                <div
                  style={{
                    color: "rgb(165,42,42)",
                    marginBottom: "25px",
                    fontSize: "18px",
                    marginTop: "30px",
                  }}
                >
                  {safeForKids}
                </div>
              </div>
              <div className="col-2">
                <div>
                  {document.synopsis}
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      gap: "20px",
                      width: "fit-content",
                      height: "20px",
                      fontSize: "17px",
                      opacity: ".8",
                    }}
                  >
                    <span>Categories:</span>
                    {document.category &&
                      document.category.map((categ) => {
                        return (
                          <span
                            key={Math.random()}
                            style={{
                              fontSize: "17px",
                              marginLeft: "10px",
                            }}
                          >
                            {categ}
                          </span>
                        );
                      })}
                  </div>
                </div>
                <div className="functions">
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    <Select
                      onChange={(op) => setStatus(op)}
                      value={status}
                      options={options}
                      placeholder="Select Status"
                    />
                    <button
                      style={{
                        border: "none",
                        outline: "none",
                        cursor: "pointer",
                        backgroundColor: "var(--background-color)",
                        color: "var(--primary-color)",
                        borderRadius: "4px",
                        width: "160px",
                        font: "inherit",
                        marginTop: "10px",
                      }}
                    >
                      Choose Status
                    </button>
                  </form>
                  <button
                    style={{
                      border: "none",
                      outline: "none",
                      cursor: "pointer",
                      backgroundColor: "var(--background-color)",
                      color: "var(--primary-color)",
                      borderRadius: "4px",
                      width: "160px",
                      height: "80px",
                      font: "inherit",
                      marginTop: "20px",
                    }}
                    onClick={() => setGivingReview((prev) => !prev)}
                  >
                    {message}
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section>{givingReview && <Review />}</section>
          <h2 style={{ color: "var(--acc-color)", marginLeft: "50px" }}>
            Your review:
          </h2>
          <section
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "var(--primary-color)",
              color: "var(--background-color)",
              textAlign: "left",
              width: "80%",
              height: "400px",
              margin: "50px",
              padding: "10px",
              borderRadius: "4px",
              gap: "15px",
            }}
          >
            <div
              style={{
                height: "10%",
                width: "98%",
                backgroundColor: "var(--acc-color)",
                padding: "10px",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                borderRadius: "4px",
              }}
            >
              {giveRating(document.userRating)}
            </div>
            <div
              style={{
                height: "90%",
                width: "98%",
                backgroundColor: "var(--acc-color)",
                padding: "10px",
                color: "var(--background-color)",
                borderRadius: "4px",
              }}
            >
              {document.userReview}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
