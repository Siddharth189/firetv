const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { User } = require("./models");

const app = express();
app.use(cors());
const port = 8080;

// Connect to MongoDB
const dbURL =
  //   "mongodb+srv://siddharth:7s3XnilcOgUSNFEs@cluster0.xg2bger.mongodb.net/userDB?retryWrites=true&w=majority";
  "mongodb://localhost:27017/fireDB";

mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

// Middleware
app.use(bodyParser.json());

//********************************* Socket LOGIC *********************************/
const server = require("http").createServer(app);
const sckt = require("socket.io");
const io = sckt(server, {
  cors: {
    origin: "http://localhost:1234",
    credentials: true,
  },
});
const functions = require("./Functions");
const { SocketEvent } = require("./socket-event.enum");

users = [];
socketList = {};

rooms = {};

io.on(SocketEvent.CONNECTION, (socket) => {
  // Add new users and their sockets
  socket.on(SocketEvent.NEW_USER, (userId, name, color) => {
    try {
      users.push({ userId: userId, name: name, color: color });

      socket.userId = userId;
      socket.name = name;
      socket.color = color;
      socketList[userId] = socket;

      console.log("\nNew user added...");
      console.log(users);

      updateUsernames();
    } catch (error) {
      console.log(error);
    }
  });

  // Update name on clients
  const updateUsernames = () => {
    io.emit(SocketEvent.GET_USERS, users);
  };

  /**************************************************/
  /*                Private Chats                   */
  /**************************************************/

  // Send private message to specified client
  socket.on(SocketEvent.PRIVATE_MESSAGE, (to_userId, message) => {
    try {
      socket.emit(
        SocketEvent.SENT_MESSAGE,
        to_userId,
        socket.name,
        socket.color,
        message
      );
      socketList[to_userId.toString()].emit(
        SocketEvent.RECEIVED_MESSAGE,
        socket.userId,
        socket.name,
        socket.color,
        message
      );
    } catch (error) {
      console.log(error);
    }
  });

  // Notify when someone joins the chat
  socket.on(SocketEvent.JOIN_NOTIFY, (to_userId) => {
    try {
      socketList[to_userId.toString()].emit(
        SocketEvent.JOIN_NOTIFY,
        socket.userId,
        socket.name
      );
    } catch (error) {
      console.log(error);
    }
  });
  // Acknowledge that other client received the notification
  socket.on(SocketEvent.JOIN_NOTIFY_ACKNOWLEDGE, (to_userId) => {
    try {
      socketList[to_userId.toString()].emit(
        SocketEvent.JOIN_NOTIFY_ACKNOWLEDGE,
        socket.userId,
        socket.name
      );
    } catch (error) {
      console.log(error);
    }
  });

  // Notify when someone leaves the chat
  socket.on(SocketEvent.LEAVE_NOTIFY, (to_userId) => {
    try {
      socketList[to_userId.toString()].emit(
        SocketEvent.LEAVE_NOTIFY,
        socket.userId,
        socket.name
      );
    } catch (error) {
      console.log(error);
    }
  });

  // Notify when user is typing
  socket.on(SocketEvent.TYPING_NOTIFY, (to_userId) => {
    try {
      socketList[to_userId.toString()].emit(
        SocketEvent.TYPING_NOTIFY,
        socket.userId
      );
    } catch (error) {
      console.log(error);
    }
  });
  socket.on(SocketEvent.TYPING_STOPPED_NOTIFY, (to_userId) => {
    try {
      socketList[to_userId.toString()].emit(
        SocketEvent.TYPING_STOPPED_NOTIFY,
        socket.userId
      );
    } catch (error) {
      console.log(error);
    }
  });

  /**************************************************/
  /*                 Chat Rooms                     */
  /**************************************************/

  // Create room
  socket.on(SocketEvent.CREATE_ROOM, () => {
    try {
      if (socket.userId !== undefined) {
        const roomId = functions.generateRoomId(7);

        socket.join(roomId);

        let room = {
          host: { userId: socket.userId, name: socket.name },
          participants: [],
        };
        rooms[roomId] = room;

        room = { roomId: roomId, ...room };

        socket.emit(SocketEvent.ROOM_CREATED, room);

        // console.log(room);
        console.log(
          "---------------------------ROOMS---------------------------"
        );
        for (let i = 0; i < Object.keys(rooms).length; i++) {
          let roomId = Object.keys(rooms)[i];
          console.log(rooms[roomId]);
        }
        console.log(
          "-----------------------------------------------------------"
        );
      }
    } catch (error) {
      console.log(error);
    }
  });

  // Join room
  socket.on(SocketEvent.JOIN_ROOM, (roomId) => {
    try {
      if (rooms[roomId] !== undefined) {
        var userExists = rooms[roomId].participants.some(
          (participant) => participant.userId === socket.userId
        );
        if (rooms[roomId].host.userId !== socket.userId && !userExists) {
          socket.join(roomId);

          rooms[roomId].participants.push({
            userId: socket.userId,
            name: socket.name,
          });

          let room = rooms[roomId];
          room = { roomId: roomId, ...room };

          io.to(roomId).emit(
            SocketEvent.ROOM_JOINED,
            roomId,
            socket.userId,
            socket.name,
            room
          );

          io.to(roomId).emit(
            SocketEvent.JOIN_ROOM_NOTIFY,
            roomId,
            socket.userId,
            socket.name,
            "joined the room"
          );

          console.log(`\n${socket.userId} joined room ${roomId}...`);
          console.log(room);
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  // Close room
  socket.on(SocketEvent.CLOSE_ROOM, (roomId) => {
    try {
      if (rooms[roomId].host.userId === socket.userId) {
        io.to(roomId).emit(SocketEvent.ROOM_CLOSED, roomId);

        rooms[roomId].participants.map((participant) => {
          socketList[participant.userId].leave(roomId);
        });

        socket.leave(roomId);

        delete rooms[roomId];

        console.log(rooms);
      }
    } catch (error) {
      console.log(error);
    }
  });

  // Leave room
  socket.on(SocketEvent.LEAVE_ROOM, (roomId, userId) => {
    try {
      let temp = rooms[roomId].participants.filter(
        (item) => item.userId !== userId
      );
      rooms[roomId].participants = temp;

      io.to(roomId).emit(SocketEvent.LEFT_ROOM, roomId, userId);

      socketList[userId].leave(roomId);

      console.log("\n~~~~~~~~~~User Left the Room~~~~~~~~~~~~~~");
      console.log(rooms[roomId]);
      console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    } catch (error) {
      console.log(error);
    }
  });

  // Send message to specified room
  socket.on(SocketEvent.ROOM_MESSAGE, (roomId, message) => {
    try {
      // socket.emit(SocketEvent.ROOM_MESSAGE', roomId, socket.name, socket.color, message);
      io.to(roomId).emit(
        SocketEvent.ROOM_MESSAGE,
        roomId,
        socket.userId,
        socket.name,
        socket.color,
        message
      );
    } catch (error) {
      console.log(error);
    }
  });

  // Notify in room when someone joins the chat
  socket.on(SocketEvent.JOIN_ROOM_NOTIFY, (roomId, notify_text) => {
    try {
      io.to(roomId).emit(
        SocketEvent.JOIN_ROOM_NOTIFY,
        roomId,
        socket.userId,
        socket.name,
        notify_text
      );
    } catch (error) {
      console.log(error);
    }
  });
  // Acknowledge to room that other client received the notification
  socket.on(SocketEvent.JOIN_ROOM_NOTIFY_ACKNOWLEDGE, (roomId, notify_text) => {
    try {
      io.to(roomId).emit(
        SocketEvent.JOIN_ROOM_NOTIFY_ACKNOWLEDGE,
        roomId,
        socket.userId,
        socket.name,
        notify_text
      );
    } catch (error) {
      console.log(error);
    }
  });

  // Notify in room when someone leaves the chat
  socket.on(SocketEvent.LEAVE_ROOM_NOTIFY, (roomId, notify_text) => {
    try {
      io.to(roomId).emit(
        SocketEvent.LEAVE_ROOM_NOTIFY,
        roomId,
        socket.userId,
        socket.name,
        notify_text
      );
    } catch (error) {
      console.log(error);
    }
  });

  // Notify in room when host removes any participant
  socket.on(SocketEvent.REMOVED_FROM_ROOM_NOTIFY, (roomId, userId) => {
    try {
      io.to(roomId).emit(
        SocketEvent.REMOVED_FROM_ROOM_NOTIFY,
        roomId,
        userId,
        socketList[userId].name
      );
    } catch (error) {
      console.log(error);
    }
  });

  // Notify in room when user is typing
  socket.on(SocketEvent.TYPING_ROOM_NOTIFY, (roomId) => {
    try {
      io.to(roomId).emit(
        SocketEvent.TYPING_ROOM_NOTIFY,
        roomId,
        socket.userId,
        socket.name
      );
    } catch (error) {
      console.log(error);
    }
  });
  socket.on(SocketEvent.TYPING_STOPPED_ROOM_NOTIFY, (roomId) => {
    try {
      io.to(roomId).emit(
        SocketEvent.TYPING_STOPPED_ROOM_NOTIFY,
        roomId,
        socket.userId
      );
    } catch (error) {
      console.log(error);
    }
  });

  // Remove socket from all rooms
  const removeSocketFromRooms = (socket) => {
    try {
      let roomsToDelete = [];
      const roomCount = Object.keys(rooms).length;

      for (let i = 0; i < roomCount; i++) {
        let roomId = Object.keys(rooms)[i];

        if (rooms[roomId].host.userId === socket.userId) {
          console.log(rooms[roomId]);
          io.to(roomId).emit(SocketEvent.ROOM_CLOSED, roomId);

          rooms[roomId].participants.map((participant) => {
            socketList[participant.userId].leave(roomId);
          });

          socket.leave(roomId);
          roomsToDelete.push(roomId);
        } else {
          rooms[roomId].participants.map((participant, index) => {
            if (participant.userId === socket.userId) {
              rooms[roomId].participants.splice(index, 1);

              io.to(roomId).emit(SocketEvent.LEFT_ROOM, roomId, socket.userId);

              io.to(roomId).emit(
                SocketEvent.LEAVE_ROOM_NOTIFY,
                roomId,
                socket.userId,
                socket.name,
                "left the room"
              );

              socketList[socket.userId].leave(roomId);
            }
          });
        }
      }
      // Delete all rooms created by disconnected host
      for (let i = 0; i < roomsToDelete.length; i++) {
        delete rooms[roomsToDelete[i]];
      }
      // console.log('---------------------------ROOMS---------------------------');
      // for (let i = 0; i < Object.keys(rooms).length; i++) {
      //   let roomId = Object.keys(rooms)[i];
      //   console.log(rooms[roomId]);
      // }
      // console.log('-----------------------------------------------------------');
    } catch (error) {
      console.log(error);
    }
  };

  // Remove socket on server
  const removeSocket = (socket) => {
    try {
      users = users.filter((user) => user.userId !== socket.userId);
      delete socketList[socket.userId];
      io.emit(SocketEvent.LEAVE_NOTIFY, socket.userId, socket.name);
      io.emit("user_disconnected", socket.userId);
      // updateUsernames();
      console.log(`\n${socket.name} (${socket.userId}) disconnected`);
    } catch (error) {
      console.log(error);
    }
  };

  // Remove socket when client disconnects
  socket.on(SocketEvent.DISCONNECT, (data) => {
    removeSocketFromRooms(socket);
    removeSocket(socket);
  });
});

/***************************************************************************/

//*************************Logic For Endpoints Start Here ************************/
// Register endpoint
app.post("/register", async (req, res) => {
  try {
    // Check if email already exists
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create the user
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();

    // Create and sign the JWT token
    const token = jwt.sign({ userId: newUser._id }, "secret_key");
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    // Check if email exists
    const user = await User.findOne({ email: req.body.email });
    console.log("User => ", user);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create and sign the JWT token
    const token = jwt.sign({ userId: user._id }, "secret_key");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// AI search endpoint
app.post("/search-msg", async (req, res) => {
  try {
    console.log("/***********************************************/");
    console.log("Hello from search msg", req.body);
    console.log("/***********************************************/");

    res.status(200).json("success");
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
/***************************************************************************/

app.get("/api", (req, res) => {
  console.log("PING RECEIVED");
  res.send("success");
});

//*****************************************************************************/
// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
