import "./User.css";
import React from "react";
import { useCollection } from "../../hooks/useCollection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-regular-svg-icons";
import { useFirestore } from "../../hooks/useFirestore";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function Responses({ doc }) {
  const { documents, error } = useCollection("responses", [
    "postId",
    "==",
    doc.id,
  ]);

  const { updateDocument } = useFirestore("responses");
  const { user } = useAuthContext();
  const { addDoc } = useFirestore("notifications");

  const likePost = async (doc, e) => {
    e.preventDefault();
    const arr = doc.postLikedBy;
    const arr2 = doc.postDislikedBy;

    try {
      if (arr.includes(user.displayName)) {
        let index = arr.indexOf(user.displayName);
        arr.splice(index, 1);
        await updateDocument(doc.id, {
          postLikes: doc.postLikes - 1,
          postLikedBy: arr,
        });
        return;
      }
      if (!arr.includes(user.displayName)) {
        await updateDocument(doc.id, {
          postLikes: doc.postLikes + 1,
          postLikedBy: [...doc.postLikedBy, user.displayName],
        });
        arr.push(user.displayName);
        const notification = {
          message: " liked your post!",
          notificationTo: doc.addedBy,
          notificationBy: user.displayName,
          read: false,
        };
        addDoc(notification);
      }
      if (arr2.includes(user.displayName)) {
        let index = arr2.indexOf(user.displayName);
        let newArr = doc.postDislikedBy;
        newArr.splice(index, 1);
        await updateDocument(doc.id, {
          postDislikes: doc.postDislikes - 1,
          postDislikedBy: newArr,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const dislikePost = async (doc, e) => {
    e.preventDefault();
    const arr = doc.postDislikedBy;
    const arr2 = doc.postLikedBy;

    try {
      if (arr.includes(user.displayName)) {
        let index = arr.indexOf(user.displayName);
        arr.splice(index, 1);
        await updateDocument(doc.id, {
          postDislikes: doc.postDislikes - 1,
          postDislikedBy: arr,
        });
        return;
      }
      if (!arr.includes(user.displayName)) {
        await updateDocument(doc.id, {
          postDislikes: doc.postDislikes + 1,
          postDislikedBy: [...doc.postDislikedBy, user.displayName],
        });
        arr.push(user.displayName);
        const notification = {
          message: " disliked your post!",
          notificationTo: doc.addedBy,
          notificationBy: user.displayName,
          read: false,
        };
        addDoc(notification);
      }
      if (arr2.includes(user.displayName)) {
        let index = arr2.indexOf(user.displayName);
        let newArr = doc.postLikedBy;
        newArr.splice(index, 1);
        await updateDocument(doc.id, {
          postLikes: doc.postLikes - 1,
          postLikedBy: newArr,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {error && { error }}
      <div>
        {documents &&
          documents.map((item) => (
            <div className="notification-box" key={Math.random()}>
              <div className="row-one">
                <img
                  src={item.picture || item.avatar}
                  alt="avatar"
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                />
                <p
                  style={{
                    marginLeft: "8px",
                    letterSpacing: ".12",
                    fontSize: "18px",
                  }}
                >
                  {item.createdBy}
                </p>
                <p
                  style={{
                    marginLeft: "8px",
                    letterSpacing: ".12",
                    fontSize: "18px",
                  }}
                >
                  replyed:
                </p>
              </div>
              <div style={{ fontSize: "20px" }}>{item.replyContent}</div>
              <div className="reply-buttons">
                <button onClick={(e) => likePost(item, e)}>
                  <FontAwesomeIcon icon={faThumbsUp} />
                </button>
                <span
                  style={{
                    marginLeft: "8px",
                    marginRight: "8px",
                    color: "var(--online)",
                  }}
                >
                  {item.postLikes}
                </span>
                <button onClick={(e) => dislikePost(item, e)}>
                  <FontAwesomeIcon icon={faThumbsDown} />
                </button>
                <span
                  style={{
                    marginLeft: "8px",
                    marginRight: "8px",
                    color: "var(--offline)",
                  }}
                >
                  {item.postDislikes}
                </span>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}