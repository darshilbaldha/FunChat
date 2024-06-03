//Node server whichh is handle socekt io connection
const express = require("express");
const app = express();
const path = require("path");
const http = require("http").createServer(app);

const PORT = process.env.PORT || 3000;

const indexPath = path.join(__dirname, "../index.html");

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
const cssPath = path.join(__dirname, "../css");
app.use(express.static(cssPath));

app.get("/", (req, res) => {
  res.sendFile(indexPath);
});

const io = require("socket.io")(http);
const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
