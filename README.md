My implementation of a basic chat room using React, Axios, Express, and Socket.io, based on a 2022 Tutorial by Danny Abrams from the [FreeCodeCamp website](https://www.freecodecamp.org/news/build-a-realtime-chat-app-with-react-express-socketio-and-harperdb/)

I diverge from that tutorial in a couple spots:
* [PostgREST](https://docs.postgrest.org/en/v12/tutorials/tut0.html) instead of HarperDB.
* ES6 Module imports instead of CommonJS imports on the server/NodeJS side.
* I put all styles in .css and apply them via more classes, no inline styles.

### Running locally ###

* Start DB: `cd docker && source .env && docker compose up -d`
* Start server: `cd server && npm run dev`
* Start client: `cd client && npm start`
