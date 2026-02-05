import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";


export const signup = async (req, res, next) => {

  const { name, email, password, confirmPassword, profileImageUrl } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !confirmPassword ||
    name === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  // 1. Validate Passwords Match
  if (password !== confirmPassword) {
    return next(errorHandler(400, "Passwords do not match"));
  }

  // 2. Check if user already exists
  const isAlreadyExist = await User.findOne({ email });

  if (isAlreadyExist) {
    return next(errorHandler(400, "User already exists"));
  }


  // Defaulting strictly to user for this public signup form
  const role = "user";

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    profileImageUrl,
    role,
  });

  try {
    await newUser.save();
    res.status(201).json("Signup successful");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password || email === "" || password === "") {
      return next(errorHandler(400, "All fields are required"))
    }

    const validUser = await User.findOne({ email })

    if (!validUser) {
      return next(errorHandler(404, "User not found!"))
    }

    // compare password
    const validPassword = bcryptjs.compareSync(password, validUser.password)

    if (!validPassword) {
      return next(errorHandler(400, "Wrong Credentials"))
    }

    const token = jwt.sign(
      { id: validUser._id, role: validUser.role },
      process.env.JWT_SECRET
    )

    const { password: pass, ...rest } = validUser._doc

    res.status(200).cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }).json(rest)
  } catch (error) {
    next(error)
  }
}

export const userProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return next(errorHandler(404, "User not found!"))
    }

    const { password: pass, ...rest } = user._doc

    res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
}

export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return next(errorHandler(404, "User not found!"))
    }

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if (req.body.password) {
      user.password = bcryptjs.hashSync(req.body.password, 10)
    }

    const updatedUser = await user.save()

    const { password: pass, ...rest } = user._doc

    res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
}

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.BACKEND_URL
        : `${req.protocol}://${req.get("host")}`

    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`

    res.status(200).json({ imageUrl })
  } catch (error) {
    next(error)
  }
}


export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been loggedout successfully!")
  } catch (error) {
    next(error)
  }
}
