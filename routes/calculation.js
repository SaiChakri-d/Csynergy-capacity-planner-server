import express from "express";
const router = express.Router();
import connection from "../models/connection.js";
const client = await connection();
import mongodb from "mongodb";

router.get("/calculation", async (req, res) => {
  try {
    let final = [];

    // Taking task data from Db
    let tasks = await client.db("planner").collection("task").find().toArray();

    let projects = await client
      .db("planner")
      .collection("project")
      .find()
      .toArray();

    let activity = await client
      .db("planner")
      .collection("activity")
      .find()
      .toArray();

    let people = await client
      .db("planner")
      .collection("employee")
      .find()
      .toArray();

    // Calculating the project timeLine in days
    projects.forEach((el) => {
      let date1 = new Date(el.startDate);
      let date2 = new Date(el.endDate);
      // To calculate the time difference of two dates
      let Difference_In_Time = date2.getTime() - date1.getTime();
      // To calculate the no. of days between two dates
      let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      final.push({
        projectId: el._id,
        projectDeadLine: Difference_In_Days,
        taskData: [],
        activityData: [],
      });
    });

    // Calculating tasks on the particular project
    for (let i = 0; i < final.length; i++) {
      for (let j = 0; j < tasks.length; j++) {
        if (final[i].projectId == tasks[j].projectId) {
          final[i].taskData.push({
            taskId: tasks[j]._id,
            taskName: tasks[j].taskName,
            taskDate: tasks[j].date,
            taskTime: tasks[j].hrs,
            taskAssignedTo: tasks[j].employee,
            activityData: "",
          });
        }
      }
    }

    // adding the Activity for the task
    for (let i = 0; i < final.length; i++) {
      for (let j = 0; j < activity.length; j++) {
        if (final[i].projectId == activity[j].projectId) {
          final[i].activityData.push({
            activityId: activity[j]._id,
            activityName: activity[j].task,
            activityDate: activity[j].date,
            activityTime: activity[j].hrs,
          });
        }
      }
    }

    // adding  totalActivity details
    for (let i = 0; i < final.length; i++) {
      let activityArray = final[i].activityData;
      let taskArray = final[i].taskData;
      for (let j = 0; j < activityArray.length; j++) {
        for (let k = 0; k < taskArray.length; k++) {
          let activityName = activityArray[j].activityName;
          let taskName = taskArray[k].taskName;
          if (taskName == activityName) {
            taskArray[k].activityData = activityArray[j].activityTime;
          }
        }
      }
    }

    let totalMembers = people.map((el) => {
      const person = new Object();
      person.employeeName = el.firstName;
      person.scheduleTaskTime = [];
      person.activeTaskTime = [];
      return person;
    });

    // adding  totalTask details
    for (let i = 0; i < final.length; i++) {
      let taskArray = final[i].taskData;
      for (let j = 0; j < taskArray.length; j++) {
        for (let k = 0; k < totalMembers.length; k++) {
          let employee = taskArray[j].taskAssignedTo;
          let people = totalMembers[k].employeeName;
          if (employee === people) {
            totalMembers[k].scheduleTaskTime.push(taskArray[j].taskTime);
            totalMembers[k].activeTaskTime.push(taskArray[j].activityData);
          }
        }
      }
    }

    let findCapacity = (employee) => {
      let emp = +employee.length;
      let month = 22;
      let day = 8;
      let final = emp * month * day;
      return final;
    };

    let totalEmployeeCapacity = findCapacity(people);
    final.push({ totalEmployeeCapacity });

    let SchedulePerPerson = totalMembers.map((el) => {
      let data = el.scheduleTaskTime;
      return data.reduce((acc, item) => acc + parseInt(item), 0);
    });

    let ActivityPerPerson = totalMembers.map((el) => {
      let data = el.activeTaskTime;
      return data.reduce((acc, item) => acc + parseInt(item), 0);
    });

    for (let i = 0; i < totalMembers.length; i++) {
      totalMembers[i].scheduleTaskTime = SchedulePerPerson[i];
      totalMembers[i].activeTaskTime = ActivityPerPerson[i];
    }

    res.json(totalMembers);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
