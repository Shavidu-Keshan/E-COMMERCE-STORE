import express from "express";
import { addToCart,removeAllFromCart, updateQuantity, getCartProducts } from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", protectRoute,getCartProducts);
router.post("/", protectRoute,addToCart);
router.post("/", protectRoute,removeAllFromCart);
router.post("/:id", protectRoute,updateQuantity);

export default router