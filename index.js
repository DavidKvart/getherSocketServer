const express = require("express");
const app = express();
const http = require("http"); // server for amit in socket
const { Server } = require("socket.io"); // why in object
const cors = require("cors");

//! middleweres
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
//!middleweres

//* socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("client connected ON" + socket.id);

  socket.on("send_locaition", (data) => {
    console.log(data.roomID);
    socket.to(data.roomID).emit("receive_location", data);
  });

  socket.on("join_room", (data) => {
    console.log("join room:" + data + "user:" + socket.id);
    socket.join(data);
  });
  socket.on("leave_room", (data) => {
    console.log("user left room:   " + data.room);
    socket.leave(data.room);
  });
  socket.on("mongo_was_updated", (data) => {
    socket.to(data.roomID).emit("refresh_event");
  });
  socket.on("user_deleted_event", (data) => {
    socket.to(data.roomID).emit("event_was_deleted", data);
  });
});
//* socket
let port = process.env.PORT || 3200;
//! liseners
server.listen(port, () => {
  console.log(`socker RUN: ${port}`);
});
