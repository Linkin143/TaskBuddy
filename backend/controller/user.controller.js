import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const getUsers = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.user.id,
      role: "user",
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pendingTasks = await Task.countDocuments({
      assignedTo: user._id,
      status: "Pending",
    });

    const inProgressTasks = await Task.countDocuments({
      assignedTo: user._id,
      status: "In Progress",
    });

    const completedTasks = await Task.countDocuments({
      assignedTo: user._id,
      status: "Completed",
    });

    res.status(200).json({
      ...user._doc,
      pendingTasks,
      inProgressTasks,
      completedTasks,
    });
  } catch (error) {
    next(error);
  }
};


export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return next(errorHandler(404, "User not found!"))
    }

    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}
