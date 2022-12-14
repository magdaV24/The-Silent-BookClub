import "./CommentForm.css";
import React, { useState } from "react";
import Avatar from "./Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReply,
  faSquarePen,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import CommentForm from "./CommentForm";
import { projectDatabase } from "../firebase/config";

const EditBox = ({ comment, commentUid }) => {
  const dbRef = projectDatabase.ref("comments");
  const [edit, setEdit] = useState(comment.content);

  const editComment = (e) => {
    e.preventDefault();

    const editMade = dbRef.child(`${commentUid}`);
    editMade.update({
      content: edit,
    });

    setEdit("");
  };

  return (
    <form className="edit-box" onSubmit={editComment}>
      <textarea onChange={(e) => setEdit(e.target.value)} value={edit}>
        {edit}
      </textarea>
      <button>Edit Comment!</button>
    </form>
  );
};

export default function Comment({ comment }) {
  const [isReplaying, setIsReplaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="box">
      <div key={comment.id}>
        <li className="comment">
          <div className="user">
            <Avatar src={comment.photoURL} />
            <p>{comment.displayName}</p>
            <p className="comment-date">{comment.createdAt}</p>
          </div>
          <div className="content">
            <p>{comment.content}</p>
          </div>
          <div className="buttons">
            <div className="actions">
              <button
                className="replay"
                onClick={() => setIsReplaying((prev) => !prev)}
              >
                <FontAwesomeIcon icon={faReply} />
              </button>
              <button
                className="edit"
                onClick={() => setIsEditing((prev) => !prev)}
              >
                <FontAwesomeIcon icon={faSquarePen} />
              </button>
            </div>
            <div className="reactions">
              <form className="like">
                <button className="like_btn">
                  <FontAwesomeIcon icon={faThumbsUp} />
                </button>
                <div className="likes">{comment.likes}</div>
              </form>
              <form className="like">
                <button className="dislike_btn">
                  <FontAwesomeIcon icon={faThumbsDown} />
                </button>
                <div className="dislikes">{comment.dislikes}</div>
              </form>
            </div>
          </div>
        </li>
        <div className="reply-box">
          {isReplaying && (
            <CommentForm
              parentId={comment.id}
              parentUid={comment.i}
              parentComment={comment}
            />
          )}
        </div>

        <div className="editing-box">
          {isEditing && <EditBox comment={comment} commentUid={comment.i} />}
        </div>

        <div className="children-box">
          {comment.children &&
            comment.children.map((child) => {
              return (
                <div className="child-comment" key={Math.random()}>
                  <Comment comment={child} />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
