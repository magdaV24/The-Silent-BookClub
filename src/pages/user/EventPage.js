import "./EventPage.css";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import Participants from "../../components/Participants";
import Sidebar from "../../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenFancy } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";
import { useFirestore } from "../../hooks/useFirestore";
import { useAuthContext } from "../../hooks/useAuthContext";
import { timestamp } from "../../firebase/config";
import Parents from "../../comments/Parents";

export default function EventPage() {
  const { id } = useParams();
  const { error, document } = useDocument("event-list", id);
  const [comment, setComment] = useState("");
  const { addDocument } = useFirestore("comments");
  const { user } = useAuthContext();

  if (error) {
    return <p>{error}</p>;
  }

  if (!document) {
    return <p>Loading document...</p>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    addDocument({
      createdBy: user.displayName,
      picture: user.photoURL,
      createdAt: timestamp.fromDate(new Date()),
      content: comment,
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
      eventId: document.id,
    });
    setComment("");
  };

  return (
    <>
      <Navbar />
      <div className="body">
        <Sidebar />

        <div className="event-page">
          <div className="header">
            <div
              className="title"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: 'center'
              }}
            >
              <h1 className="bold">{document.title} by</h1>
              <h2 className="inclined" style={{ color: "var(--acc-color)" }}>
                {document.author}
              </h2>
            </div>
            <div className="tags inclined">
              {document.tagsList.map((tag) => (
                <p key={Math.random()}>{tag.genere}</p>
              ))}
            </div>
            <div className="user">
              This event was created by:{" "}
              {document.createdBy.map(({ displayName }) => (
                <span key={Math.random()}>{displayName}</span>
              ))}
            </div>
          </div>

          <div className="participants">
            <Participants event={document} />
          </div>

          <div className="info-box">
            <p>
              A short description of {document.title}: {document.description}
            </p>
          </div>

          <div>
            <h4 style={{ color: "var(--acc-color)" }}>
              In addition to the synopsis for this book, here are some
              interesting facts about it:
            </h4>
            <div>
              {document.factList.map((fact) => (
                <div key={Math.random()} className="fact-list">
                  <li>
                    <FontAwesomeIcon icon={faPenFancy} />
                    {fact}
                  </li>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ color: "var(--acc-color" }}>Rules of conduct!</h3>
            <p>Keep the discussions civilized!</p>
            <p>Avoid giving away spoilers until the date of the event!</p>
          </div>

          <div style={{ width: "95%", height: "fit-comment", padding: "20px" }}>
            <h4 style={{ color: "var(--acc-color" }}>
              Discussions take place below:
            </h4>
            <div>
              <form
                onSubmit={handleSubmit}
                style={{
                  width: "100%",
                  minHeight: "200px",
                  height: "fit-content",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <textarea
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  style={{
                    width: "98%",
                    minHeight: "200px",
                    height: "fit-content",
                    backgroundColor: "var(--acc-color)",
                    color: "var(--background-color)",
                    font: "inherit",
                    outline: "none",
                    borderRadius: "4px",
                    border: "3px inset var(--primary-color)",
                    padding: "10px",
                    letterSpacing: "inherit",
                  }}
                />
                <button
                  style={{
                    width: "100%",
                    height: "50px",
                    border: "none",
                    outline: "none",
                    marginTop: "10px",
                    font: "inherit",
                    cursor: "pointer",
                    backgroundColor: "var(--primary-color)",
                    color: "var(--acc-color)",
                  }}
                >
                  Submit Comment
                </button>
              </form>
            </div>
            <Parents event={document} />
          </div>
        </div>
      </div>
    </>
  );
}
