const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true }, // "Primary Key" in assignment
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // encrypted
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("User", userSchema);