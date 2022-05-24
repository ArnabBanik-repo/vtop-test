const express = require("express");
const mainController = require("./controllers/mainController");
const app = express();
app.use("/assets", express.static("./public/assets"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

mainController(app);

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
