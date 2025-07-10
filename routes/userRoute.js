import express from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  register,
  login,
  showUsers,
  userUpdate,
  userDelete,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
} from "../controllers/userController.js";
const Router = express.Router();
Router.post("/register", register);
Router.patch("/:id", authenticate, authorize("admin"), userUpdate);
Router.delete("/:id", authenticate, authorize("admin"), userDelete);
Router.get("/users", authenticate, authorize("admin"), showUsers);
Router.post("/login", login);
Router.get("/:id/profile",authenticate,authorize("user"),getUserProfile);
Router.patch("/:id/profile",authenticate,authorize("user"),updateUserProfile);
Router.patch("/:id/password",authenticate,authorize("user"),updateUserPassword);
export default Router;
