const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./configs/dbConnect");
const initialRouter = require("./routes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "https://ung-dung-giay-dep-fontend.vercel.app",
  "https://ung-dung-giay-dep-fontend-4upkbq1ux-thaiquangdevs-projects.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Cho phép truy cập
      } else {
        callback(new Error("Not allowed by CORS")); // Chặn truy cập nếu domain không hợp lệ
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức HTTP được phép
    credentials: true, // Nếu bạn dùng cookie cho xác thực, đặt `true`
  })
);

app.use(cookieParser());

dbConnect();

initialRouter(app);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
