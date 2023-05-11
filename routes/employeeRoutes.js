import express from "express";
const router = express.Router();
import connection from "../models/connection.js";
const client = await connection();
import mongodb from "mongodb";
// get employee
router.get("/employees", async (req, res) => {
  try {
    let resUser = await client
      .db("planner")
      .collection("employee")
      .find()
      .toArray();
    res.json(resUser);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// get particular employee
router.get("/teamMember/:id", async (req, res) => {
  try {
    let User = await client
      .db("planner")
      .collection("employee")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });
    res.json(User);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//Update
router.put("/member/:id", async (req, res) => {
  try {
    let User = await client
      .db("planner")
      .collection("employee")
      .findOneAndUpdate(
        { _id: mongodb.ObjectId(req.params.id) },
        { $set: req.body }
      );
    let resUser = await client
      .db("planner")
      .collection("employee")
      .find()
      .toArray();
    res.json(resUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Delete
router.delete("/del/:id", async (req, res) => {
  try {
    let User = await client
      .db("planner")
      .collection("employee")
      .findOneAndDelete({ _id: mongodb.ObjectId(req.params.id) });
    let resUser = await client
      .db("planner")
      .collection("employee")
      .find()
      .toArray();
    res.json(resUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
