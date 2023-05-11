import express from "express";
const router = express.Router();
import connection from "../models/connection.js";
const client = await connection();
import mongodb from "mongodb";

// create
router.post("/tasking", async (req, res) => {
  try {
    let request = req.body;
    if (request.status === "hold") {
      request.color = "warning";
    } else if (request.status === "success") {
      request.color = "success";
    } else if (request.status === "pending") {
      request.color = "secondary";
    }

    let response = client.db("planner").collection("task").insertOne(request);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

//All projects
router.get("/taskList", async (req, res) => {
  try {
    let resUser = await client
      .db("planner")
      .collection("task")
      .find()
      .toArray();
    res.json(resUser);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// get particular task and taking project
router.get("/taskLists/:id", async (req, res) => {
  try {
    let User = await client
      .db("planner")
      .collection("task")
      .find({
        projectId: req.params.id,
      })
      .toArray();

    res.json(User);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// get particular task
router.get("/findTask/:id", async (req, res) => {
  try {
    let User = await client
      .db("planner")
      .collection("task")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });
    res.json(User);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//Update
router.put("/update/:id", async (req, res) => {
  try {
    let User = await client
      .db("planner")
      .collection("task")
      .findOneAndUpdate(
        { _id: mongodb.ObjectId(req.params.id) },
        { $set: req.body }
      );
    let resUser = await client
      .db("planner")
      .collection("task")
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
      .collection("task")
      .findOneAndDelete({ _id: mongodb.ObjectId(req.params.id) });
    let resUser = await client
      .db("planner")
      .collection("task")
      .find()
      .toArray();
    res.json(resUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Activity Area

// activity
router.post("/activity", async (req, res) => {
  try {
    let request = req.body;
    if (request.status === "hold") {
      request.color = "warning";
    } else if (request.status === "success") {
      request.color = "success";
    } else if (request.status === "pending") {
      request.color = "secondary";
    }

    let response = client
      .db("planner")
      .collection("activity")
      .insertOne(request);

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

// get particular activity
router.get("/findActivity/:id", async (req, res) => {
  try {
    let User = await client
      .db("planner")
      .collection("activity")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });

    res.json(User);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//Update
router.put("/activityUpdate/:id", async (req, res) => {
  try {
    let User = await client
      .db("planner")
      .collection("activity")
      .findOneAndUpdate(
        { _id: mongodb.ObjectId(req.params.id) },
        { $set: req.body }
      );
    let resUser = await client
      .db("planner")
      .collection("activity")
      .find()
      .toArray();
    res.json(resUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Delete
router.delete("/activityDel/:id", async (req, res) => {
  try {
    let User = await client
      .db("planner")
      .collection("activity")
      .findOneAndDelete({ _id: mongodb.ObjectId(req.params.id) });
    let resUser = await client
      .db("planner")
      .collection("activity")
      .find()
      .toArray();
    res.json(resUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// grouped activity
router.get("/activities/:id", async (req, res) => {
  try {
    // Activity
    let activity = await client
      .db("planner")
      .collection("activity")
      .find({
        projectId: req.params.id,
      })
      .toArray();

    //Task
    let tasks = await client
      .db("planner")
      .collection("task")
      .find({
        projectId: req.params.id,
      })
      .toArray();

    for (let i = 0; i < tasks.length; i++) {
      for (let j = 0; j < activity.length; j++) {
        if (tasks[i].taskName === activity[j].task) {
          tasks[i].status = activity[j].status;
          tasks[i].color = activity[j].color;
          tasks[i].date = activity[j].date;
          tasks[i].startTime = activity[j].startTime;
          tasks[i].endTime = activity[j].endTime;
          tasks[i].activeDescription = activity[j].description;
          tasks[i].activityId = activity[j]._id;
        }
      }
    }

    let resUser = await client
      .db("planner")
      .collection("employee")
      .find()
      .toArray();

    let mem = tasks.map((el) => {
      return el.employee;
    });

    let gettingImage = (team, employee) => {
      let final = [];
      for (let i = 0; i < team.length; i++) {
        for (let j = 0; j < employee.length; j++) {
          if (team[i] === employee[j].firstName) {
            final.push(employee[j]);
          }
        }
      }
      return final;
    };

    let final = gettingImage(mem, resUser);

    for (let i = 0; i < tasks.length; i++) {
      for (let j = 0; j < final.length; j++) {
        if (tasks[i].employee === final[j].firstName) {
          tasks[i].profile = final[j].profile;
        }
      }
    }

    // let response = await client
    //   .db("planner")
    //   .collection("sumUp")
    //   .findOneAndUpdate(
    //     { id: "1a" },
    //     { $push: { details: { $each: [...employee] } } }
    //   );
    // console.log(tasks);
    res.json(tasks);
    // res.json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/final", async (req, res) => {
  try {
    let resUser = await client
      .db("planner")
      .collection("sumUp")
      .find()
      .toArray();
    res.json(resUser);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
