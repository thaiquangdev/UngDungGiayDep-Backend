const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./configs/dbConnect");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "PUT", "PATCH", "GET", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

dbConnect();

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
