import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"

/* REGISTER USER */ 
export const register = async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        picturePath,  
        friends,
        points,
        location,
      } = req.body;
  
      const salt = await bcrypt.genSalt(); // creating salt to encrypt our password
      const passwordHash = await bcrypt.hash(password, salt);
  
      const newUser = new User({ //passes in a new user
        firstName,
        lastName,
        email,
        password,
        picturePath,
        friends,
        points: Math.floor(Math.random() * 10000),
        location,
        viewedProfile: Math.floor(Math.random() * 10000), // we are getting a fake value
        impressions: Math.floor(Math.random() * 10000),
      });
      const savedUser = await newUser.save();
	  // res is provided by express
	  // 201 is the status code that means something has been created
	  // creates the json version of the saved
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  /* LOGGING IN */
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
	  // uses mongoose to find the specified email
      const user = await User.findOne({ email: email });
	  // if the user cannot be found
      if (!user) return res.status(400).json({ msg: "User does not exist. " });
  
	  // first parameter is the one that was sent, second compares it in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      delete user.password;
      res.status(200).json({ token, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };