import styles from "./styles.module.css";
import { useState, useEffect, useRef } from "react";

const Messages = ({ socket }) => {
  const [messagesReceived, setMessagesReceived] = useState([]);

  const messagesColumnRef = useRef(null);

  // Runs whenever a socket event is received from the server
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          msg: data.msg,
          username: data.username,
          created: data.created,
        },
      ]);
    });

    // Remove event listener on component unmount
    return () => socket.off("receive_message");
  }, [socket]);

  // Last 100 messages sent
  useEffect(() => {
    socket.on("last_100_messages", (last100Messages) => {
      console.log("Last 100 messages:", JSON.parse(last100Messages));
      last100Messages = JSON.parse(last100Messages);
      setMessagesReceived((state) => [...last100Messages, ...state]);
    });

    return () => socket.off("last_100_messages");
  }, [socket]);

  // Scroll to the most recent message.
  useEffect(() => {
    messagesColumnRef.current.scrollTop =
      messagesColumnRef.current.scrollHeight;
  }, [messagesReceived]);

  // dd/mm/yyyy hh:mm:ss
  const formatDate = (ISODateStr) => new Date(ISODateStr).toLocaleDateString();

  return (
    <div className={styles.messagesColumn} ref={messagesColumnRef}>
      {messagesReceived.map((msgData, i) => (
        <div className={styles.message} key={i}>
          <div className={styles.msgInfo}>
            <span className={styles.msgMeta}>{msgData.username}</span>
            <span className={styles.msgMeta}>{formatDate(msgData.created)}</span>
          </div>
          <p className={styles.msgText}>{msgData.msg}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Messages;
