const express = require("express");
const app = express();
const connectDb = require("./config/db");
const authRoute = require("./routes/authRoute");
const documentRoute = require("./routes/documentRoute");

require("dotenv").config();
const cors = require("cors");
connectDb();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.use("/api/users/", authRoute);
app.use("/api/documents/", documentRoute);

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`App is running on port ${process.env.PORT || 5000}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("setup", ({ docData, user }) => {
    const { collaborators, owner, content, _id } = docData;
    //console.log("Setup event received");

    // Check if the user is the owner or a collaborator
    const isOwner = owner._id === user._id;
    const isCollaborator = collaborators.some(
      (collab) => collab.user._id === user._id
    );

    if (!isOwner && !isCollaborator) {
      //console.log("User is not authorized to access this document");
      socket.emit("unprovisioned");
      return;
    }

    socket.join(_id);
    socket.emit("loadDocument", content);
    //console.log("Document content sent");

    // Check if the user has read-only access
    const hasReadOnlyAccess = collaborators.some(
      (collab) => collab.user._id === user._id && collab.role === "read"
    );

    if (hasReadOnlyAccess) {
      socket.emit("readOnly");
    } else {
      socket.on("on-change", (delta) => {
        socket.broadcast.to(_id).emit("receive-change", delta);
      });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });
});
