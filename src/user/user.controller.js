import { response, request } from "express";
import { hash, verify} from "argon2";
import User from "./user.model.js";


export const getUsers = async (req = request, res = response) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const query = { state: true };

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .skip(Number(offset))
        .limit(Number(limit))
    ]);

    res.status(200).json({
      success: true,
      total,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error when searching for users",
      error: error.message,
    });
  }
};

export const getUserById = async (req = request, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User not found",
      });
    }

    res.status(200).json({
      succes: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "error when searching for user",
      error: error.message,
    });
  }
};


export const updateUser = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { currentPassword, password, role, ...data } = req.body;

    if (req.user.role !== "ADMIN_ROLE" && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        msg: "You can only update your own account",
      });
    }

    if (req.user.role !== "ADMIN_ROLE" && role) {
      return res.status(403).json({
        success: false,
        msg: "You are not allowed to change your role",
      });
    }

    
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          msg: "Current password is required to update the password",
        });
      }

      const user = await User.findById(id);
      const validPassword = await verify( user.password, currentPassword);

      if (!validPassword) {
        return res.status(400).json({
          success: false,
          msg: "Current password is incorrect",
        });
      }

      data.role = role
      data.password = await hash(password);
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
      success: true,
      msg: "User successfully updated",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error updating user",
      error: error.message,
    });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "ADMIN_ROLE" && req.user.id !== id) {
      return res.status(403).json({
        success: false,
        msg: "You can only delete your own account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    await User.findByIdAndUpdate(id, { state: false }, { new: true });

    res.status(200).json({
      success: true,
      msg: "User deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error deactivating user",
      error: error.message,
    });
  }
};