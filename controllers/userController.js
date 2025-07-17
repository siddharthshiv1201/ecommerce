import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

import dotenv from "dotenv";
dotenv.config();
const SECRET = process.env.SECRET;



const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedpwd = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      password: hashedpwd,
      role,
    };
    const result = await userModel.create(user);
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong." });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, password, role } = req.body;

    const updateData = { name, email, role };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      updatedUser,
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

const userDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await userModel.findByIdAndDelete(id);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const showUsers = async (req, res) => {
  try {
    const result = await userModel.find();
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const userObj = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
        const token = jwt.sign(userObj, SECRET, { expiresIn: "1h" });
        res.status(200).json({ userObj, token });
      } else {
        res.status(400).json({ message: "Invalid password" });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const id = req.params.id
    const user = await userModel.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
}


export const updateUserProfile = async (req, res) => {
  try {
    const id = req.params.id
    const user = await userModel.findByIdAndUpdate(id, req.body, { new: true });
    if (user) {
      res.status(201).json(user);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
}


export const updateUserPassword = async (req, res) => {
  try {
    const id = req.params.id
    const user = await userModel.findById(id);
    if (user) {
      const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
      if (isMatch) {
        const hashedpwd = await bcrypt.hash(req.body.newPassword, 10);
        user.password = hashedpwd;
        await user.save();
        res.status(201).json(user);
      } else {
        res.status(400).json({ message: "Invalid old password" });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
}
const addUserByAdmin = async (req, res) => {
  try {
    const {name, email, password, role} = req.body
    const user = await userModel.findOne({email})
    if(user) {
      return res.status(400).json({message: "User already exists"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser = await userModel.create({name, email, password: hashedPassword, role})

    res.status(201).json({message: "New User Added successfully", newUser, success: true})

  } catch (error) {
    console.log(error)
    res.status(400).json({message: "Something went wrong"})
  }
}
export { register, login, showUsers, updateUser, userDelete, addUserByAdmin };