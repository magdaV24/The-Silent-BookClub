import React from "react";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import "./CommentForm.css";
import { timestamp, projectDatabase } from "../firebase/config";
import uuid from "react-uuid";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

export default function CommentForm({ parentId, parentUid, parentComment }) {
  const [comm, setComm] = useState("");
  const { user } = useAuthContext();

  const submitComment = async (e) => {
    e.preventDefault();

    try {
      let newComment = {
        displayName: user.displayName,
        photoURL: user.photoURL,
        content: comm,
        createdAt: formatDistanceToNow(
          timestamp.fromDate(new Date()).toDate(),
          { addSuffix: true }
        ),
        parentId: null || parentId,
        id: uuid(),
        likes: 0,
        dislikes: 0,
        children: [],
      };

      const dbRef = projectDatabase.ref("comments");
      let commentList = [];

      if (!parentId) {
        const newSetComment = dbRef.push();
        newSetComment.set(newComment);
        console.log(parentId);
      }

      if (parentId) {
        if (parentComment.children) {
          parentComment.children.push(newComment);
          const commentChild = dbRef.child(`${parentUid}`);
          commentChild.update({
            children: parentComment.children,
          });
        } else {
          commentList.push(newComment);
          const commentChild = dbRef.child(`${parentUid}`);
          commentChild.update({
            children: commentList,
          });
        }
      }
      setComm("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="comment-form" onSubmit={submitComment}>
      <label>
        <textarea
          required
          onChange={(e) => setComm(e.target.value)}
          value={comm}
        ></textarea>
      </label>
      <button>Add Comment!</button>
    </form>
  );
}
