require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/db")

connectToDB();

app.listen(3000, (req, res) => {
  console.log("Server is running on 3000");
});
