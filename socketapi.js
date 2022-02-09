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
    data = {
      username: data.username,
      socket: socket,
    };
    sockets.push(data);
  });

  socket.on("sendMessage", (msg) => {
    var sendToSocket = sockets.filter(function (el) {
      return el.username == msg.to;
    })[0].socket;

    // for (var i = 0; i < sockets.length; i++) {
    //   if (sockets[i].username == msg.to) {
    //     sendToSocket = sockets[i].socket;
    //     break;
    //   }
    // }

    if (sendToSocket) {
      sendToSocket.emit("receiveMessage", msg);
    }
  });
});
// end of socket.io logic

module.exports = socketapi;
