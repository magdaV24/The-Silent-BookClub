import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFirestore } from "../hooks/useFirestore";
import { timestamp } from "../firebase/config";
import { useCollection } from "../hooks/useCollection";
import Avatar from "../components/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faSquarePen } from "@fortawesome/free-solid-svg-icons";
import {
  faThumbsDown,
  faThumbsUp,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import "./CommentStyles.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

export default function Parent({ parent }) {
  const { user } = useAuthContext();
  const { addDocument, updateDocument } = useFirestore("children");
  const { addDoc } = useFirestore("notifications");
  const { updateDoc } = useFirestore("comments");
  const [isReplying, setIsReplying] = useState(false);
  const [child, setChild] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { documents, error } = useCollection("children", [
    "parentId",
    "==",
    parent.id,
  ]);

  const deleteComment = async (parent, e) => {
    e.preventDefault();
    console.log(parent.parentId);
    if (parent.parentId === undefined) {
      await updateDoc(parent.id, {
        content: "[deleted]",
      });
    } else {
      await updateDocument(parent.id, {
        content: "[deleted]",
      });
    }
  };

  const likeComment = async (doc, e) => {
    e.preventDefault();
    const arr = doc.likedBy;
    const arr2 = doc.dislikedBy;

    if (doc.parentId) {
      try {
        if (arr.includes(user.displayName)) {
          let index = arr.indexOf(user.displayName);
          arr.splice(index, 1);
          await updateDocument(doc.id, {
            likes: doc.likes - 1,
            likedBy: arr,
          });
          return;
        }
        if (!arr.includes(user.displayName)) {
          await updateDocument(doc.id, {
            likes: doc.likes + 1,
            likedBy: [...doc.likedBy, user.displayName],
          });
          arr.push(user.displayName);
          const notification = {
            message: " liked your post!",
            notificationTo: doc.createdBy,
            notificationBy: user.displayName,
          };
          addDoc(notification);
        }
        if (arr2.includes(user.displayName)) {
          let index = arr2.indexOf(user.displayName);
          let newArr = doc.dislikedBy;
          newArr.splice(index, 1);
          await updateDocument(doc.id, {
            dislikes: doc.dislikes - 1,
            dislikedBy: newArr,
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        if (arr.includes(user.displayName)) {
          let index = arr.indexOf(user.displayName);
          arr.splice(index, 1);
          await updateDoc(doc.id, {
            likes: doc.likes - 1,
            likedBy: arr,
          });
          return;
        }
        if (!arr.includes(user.displayName)) {
          await updateDoc(doc.id, {
            likes: doc.likes + 1,
            likedBy: [...doc.likedBy, user.displayName],
          });
          arr.push(user.displayName);
          const notification = {
            message: " liked your post!",
            notificationTo: doc.createdBy,
            notificationBy: user.displayName,
          };
          addDoc(notification);
        }
        if (arr2.includes(user.displayName)) {
          let index = arr2.indexOf(user.displayName);
          let newArr = doc.dislikedBy;
          newArr.splice(index, 1);
          await updateDoc(doc.id, {
            dislikes: doc.dislikes - 1,
            dislikedBy: newArr,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const dislikeComment = async (doc, e) => {
    e.preventDefault();
    const arr = doc.dislikedBy;
    const arr2 = doc.likedBy;

    if (doc.parentId) {
      try {
        if (arr.includes(user.displayName)) {
          let index = arr.indexOf(user.displayName);
          arr.splice(index, 1);
          await updateDocument(doc.id, {
            dislikes: doc.dislikes - 1,
            dislikedBy: arr,
          });
          return;
        }
        if (!arr.includes(user.displayName)) {
          await updateDocument(doc.id, {
            dislikes: doc.dislikes + 1,
            dislikedBy: [...doc.dislikedBy, user.displayName],
          });
          arr.push(user.displayName);
          const notification = {
            message: " disliked your post!",
            notificationTo: doc.createdBy,
            notificationBy: user.displayName,
            read: false,
          };
          addDoc(notification);
        }
        if (arr2.includes(user.displayName)) {
          let index = arr2.indexOf(user.displayName);
          let newArr = doc.likedBy;
          newArr.splice(index, 1);
          await updateDocument(doc.id, {
            likes: doc.likes - 1,
            likedBy: newArr,
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        if (arr.includes(user.displayName)) {
          let index = arr.indexOf(user.displayName);
          arr.splice(index, 1);
          await updateDoc(doc.id, {
            dislikes: doc.dislikes - 1,
            dislikedBy: arr,
          });
          return;
        }
        if (!arr.includes(user.displayName)) {
          await updateDoc(doc.id, {
            dislikes: doc.dislikes + 1,
            dislikedBy: [...doc.dislikedBy, user.displayName],
          });
          arr.push(user.displayName);
          const notification = {
            message: " disliked your post!",
            notificationTo: doc.createdBy,
            notificationBy: user.displayName,
            read: false,
          };
          addDoc(notification);
        }
        if (arr2.includes(user.displayName)) {
          let index = arr2.indexOf(user.displayName);
          let newArr = doc.likedBy;
          newArr.splice(index, 1);
          await updateDoc(doc.id, {
            likes: doc.likes - 1,
            likedBy: newArr,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const EditBox = ({ comment }) => {
    const [edit, setEdit] = useState(comment.content);

    if (user.displayName !== comment.createdBy) {
      return null;
    }
    if (comment.content === "[deleted]") {
      const notification = {
        message: "This comment was deleted! You can't edit it anymore",
        notificationTo: user.displayName,
      };
      addDoc(notification);
      return null;
    }

    if (user.displayName === comment.createdBy) {
      const editComment = async (e) => {
        e.preventDefault();

        if (comment.parentId === undefined) {
          try {
            await updateDoc(comment.id, {
              content: edit,
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            await updateDocument(comment.id, {
              content: edit,
            });
          } catch (error) {
            console.log(error);
          }
        }
      };

      return (
        <form className="edit-box" onSubmit={editComment}>
          <textarea onChange={(e) => setEdit(e.target.value)} value={edit}>
            {edit}
          </textarea>
          <button>Edit Comment!</button>
        </form>
      );
    }
  };

  const Child = ({ parentId, parentComment }) => {
    const handleSubmit = (e) => {
      e.preventDefault();
      addDocument({
        createdBy: user.displayName,
        picture: user.photoURL,
        content: child,
        parentId: parentId,
        createdAt: timestamp.fromDate(new Date()),
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
      });
      setChild("");

      addDoc({
        message: ' replied to your comment!',
        notificationBy: user.displayName,
        notificationTo: parentComment.createdBy
      })
    };

    return (
      <div>
        <form onSubmit={handleSubmit} className='reply-box'>
          <textarea onChange={(e) => setChild(e.target.value)} value={child} style={{width: '90%'}}/>
          <button>Reply</button>
        </form>
      </div>
    );
  };
  return (
    <>
      <div className="box">
        <div key={parent.id}>
          <div className="comment">
            <div className="user">
              <div style={{ display: "flex", gap: "10px" }}>
                <Avatar src={parent.picture} />
                <p style={{ fontSize: "18px" }}>{parent.createdBy}</p>
                <p style={{ opacity: ".8" }}>
                  {formatDistanceToNow(parent.createdAt.toDate(),{ addSuffix: true })}
                </p>
              </div>
              <div>
                <button
                  className="trash-can"
                  onClick={(e) => deleteComment(parent, e)}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            </div>
            <div className="comment-content">
              <p style={{ fontSize: "20px" }}>{parent.content}</p>
            </div>
            <div className="buttons">
              <div className="actions">
                <button
                  className="replay"
                  onClick={() => setIsReplying((prev) => !prev)}
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
                  <button
                    className="like_btn"
                    onClick={(e) => likeComment(parent, e)}
                  >
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </button>
                  <div className="likes">{parent.likes}</div>
                </form>
                <form className="like">
                  <button
                    className="dislike_btn"
                    onClick={(e) => dislikeComment(parent, e)}
                  >
                    <FontAwesomeIcon icon={faThumbsDown} />
                  </button>
                  <div className="dislikes">{parent.dislikes}</div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isReplying && <Child parentId={parent.id} parentComment={parent}/>}
      {isEditing && <EditBox comment={parent} />}
      {error && { error }}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: 'flex-end' }}>
        {documents &&
          documents.map((child) => (
            <div key={Math.random()} style={{width: '95%'}}>
              <Parent parent={child} />
            </div>
          ))}
      </div>
    </>
  );
}
