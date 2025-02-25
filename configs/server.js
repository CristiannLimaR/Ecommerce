import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { dbConection } from "./mongo.js";
import authRoutes from "../src/auth/auth.routes.js"
import userRoutes from "../src/user/user.routes.js"
import categoryRoutes from "../src/category/category.routes.js"
import productRoutes from "../src/product/product.routes.js"
import cartRoutes from "../src/cart/cart.routes.js"


export const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(helmet());
};

const routes = (app) => {
    app.use("/ecommerce/v1/auth", authRoutes),
    app.use("/ecommerce/v1/users", userRoutes),
    app.use("/ecommerce/v1/categories", categoryRoutes),
    app.use("/ecommerce/v1/cart", cartRoutes),
    app.use("/ecommerce/v1/products", productRoutes)
    
};

const connectDB = async () => {
  try {
    await dbConection();
    console.log("Successful connection");
  } catch (error) {
    console.log("Error connecting to the database", error);
  }
};

export const initServer = () => {
  const app = express();
  const port = process.env.PORT || 3000;

  try {
    middlewares(app);
    connectDB();
    routes(app);
    app.listen(port);
    console.log(`Server running on port ${port}`);
  } catch (err) {
    console.log(`Server init failed: ${err}`);
  }
};