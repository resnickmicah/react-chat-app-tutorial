import axios from "axios";

function pgGetMessages(room) {
  const dbUrl = process.env.PGRST_URL;
  const dbToken = process.env.PGRST_TOKEN;
  if (!dbUrl) {
    return Promise.reject(new Error("Missing PGRST_URL"));
  }

  if (!dbToken) {
    return Promise.reject(new Error("Missing PGRST_TOKEN"));
  }

  const parametrizedUrl = dbUrl + `?room=eq.${room}&order=created.desc&limit=100`;
  console.log(`Fetching last 100 msgs for room ${room}: ${parametrizedUrl}`);

  const config = {
    method: 'get',
    url: parametrizedUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${dbToken}`,
    }
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

export default pgGetMessages;
