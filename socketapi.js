const io = require("socket.io")({
  cors: {
    origin: "http://localhost:4200",
  },
});

const socketapi = {
  io: io,
};

// Add your socket.io logic here!
io.on("connection", function (socket) {
  console.log("A user connected");
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    socket.emit("new_msg", { message: msg });
  });
});
// end of socket.io logic

module.exports = socketapi;
