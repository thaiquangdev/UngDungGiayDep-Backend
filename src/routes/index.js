const authRouter = require("./auth.router");
const categoryRouter = require("./category.router");
const brandRouter = require("./brand.router");
const productRouter = require("./product.router");
const userRouter = require("./user.router");
const wishlistRouter = require("./wishlist.router");

const initialRouter = (app) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/wishlists", wishlistRouter);
};

module.exports = initialRouter;
