import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = express.Router();
import connection from "../models/connection.js";
const client = await connection();

// register
router.post("/register", async (req, res) => {
  try {
    let user = client.db("planner").collection("employee");
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;
    let final = await user.insertOne(req.body);
    res.json({ message: "User successfully registered" });
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});
// Login
router.post("/login", async (req, res) => {
  try {
    // getting the data from the db for the sent email
    let user = await client
      .db("planner")
      .collection("employee")
      .findOne({ email: req.body.email });

    // Login logic
    if (user) {
      let compare = await bcrypt.compare(req.body.password, user.password);
      if (compare) {
        if (user.AdminKey === req.body.AdminKey) {
          let token = jwt.sign({ _id: user._id }, process.env.SECRET, {
            expiresIn: "30m",
          });
          let userValues = {
            name: user.Name,
            token: token,
          };
          res.json({ userValues });
        } else {
          res.status(401).json({ message: "Add Admin Key" });
        }
      } else {
        res.status(401).json({ message: "password is wrong" });
      }
    } else {
      res.status(401).json({ message: "user email not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
