// backend/index.js
require("dotenv").config();
const videoRoute = require("./routes/videoRoute");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use(videoRoute);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
