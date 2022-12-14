import "./EventPage.css";
import React from "react";
import { useParams } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import Participants from "../../components/Participants";
import Sidebar from "../../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenFancy } from "@fortawesome/free-solid-svg-icons";
import CommentForm from "../../components/CommentForm";
import Comments from "../../components/Comments";

export default function EventPage() {
  const { id } = useParams();
  const { error, document } = useDocument("event-list", id);

  if (error) {
    return <p>{error}</p>;
  }

  if (!document) {
    return <p>Loading document...</p>;
  }

  return (
    <div className="body">
      <Sidebar />

      <div className="event-page">
        <div className="header">
          <div className="title">
            <span className="bold">{document.title} by</span>
            <span className="inclined">{document.author}</span>
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
          <h4>
            In addition to the synopsis for this book, here are some interesting
            facts about it:
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
          <h3>Rules of conduct!</h3>
          <p>Keep the discussions civilized!</p>
          <p>Avoid giving away spoilers until the date of the event!</p>
        </div>

        <div>
          <h4>Discussions take place below:</h4>
          <CommentForm parentId={null} parentUid={null} />
          <Comments />
        </div>
      </div>
    </div>
  );
}
