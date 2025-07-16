const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/")
    console.log("DB Connection done")
  } catch (err) {
    console.log("Mongo Connection failed" + err);
  }
};

module.exports = {
    connectDb
}
