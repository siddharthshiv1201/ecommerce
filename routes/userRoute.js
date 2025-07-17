import express from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  register,
  login,
  showUsers,
  userDelete,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  addUserByAdmin,
  updateUser,
} from "../controllers/userController.js";
const Router = express.Router();
Router.post("/register", register);
Router.patch("/:id", updateUser);
// Router.delete("/:id", authenticate, authorize("admin"), userDelete);
Router.delete("/:id", authenticate, userDelete);
// Router.get("/users", authenticate, authorize("admin"), showUsers);
Router.get("/users", showUsers);



Router.post("/login", login);
Router.get("/:id/profile",authenticate,authorize("user"),getUserProfile);
Router.patch("/:id/profile",authenticate,authorize("user"),updateUserProfile);
Router.patch("/:id/password",authenticate,authorize("user"),updateUserPassword);
// Router.post("/create-user", authenticate, addUserByAdmin);

Router.post("/create-user", authenticate, addUserByAdmin);
export default Router;
