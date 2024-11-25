const authRouter = require("./auth.router");

const initialRouter = (app) => {
  app.use("/api/v1/auth", authRouter);
};

module.exports = initialRouter;
