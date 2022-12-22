import React from "react";
import { useCollection } from "../hooks/useCollection";
import Parent from "./Parent";
import './CommentStyles.css'

export default function Parents() {
  const { documents, error } = useCollection("comments");

  return (
    <div>
      {error & { error }}
      <div style={{display: 'flex', flexDirection: 'column'}}>{documents && documents.map((parent) => <Parent parent={parent} />)}</div>
    </div>
  );
}
