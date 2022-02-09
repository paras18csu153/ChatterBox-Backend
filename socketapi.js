const io = require("socket.io")({
  cors: {
    origin: "http://localhost:4200",
  },
});

const socketapi = {
  io: io,
};

var sockets = [];

// Add your socket.io logic here!
io.on("connection", function (socket) {
  console.log("A user connected");

  socket.on("setSocketData", (data) => {
    sockets.push(data);
  });

  socket.on("sendMessage", (msg) => {
    if (sockets && sockets != undefined) {
      let socketId = sockets.find((o) => o.username === msg.to).socketId;
      socket.to(socketId).emit("receiveMessage", msg);
    }
  });
});
// end of socket.io logic

module.exports = socketapi;
