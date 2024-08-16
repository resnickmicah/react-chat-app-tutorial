import styles from "./styles.module.css";
import { useState } from "react";

const SendMessage = ({ socket, username, room }) => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message !== "") {
      const created = (new Date()).toISOString();

      // Send message to server.
      // We can't specify who we send the message to from the front end.
      // We can only send to server.
      // The server can then send message to the other users in the room.
      socket.emit("send_message", { username, room, message, created });
      setMessage("");
    }
  };

  return (
    <div className={styles.sendMessageContainer}>
      <input
        className={styles.messageInput}
        placeholder='Message...'
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <button className="btn btn-primary" onClick={sendMessage}>
        Send Message
      </button>
    </div>
  );
};

export default SendMessage;
