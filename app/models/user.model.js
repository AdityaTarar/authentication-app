const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    fullName: String,
    password: String,
    email: { type: String, unique: true },
    dob: String,
    contactNumber: String,
  })
);

module.exports = User;
