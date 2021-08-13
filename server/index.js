const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } }); // allow all origin

app.set("view engine", "ejs");

app.get("/home", (req, res) => {
  res.render("home"); // ejs
  // console.log(res);
});

var users = [];

server.listen(3001, () => {
  console.log("Server is running");
});

io.on("connection", (socket) => {
  socket.send("Hello");
  console.log("User connected id: " + socket.id);
  socket.on("mychat", (chat) => {
    console.log(chat);
    socket.broadcast.emit("mychat", chat);
  });

  socket.on("user_connected", (username) => {
    users[username] = socket.id;
    console.log(username);
    io.emit("user_connected", username);
  });

  socket.on('send_message', (data) => {
    var id = users[data.receiver];
    io.to(id).emit('new_message', data);
  });
});
