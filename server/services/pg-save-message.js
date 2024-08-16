import axios from "axios";

function pgSaveMessage(message, username, room, created) {
  const dbUrl = process.env.PGRST_URL;
  const dbToken = process.env.PGRST_TOKEN;
  if (!dbUrl) {
    return Promise.reject(new Error("Missing PGRST_URL"));
  }

  if (!dbToken) {
    return Promise.reject(new Error("Missing PGRST_TOKEN"));
  }

  const data = JSON.stringify({
    msg: message,
    username: username,
    room: room,
    created: created,
  });

  const config = {
    method: 'post',
    url: dbUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${dbToken}`,
    },
    data: data,
  };

  return new Promise((resolve, reject) => {
    axios(config)
      .then(function (response) {
        resolve(JSON.stringify(response.data));
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export default pgSaveMessage;
