const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./configs/dbConnect");
const initialRouter = require("./routes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "https://ung-dung-giay-dep-fontend.vercel.app",
    methods: ["POST", "PUT", "PATCH", "GET", "DELETE"],
    credentials: true,
  })
);

app.options("*", (req, res) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://ung-dung-giay-dep-fontend.vercel.app"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204); // No Content
});

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(cookieParser());

dbConnect();

initialRouter(app);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
