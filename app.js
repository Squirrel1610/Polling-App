const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();


const app = express();

//connect db
connectDB();

//set public folder
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

const pollRoute = require("./routes/poll");
app.use("/poll", pollRoute);

app.get("/hello", (req, res) => {
    res.send("Hello");
})

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})