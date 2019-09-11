const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//body parser middleware (now is included in express -> no need to npm install)
//allow to access req.body and convert the user’s input into the JSON format
// Mongoose provides a save function that will take a JSON object and store it in the database
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config
const db = require("./config/keys").mongoURI;

//connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// const connectDB = async () => {
//   try {
//     await mongoose.connect(db);
//     console.log('db connected');
//   }
//   catch (err) {
//     console.log(err);
//   }
// }
// module.exports = connectDB;

//app.get("/", (req, res) => res.send("Hellossssss"));

//passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

//use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
