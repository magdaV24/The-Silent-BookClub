import "./User.css";
import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useCollection } from "../../hooks/useCollection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faStarReg,
  faCommentDots,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-regular-svg-icons";
import { useFirestore } from "../../hooks/useFirestore";
import { useAuthContext } from "../../hooks/useAuthContext";
import Responses from "./Responses";

export default function User() {
  const { documents, error } = useCollection("books", [
    "publicReview",
    "==",
    true,
  ]);

  const { user } = useAuthContext("");

  const [replying, setReplying] = useState(false); 

  //will generate stars 

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
              color: "rgb(255,140,0)",
            }}
          />
        );
      }
      for (let i = 0; i < x; i++) {
        arr.push(
          <FontAwesomeIcon
            icon={faStarReg}
            style={{
              color: "rgb(255,140,0)",
            }}
          />
        );
      }
    }
    return arr;
  };

  const { addDocument } = useFirestore("responses");
  const { addDoc } = useFirestore("notifications");
  const { updateDocument } = useFirestore('books');

  //the reply box;

  const Response = ({ postId, postAuthor }) => {
    const [content, setContent] = useState("");

    //create replys to the posts:
    const handleSubmit = (e) => {
      e.preventDefault();

      const replyContent = content;
      const addedBy = user.displayName;
      const picture = user.photoURL;

      addDocument({
        replyContent,
        addedBy,
        picture,
        postId,
        postLikes: 0,
        postDislikes: 0,
        postLikedBy: [],
        postDislikedBy: [],
      });
      //create notification
      const notification = {
        notificationTo: postAuthor,
        notificationBy: user.displayName,
        message: " responded to your post!",
        read: false
      };
      addDoc(notification);
      console.log(notification);

      setContent("");
    };

    return (
      <form onSubmit={handleSubmit} style={{ display: "flex", margin: "20px" }}>
        <textarea
          onChange={(e) => setContent(e.target.value)}
          value={content}
          style={{
            width: "60vw",
            height: "20vh",
            backgroundColor: "var(--acc-color)",
            font: "inherit",
            outline: "none",
            border: "none",
            borderRadius: "4px",
            letterSpacing: ".1rem",
          }}
        />
        <button
          style={{
            backgroundColor: "var(--primary-color)",
            border: "1px solid var(--acc-color)",
            borderRadius: "4px",
            color: "var(--acc-color)",
            width: "70px",
            font: "inherit",
          }}
        >
          Reply!
        </button>
      </form>
    );
  };

  const likePost = async (doc, e) => {
    e.preventDefault();
    const arr = doc.postLikedBy;
    const arr2 = doc.postDislikedBy;

    try {
      if (arr.includes(user.displayName)) {
        let index = arr.indexOf(user.displayName)
        arr.splice(index, 1)
        await updateDocument(doc.id, {
          postLikes: doc.postLikes - 1,
          postLikedBy: arr
        });
        return
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
          read: false
        };
        addDoc(notification);
      }
      if (arr2.includes(user.displayName)) {
        let index = arr2.indexOf(user.displayName)
        let newArr = doc.postDislikedBy
        newArr.splice(index, 1)
        await updateDocument(doc.id, {
          postDislikes: doc.postDislikes - 1,
          postDislikedBy: newArr
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
        let index = arr.indexOf(user.displayName)
        arr.splice(index, 1)
        await updateDocument(doc.id, {
          postDislikes: doc.postDislikes - 1,
          postDislikedBy: arr
        });
        return
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
          read: false
        };
        addDoc(notification);
      }
      if (arr2.includes(user.displayName)) {
        let index = arr2.indexOf(user.displayName)
        let newArr = doc.postLikedBy
        newArr.splice(index, 1)
        await updateDocument(doc.id, {
          postLikes: doc.postLikes - 1,
          postLikedBy: newArr
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="user-home">
        <Sidebar />
        <div>
          {error && { error }}
          {!documents && (
            <span style={{ color: "var(--acc-color)" }}>
              There are no public reviews yet!
            </span>
          )}
          <div className="posts">
            {documents &&
              documents.map((book) => (
                <div key={Math.random()}>
                  <div className="post-wrapper">
                    <div className="post-user">
                      <img
                        src={book.picture}
                        alt="avatar"
                        style={{
                          width: "50px",
                          height: "50px",
                          border: "none",
                        }}
                      />
                      <p style={{ marginLeft: "10px", fontSize: "20px" }}>
                        {book.addedBy}
                      </p>
                      <p style={{ marginLeft: "10px", fontSize: "20px" }}>
                        gave
                      </p>
                      <p style={{ marginLeft: "10px", fontSize: "20px" }}>
                        {book.title}
                      </p>
                      <p style={{ marginLeft: "10px", fontSize: "20px" }}>by</p>
                      {book.author &&
                        book.author.map((x) => (
                          <p style={{ marginLeft: "10px", fontSize: "20px" }}>
                            {x}
                          </p>
                        ))}
                      <p style={{ marginLeft: "10px", fontSize: "20px" }}>
                        a review:
                      </p>
                    </div>
                    <div className="post-star">
                      {giveRating(book.userRating)}
                    </div>
                    <div className="post-review">{book.userReview}</div>
                    <div className="post-buttons">
                      <button onClick={() => setReplying((prev) => !prev)}>
                        <FontAwesomeIcon icon={faCommentDots} />
                      </button>
                      <div>
                        <button onClick={(e) => likePost(book, e)}>
                          <FontAwesomeIcon icon={faThumbsUp} />
                        </button>
                        <span
                          style={{
                            marginLeft: "8px",
                            marginRight: "8px",
                            color: "var(--online)",
                          }}
                        >
                          {book.postLikes}
                        </span>
                        <button onClick={(e) => dislikePost(book, e)}>
                          <FontAwesomeIcon icon={faThumbsDown} />
                        </button>
                        <span
                          style={{
                            marginLeft: "8px",
                            marginRight: "8px",
                            color: "var(--offline)",
                          }}
                        >
                          {book.postDislikes}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {replying && (
                      <Response postAuthor={book.addedBy} postId={book.id} />
                    )}
                  </div>
                  <Responses doc={book} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
