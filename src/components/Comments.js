import "./CommentForm.css";
import React, { useEffect, useState } from "react";
import { projectDatabase } from "../firebase/config";
import Comment from "./Comment";

export default function Comments() {
  const [commentList, setCommentList] = useState();

  useEffect(() => {
    const dataRef = projectDatabase.ref("comments");
    dataRef.on("value", (snapshot) => {
      const comments = snapshot.val();
      const commentList = [];
      for (let i in comments) {
        commentList.push({ i, ...comments[i] });
      }
      console.log(commentList);
      setCommentList(commentList);
    });
  }, []);

  return (
    <section>
      {commentList &&
        commentList.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
    </section>
  );
}
