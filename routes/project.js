import express from "express";
const router = express.Router();
import connection from "../models/connection.js";
const client = await connection();
import mongodb from "mongodb";
// create
router.post("/project", async (req, res) => {
  try {
    let request = req.body;
    if (request.state === "hold") {
      request.color = "warning";
    } else if (request.state === "success") {
      request.color = "danger";
    } else if (request.state === "pending") {
      request.color = "secondary";
    }

    let response = client
      .db("planner")
      .collection("project")
      .insertOne(request);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

//All projects
router.get("/projectList", async (req, res) => {
  try {
    let resUser = await client
      .db("planner")
      .collection("project")
      .find()
      .toArray();
    res.json(resUser);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// get particular project
router.get("/pro/:id", async (req, res) => {
  try {
    let User = await client
      .db("planner")
      .collection("project")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });
    res.json(User);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//Update
router.put("/pros/:id", async (req, res) => {
  try {
    let User = await client
      .db("planner")
      .collection("project")
      .findOneAndUpdate(
        { _id: mongodb.ObjectId(req.params.id) },
        { $set: req.body }
      );
    let resUser = await client
      .db("planner")
      .collection("project")
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
      .collection("project")
      .findOneAndDelete({ _id: mongodb.ObjectId(req.params.id) });
    let resUser = await client
      .db("planner")
      .collection("project")
      .find()
      .toArray();
    res.json(resUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
