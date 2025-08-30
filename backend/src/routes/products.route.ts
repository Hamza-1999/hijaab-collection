import { Router } from "express";
import multer from "multer";
import {
  createProduct,
  getAllProducts,
} from "../controllers/products.controller";
import { authenticateUser } from "../middlewares/auth.middleware";
import { adminAuthentication } from "../middlewares/admin.middleware";

const productsRoutes = Router();
const upload = multer({ dest: "uploads/" });
productsRoutes.post(
  "/create",
  authenticateUser,
  adminAuthentication,
  upload.array("images", 5),
  createProduct
);

productsRoutes.get("/all", getAllProducts);

export default productsRoutes;
