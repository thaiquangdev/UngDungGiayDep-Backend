const authRouter = require("./auth.router");
const categoryRouter = require("./category.router");

const initialRouter = (app) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/categories", categoryRouter);
};

module.exports = initialRouter;
