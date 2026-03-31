const mongoose = require("mongoose");

async function connectToDB() {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("Conected to DB");
}

module.exports = connectToDB;
