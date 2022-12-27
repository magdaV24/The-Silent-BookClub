import "./Notification.css";
import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
//import { useFirestore } from "../../hooks/useFirestore";

export default function Notification() {
  const { user } = useAuthContext();
  const { documents, error } = useCollection("notifications", [
    "notificationTo",
    "==",
    user.displayName
  ]);

  const { deleteDocument } = useFirestore('notifications')

  const handleClick = (item,e) => {
    e.preventDefault();
    deleteDocument(item.id)
  }


  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <Sidebar />
        {error && { error }}
        <div
          className="notifications"
          style={{
            color: "var(--acc-color)",
            display: "flex",
            flexDirection: "column",
            padding: "50px",
            width: "90vw",
            alignItems: 'left'
          }}
        >
          {documents &&
            documents.map((notif) => (
              <div className="notification">
                <div>
                <span>{notif.notificationBy}</span>
                <span>{notif.message}</span>
                </div>
                <div>
                  <button onClick={(e) => handleClick(notif, e)}>Read</button>
                </div>
              </div>
              ))}
        </div>
      </div>
    </>
  );
}
