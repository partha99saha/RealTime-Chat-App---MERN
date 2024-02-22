require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
const MONGODB_URI = process.env.MONGO_ATLAS;
const { serverErrorHandler, pageNotFoundError } =
  require('./middleware/errorHandling');

app.use(cors());
app.use(helmet());
app.use(express.json());

mongoose.set("strictQuery", false)
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("DB Connected");
  }).catch((err) => {
    console.log(err);
    console.log("DB connection error");
  })

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use(serverErrorHandler);
app.use(pageNotFoundError);

const httpServer = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

global.onlineUsers = new Map();
const io = socket(httpServer, {
  cors: {
    origin: process.env.React_HOST,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
