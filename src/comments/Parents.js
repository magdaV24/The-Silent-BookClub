import React from "react";
import { useCollection } from "../hooks/useCollection";
import Parent from "./Parent";
import './CommentStyles.css'

export default function Parents({event}) {
  const { documents, error } = useCollection("comments", [
    "eventId", 
    "==",
    event.id
  ]);
  if(error){
    console.log(error)
  }

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'column'}}>{documents && documents.map((parent) => <Parent parent={parent} />)}</div>
    </div>
  );
}
