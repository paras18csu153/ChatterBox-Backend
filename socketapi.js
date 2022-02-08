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
  socket.on("sendMessage", (msg) => {
    console.log("message: " + msg.message);
    socket.emit("receiveMessage", msg);
  });
});
// end of socket.io logic

module.exports = socketapi;
