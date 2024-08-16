import styles from "./styles.module.css";
import { useState, useEffect } from "react";

const Messages = ({ socket }) => {
  const [messagesReceived, setMessagesReceived] = useState([]);

  // Runs whenever a socket event is received from the server
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          created: data.created,
        },
      ]);
    });

    // Remove event listener on component unmount
    return () => socket.off("receive_message");
  }, [socket]);

  // dd/mm/yyyy hh:mm:ss
  const formatDate = (ISODateStr) => Date.parse(ISODateStr).toLocaleDateString();

  return (
    <div className={styles.messagesColumn}>
      {messagesReceived.map((msg, i) => (
        <div className={styles.message} key={i}>
          <div className={styles.msgInfo}>
            <span className={styles.msgMeta}>{msg.username}</span>
            <span className={styles.msgMeta}>
              {formatDate(msg.created)}
            </span>
          </div>
          <p className={styles.msgText}>{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Messages;
