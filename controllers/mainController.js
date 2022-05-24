let MongoClient = require("mongodb").MongoClient;
let url =
  "mongodb+srv://root:root@cluster0.8oeff.mongodb.net/?retryWrites=true&w=majority";

module.exports = (app) => {
  let spotlight = [
    {
      desc: "BHUM101N-ETHICS & VALUES: Winter 2021-22 FAT schedule for B.Tech Freshers",
      link: "http://www.google.com",
    },
    {
      desc: "Research Course Work Winter 21-22 Schedule",
      link: "http://www.google.com",
    },
    {
      desc: "Soft Skill Schedule for Fall 21-22 Re-FAT and Winter 21-22 Regular Arrear",
      link: "http://www.google.com",
    },
  ];

  app.get("/", (req, res) => {
    res.render("vtop", { events: spotlight });
  });

  app.get("/login", (req, res) => {
    res.render("login");
  });

  app.post("/login", (req, res) => {
    MongoClient.connect(url, (err, dbo) => {
      if (err) throw err;
      let db = dbo.db("vtop");

      let student = {
        username: req.body.username,
        password: req.body.pass,
      };

      db.collection("students").findOne(student, (err, student_data) => {
        if (err) throw err;
        if (!student_data) {
          db.collection("students")
            .find({})
            .toArray((err, data) => { });
          res.render("nostudent");
        } else {
          let courses = [];
          db.collection("courses")
            .find({})
            .toArray((err, data) => {
              if (err) throw err;
              else courses = data;
              res.render("courses", { student: student_data, courses: courses });
            });
        }
      });
    });
  });

  app.post("/newstudent", (req, res) => {
    MongoClient.connect(url, (err, dbo) => {
      let db = dbo.db("vtop");
      let student = {
        username: req.body.username,
        password: req.body.password,
        credits: 0,
        courses: [],
      };
      db.collection("students").insertOne(student, (err, data) => {
        if (err) throw err;
        else res.render("login");
      });
    });
  });

  app.post("/register", (req, res) => {
    MongoClient.connect(url, (err, dbo) => {
      if (err) throw err;
      let db = dbo.db("vtop");
      db.collection("courses").findOne(
        { id: req.body.courseId },
        (err, data) => {
          if (err) throw err;
          if (data)
            res.render("register", {
              course: data,
              student: {
                username: req.body.student,
                credits: req.body.credits,
              },
            });
        }
      );
    });
  });



  app.post("/slot", (req, res) => {

    MongoClient.connect(url, (err, dbo) => {

      let db = dbo.db("vtop");

      db.collection("students").findOne({ username: req.body.student }, (err, student) => {

        db.collection("courses").findOne({ id: req.body.courseId }, (err, course) => {

          for (let i = 0; i < student.courses.length; i++) {

            if (student.courses[i] == course.name) {
              res.render("test", { msg: "You are already registered for that course", student: student.username })
              return false;
            }
          }
          let slots = [];
          let courses = student.courses;

          for (let i = 0; i < course.slots.length; i++) {

            if (course.slots[i].slot == req.body.slotId) {

              if (course.slots[i].seats >= 1) {
                console.log(student.credits + course.credits)
                if (student.credits + course.credits > 9) {
                  res.render("test", { msg: "You can take a maximum of 9 credits", student: student.username })
                  break;
                }
                else {

                  let seats = course.slots[i].seats - 1;
                  courses.push(course.name);



                  slots.push({ slot: course.slots[i].slot, faculty: course.slots[i].faculty, seats: seats });
                }


              } else {
                res.render("test", { msg: "All seats are full", student: student.username })
              }

              //updating the number of seats in that slot
              db.collection("courses").updateOne({ id: req.body.courseId }, { $set: { slots: slots } }, (err, data) => {

                //updating the student collection course and credits field

                db.collection("students").updateOne({ username: req.body.student }, { $set: { credits: student.credits + course.credits } }, (err, data) => {

                  db.collection("students").updateOne({ username: req.body.student }, { $set: { courses: courses } }, (err, data) => {
                    res.render("test", { msg: "Seat booked successfully", student: student.username });
                  });
                });
              });

              break;

            } else {
              slots.push({ slot: course.slots[i].slot, faculty: course.slots[i].faculty, seats: course.slots[i].seats })
            }

          }

        })

      })

    })

  })

  app.post("/courses", (req, res) => {
    MongoClient.connect(url, (err, dbo) => {
      if (err) throw err;
      let db = dbo.db("vtop");

      let student = {
        username: req.body.username,
      };

      db.collection("students").findOne(student, (err, student_data) => {
        if (err) throw err;
        if (!student_data) {
          db.collection("students")
            .find({})
            .toArray((err, data) => { });
          res.render("nostudent");
        } else {
          let courses = [];
          db.collection("courses")
            .find({})
            .toArray((err, data) => {
              if (err) throw err;
              else courses = data;
              res.render("courses", { student: student_data, courses: courses });
            });
        }
      });
    });
  })


};
